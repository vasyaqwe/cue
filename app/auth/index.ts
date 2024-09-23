import { type Database, db } from "@/db"
import {
   type Session,
   type User,
   type User as UserType,
   emailVerificationCodes,
   sessions,
   users,
} from "@/db/schema"
import { env } from "@/env"
import { GitHub } from "arctic"
import { eq } from "drizzle-orm"
import type { DatabaseAdapter, SessionAndUser } from "lucia"
import { Lucia, generateSessionId } from "lucia"
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo"
import { alphabet, generateRandomString } from "oslo/crypto"
import { parseCookies, setCookie } from "vinxi/http"

const adapter: DatabaseAdapter<Session, User> = {
   getSessionAndUser: async (
      sessionId: string,
   ): Promise<SessionAndUser<Session, UserType>> => {
      const result =
         (await db
            .select({
               user: users,
               session: sessions,
            })
            .from(sessions)
            .innerJoin(users, eq(sessions.userId, users.id))
            .where(eq(sessions.id, sessionId))
            .get()) ?? null
      if (result === null) {
         return { session: null, user: null }
      }
      return result
   },
   deleteSession: async (sessionId: string): Promise<void> => {
      db.delete(sessions).where(eq(sessions.id, sessionId)).run()
   },
   updateSessionExpiration: async (
      sessionId: string,
      expiresAt: Date,
   ): Promise<void> => {
      db.update(sessions)
         .set({
            expiresAt,
         })
         .where(eq(sessions.id, sessionId))
         .run()
   },
}

export const lucia = new Lucia(adapter, {
   secureCookies: !import.meta.env.DEV,
})

export const github = new GitHub(
   env.GITHUB_CLIENT_ID,
   env.GITHUB_CLIENT_SECRET,
   {},
)

export const createSession = async (userId: string) => {
   const session: Session = {
      id: generateSessionId(),
      userId: userId,
      expiresAt: lucia.getNewSessionExpiration(),
   }
   await db.insert(sessions).values(session)

   const sessionCookie = lucia.createSessionCookie(
      session.id,
      session.expiresAt,
   )

   return sessionCookie
}

export const auth = async () => {
   const sessionId = parseCookies()[lucia.sessionCookieName]

   if (!sessionId) {
      return {
         user: null,
         session: null,
      }
   }

   const { session, user } = await lucia.validateSession(sessionId)

   if (session !== null && Date.now() >= session.expiresAt.getTime()) {
      const sessionCookie = await createSession(user.id)
      setCookie(sessionCookie.name, sessionCookie.value, {
         ...sessionCookie.npmCookieOptions(),
      })
   }

   if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie()
      setCookie(sessionCookie.name, sessionCookie.value, {
         ...sessionCookie.npmCookieOptions(),
      })
   }

   return {
      user,
      session,
   }
}

export type Auth = Awaited<ReturnType<typeof auth>>

export const generateEmailVerificationCode = async ({
   tx,
   userId,
   email,
}: {
   tx: Database
   userId: string
   email: string
}) => {
   await tx
      .delete(emailVerificationCodes)
      .where(eq(emailVerificationCodes.email, email))

   const code = generateRandomString(6, alphabet("0-9"))

   await tx.insert(emailVerificationCodes).values({
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(5, "m")), // 5 minutes
   })

   return code
}

export const verifyVerificationCode = async (
   db: Database,
   userId: string,
   code: string,
) => {
   let isValid = true

   const databaseCode = await db.transaction(async (tx) => {
      const [databaseCode] = await tx
         .select()
         .from(emailVerificationCodes)
         .where(eq(emailVerificationCodes.userId, userId))

      if (!databaseCode || databaseCode.code !== code) {
         isValid = false
      }

      if (
         databaseCode &&
         !isWithinExpirationDate(new Date(databaseCode.expiresAt))
      ) {
         isValid = false
      }

      if (databaseCode?.userId !== userId) {
         isValid = false
      }

      return databaseCode
   })

   if (databaseCode && isValid) {
      await db
         .delete(emailVerificationCodes)
         .where(eq(emailVerificationCodes.id, databaseCode.id))
   }

   return isValid
}
