// api/auth/callback/google.ts
import { db } from "@/db"
import { handleAuthError } from "@/error/utils"
import {} from "@/organization/schema"
import { createSession, google } from "@/user/auth"
import { oauthAccounts, users } from "@/user/schema"
import { joinInvitedOrganization } from "@/user/utils"
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
            console.error(`Invalid state or code in Google OAuth callback`)
            throw new Error("Error")
         }
         const tokens = await google.validateAuthorizationCode(
            code,
            codeVerifier,
         )
         const userProfile = await fetch(
            // https://openidconnect.googleapis.com/v1/userinfo
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

         const existingAccount = await db.query.oauthAccounts.findFirst({
            where: (fields) =>
               and(
                  eq(fields.providerId, "google"),
                  eq(fields.providerUserId, googleUserProfile.id),
               ),
         })

         if (existingAccount) {
            const sessionCookie = await createSession(existingAccount.userId)

            if (!inviteCode)
               return new Response(null, {
                  status: 302,
                  headers: {
                     Location: "/",
                     "Set-Cookie": sessionCookie.serialize(),
                  },
               })

            const joinedOrganization = await joinInvitedOrganization({
               db,
               userId: existingAccount.userId,
               inviteCode,
            })

            return new Response(null, {
               status: 302,
               headers: {
                  Location: `/${joinedOrganization.slug}`,
                  "Set-Cookie": sessionCookie.serialize(),
               },
            })
         }

         const result = await db.transaction(async (tx) => {
            const [newUser] = await tx
               .insert(users)
               .values({
                  email: googleUserProfile.email,
                  name: googleUserProfile.name,
                  avatarUrl: googleUserProfile.picture,
               })
               .returning({
                  id: users.id,
               })

            if (!newUser) throw new Error("Failed to create user")

            await tx.insert(oauthAccounts).values({
               providerId: "google",
               providerUserId: googleUserProfile.id,
               userId: newUser.id,
            })

            if (!inviteCode) return { newUser }

            const joinedOrganization = await joinInvitedOrganization({
               db: tx as never,
               userId: newUser.id,
               inviteCode,
            })

            return { newUser, organizationSlug: joinedOrganization.slug }
         })

         if (!result.newUser) throw new Error("Failed to create user")

         const sessionCookie = await createSession(result.newUser.id)
         return new Response(null, {
            status: 302,
            headers: {
               Location: result?.organizationSlug
                  ? `/${result.organizationSlug}`
                  : "/",
               "Set-Cookie": sessionCookie.serialize(),
            },
         })
      } catch (error) {
         return handleAuthError(error, request, inviteCode)
      }
   },
})
