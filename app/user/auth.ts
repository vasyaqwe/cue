import { type Database, db } from "@/db"
import { env } from "@/env"
import { organizationMember } from "@/organization/schema"
import {
   type Session,
   type User,
   emailVerificationCode,
   session,
   user,
} from "@/user/schema"
import { sha256 } from "@oslojs/crypto/sha2"
import {
   encodeBase32LowerCaseNoPadding,
   encodeHexLowerCase,
} from "@oslojs/encoding"
import { GitHub, Google } from "arctic"
import { eq } from "drizzle-orm"
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo"
import { alphabet, generateRandomString } from "oslo/crypto"
import { getCookie, getHeader, getWebRequest, setCookie } from "vinxi/http"

export const github = new GitHub(
   env.GITHUB_CLIENT_ID,
   env.GITHUB_CLIENT_SECRET,
   {},
)

export const google = new Google(
   env.GOOGLE_CLIENT_ID,
   env.GOOGLE_CLIENT_SECRET,
   `${env.VITE_BASE_URL}/api/auth/callback/google`,
)

export const createSession = async (userId: string) => {
   const organizationMemberships = await db.query.organizationMember.findMany({
      where: eq(organizationMember.id, userId),
      columns: {
         organizationId: true,
      },
   })

   const token = generateSessionToken()

   const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
   const newSession = {
      id: sessionId,
      userId: userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      organizationMemberships,
   }

   await db.insert(session).values(newSession).returning()

   setSessionTokenCookie(token, newSession.expiresAt)
}

export const SESSION_COOKIE_NAME = "auth_session"

export const getSessionToken = () => getCookie(SESSION_COOKIE_NAME)

export const auth = async () => {
   // csrf protection
   const request = getWebRequest()
   if (request.method !== "GET") {
      const origin = getHeader("Origin")
      // You can also compare it against the Host or X-Forwarded-Host header.
      if (origin === null || origin !== env.VITE_BASE_URL) {
         return {
            user: null,
            session: null,
         }
      }
   }

   const sessionToken = getSessionToken()

   if (!sessionToken)
      return {
         user: null,
         session: null,
      }

   const { session, user } = await validateSessionToken(sessionToken)

   if (session !== null && Date.now() >= session.expiresAt.getTime()) {
      await createSession(user.id)
   }

   if (!session) {
      deleteSessionTokenCookie()
   }

   return {
      user,
      session,
   }
}

export type Auth = Awaited<ReturnType<typeof auth>>

export const setSessionTokenCookie = (token: string, expiresAt: Date) => {
   setCookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: import.meta.env.PROD,
      expires: expiresAt,
      path: "/",
   })
}

export const deleteSessionTokenCookie = () => {
   setCookie(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: import.meta.env.PROD,
      maxAge: 0,
      path: "/",
   })
}

export const generateSessionToken = () => {
   const bytes = new Uint8Array(20)
   crypto.getRandomValues(bytes)
   const token = encodeBase32LowerCaseNoPadding(bytes)
   return token
}

export const validateSessionToken = async (token: string) => {
   const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

   const found = await db
      .select({ foundUser: user, foundSession: session })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(eq(session.id, sessionId))
      .get()

   if (!found) return { session: null, user: null }

   const { foundUser, foundSession } = found

   if (Date.now() >= foundSession.expiresAt.getTime()) {
      await db.delete(session).where(eq(session.id, foundSession.id))
      return { session: null, user: null }
   }

   if (
      Date.now() >=
      foundSession.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15
   ) {
      foundSession.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      await db
         .update(session)
         .set({
            expiresAt: foundSession.expiresAt,
         })
         .where(eq(session.id, foundSession.id))
   }

   return { session: foundSession, user: foundUser }
}

export const invalidateSession = async (sessionId: string) =>
   await db
      .delete(session)
      .where(
         eq(
            session.id,
            encodeHexLowerCase(sha256(new TextEncoder().encode(sessionId))),
         ),
      )

export type SessionValidationResult =
   | { session: Session; user: User }
   | { session: null; user: null }

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
      .delete(emailVerificationCode)
      .where(eq(emailVerificationCode.email, email))

   const code = generateRandomString(6, alphabet("0-9"))

   await tx.insert(emailVerificationCode).values({
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
         .from(emailVerificationCode)
         .where(eq(emailVerificationCode.userId, userId))

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
         .delete(emailVerificationCode)
         .where(eq(emailVerificationCode.id, databaseCode.id))
   }

   return isValid
}
