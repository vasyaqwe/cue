import { db } from "@/db"
import { handleAuthError } from "@/error/utils"
import { logger } from "@/lib/logger"
import { createSession, google } from "@/user/auth"
import { oauthAccount, user } from "@/user/schema"
import { createAPIFileRoute } from "@tanstack/start/api"
import { and, eq } from "drizzle-orm"
import { parseCookies } from "vinxi/http"

export const Route = createAPIFileRoute("/api/auth/callback/google")({
   GET: async ({ request }) => {
      const url = new URL(request.url)
      const code = url.searchParams.get("code")
      const state = url.searchParams.get("state")
      const cookies = parseCookies()
      const storedState = cookies.google_oauth_state
      const inviteCode = cookies.invite_code
      const codeVerifier = cookies.google_oauth_code_verifier

      try {
         if (
            !code ||
            !state ||
            !storedState ||
            state !== storedState ||
            !codeVerifier
         ) {
            logger.error(`Invalid state or code in Google OAuth callback`)
            throw new Error("Error")
         }
         const tokens = await google.validateAuthorizationCode(
            code,
            codeVerifier,
         )
         const userProfile = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
               headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
               },
            },
         )

         const googleUserProfile = (await userProfile.json()) as {
            id: string
            email: string
            name: string
            picture?: string
            verified_email: boolean
         }

         const existingAccount = await db.query.oauthAccount.findFirst({
            where: (fields) =>
               and(
                  eq(fields.providerId, "google"),
                  eq(fields.providerUserId, googleUserProfile.id),
               ),
         })

         if (existingAccount) {
            await createSession(existingAccount.userId)

            return new Response(null, {
               status: 302,
               headers: {
                  Location: inviteCode ? `/join/${inviteCode}` : "/",
               },
            })
         }

         const result = await db.transaction(async (tx) => {
            const existingUser = await tx
               .select()
               .from(user)
               .where(eq(user.email, googleUserProfile.email))
               .get()

            let userId: string | undefined

            if (existingUser) {
               userId = existingUser.id
            } else {
               const createdUser = await tx
                  .insert(user)
                  .values({
                     email: googleUserProfile.email,
                     name: googleUserProfile.name,
                     avatarUrl: googleUserProfile.picture,
                  })
                  .returning({ id: user.id })
                  .get()

               if (!createdUser) throw new Error("Failed to create user")
               userId = createdUser.id
            }

            const existingOAuth = await tx
               .select()
               .from(oauthAccount)
               .where(
                  and(
                     eq(oauthAccount.providerId, "google"),
                     eq(oauthAccount.providerUserId, googleUserProfile.id),
                  ),
               )
               .get()

            if (!existingOAuth)
               await tx.insert(oauthAccount).values({
                  providerId: "google",
                  providerUserId: googleUserProfile.id,
                  userId: userId,
               })

            return { userId }
         })

         if (!result.userId) throw new Error("Failed to create user")

         await createSession(result.userId)

         return new Response(null, {
            status: 302,
            headers: {
               Location: inviteCode ? `/join/${inviteCode}` : "/",
            },
         })
      } catch (error) {
         return handleAuthError(error, request, inviteCode)
      }
   },
})
