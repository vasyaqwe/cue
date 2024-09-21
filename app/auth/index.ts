import { type Database, db } from "@/db"
import { type User, emailVerificationCodes, sessions, users } from "@/db/schema"
import { env } from "@/env"
import { cachedFunction } from "@/lib/cache"
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import { GitHub } from "arctic"
import { eq } from "drizzle-orm"
import { Lucia, TimeSpan } from "lucia"
import { createDate, isWithinExpirationDate } from "oslo"
import { alphabet, generateRandomString } from "oslo/crypto"
import { parseCookies, setCookie } from "vinxi/http"

const adapter = new DrizzleSQLiteAdapter(db, sessions, users)

export const lucia = new Lucia(adapter, {
   getUserAttributes: (attributes) => {
      return {
         id: attributes.id,
         email: attributes.email,
         name: attributes.name,
         avatarUrl: attributes.avatarUrl,
         onboardingCompleted: attributes.onboardingCompleted,
         // createdAt: attributes.createdAt,
         // updatedAt: attributes.updatedAt,
      }
   },
})

export const github = new GitHub(
   env.GITHUB_CLIENT_ID,
   env.GITHUB_CLIENT_SECRET,
   {},
)

export const auth = cachedFunction(async () => {
   const sessionId = parseCookies()[lucia.sessionCookieName]

   if (!sessionId) {
      return {
         user: null,
         session: null,
      }
   }

   const { session, user } = await lucia.validateSession(sessionId)

   if (session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id)
      setCookie(sessionCookie.name, sessionCookie.value, {
         ...sessionCookie.attributes,
      })
   }

   if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie()
      setCookie(sessionCookie.name, sessionCookie.value, {
         ...sessionCookie.attributes,
      })
   }

   return {
      user,
      session,
   }
})

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
      expiresAt: createDate(new TimeSpan(5, "m")).getTime(), // 5 minutes
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

declare module "lucia" {
   interface Register {
      Lucia: typeof lucia
      DatabaseUserAttributes: User
   }
}
