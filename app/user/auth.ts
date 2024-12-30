import { db } from "@/db"
import { env } from "@/env"
import { organizationMember } from "@/organization/schema"
import { COOKIE_OPTIONS } from "@/user/constants"
import { session, user } from "@/user/schema"
import { sha256 } from "@oslojs/crypto/sha2"
import {
   encodeBase32LowerCaseNoPadding,
   encodeHexLowerCase,
} from "@oslojs/encoding"
import { GitHub, Google } from "arctic"
import { eq } from "drizzle-orm"
import { getCookie, getHeader, getWebRequest, setCookie } from "vinxi/http"

const SESSION_COOKIE_NAME = "auth_session"
const SESSION_EXPIRATION_SECONDS = 30 * 24 * 60 * 60

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

   await db
      .insert(session)
      .values({
         id: sessionId,
         userId: userId,
         expiresAt: new Date(Date.now() + 1000 * SESSION_EXPIRATION_SECONDS),
         organizationMemberships,
      })
      .returning()

   setSessionTokenCookie(token)
}

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

   if (!session) {
      deleteSessionTokenCookie()
   }

   return {
      user,
      session,
   }
}

export type Auth = Awaited<ReturnType<typeof auth>>

export const setSessionTokenCookie = (token: string) => {
   setCookie(SESSION_COOKIE_NAME, token, {
      ...COOKIE_OPTIONS,
      maxAge: SESSION_EXPIRATION_SECONDS,
   })
}

export const deleteSessionTokenCookie = () => {
   setCookie(SESSION_COOKIE_NAME, "", {
      ...COOKIE_OPTIONS,
      maxAge: 0,
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

   // if less than 15 days left, extend the session
   if (
      Date.now() >=
      foundSession.expiresAt.getTime() - 1000 * 15 * 24 * 60 * 60
   ) {
      foundSession.expiresAt = new Date(
         Date.now() + 1000 * SESSION_EXPIRATION_SECONDS,
      )
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
