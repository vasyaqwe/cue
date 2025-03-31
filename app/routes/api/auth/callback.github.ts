import { db } from "@/db"
import { handleAuthError } from "@/error/utils"
import { logger } from "@/lib/logger"
import { createSession, github } from "@/user/auth"
import { oauthAccount, user } from "@/user/schema"
import { createAPIFileRoute } from "@tanstack/start/api"
import { eq } from "drizzle-orm"
import { parseCookies } from "vinxi/http"

export const Route = createAPIFileRoute("/api/auth/callback/github")({
   GET: async ({ request }) => {
      const url = new URL(request.url)
      const code = url.searchParams.get("code")
      const state = url.searchParams.get("state")
      const cookies = parseCookies()
      const storedState = cookies.github_oauth_state
      const inviteCode = cookies.invite_code

      try {
         if (!code || !state || !storedState || state !== storedState) {
            logger.error(`Invalid state or code in GitHub OAuth callback`)
            throw new Error("Error")
         }

         const tokens = await github.validateAuthorizationCode(code)
         const userProfile = await fetch("https://api.github.com/user", {
            headers: {
               Authorization: `Bearer ${tokens.accessToken}`,
            },
         })

         const githubUserProfile = (await userProfile.json()) as {
            id: number
            email: string
            name?: string
            avatar_url?: string
            login: string
            verified: boolean
         }

         //  email can be null if user has made it private.
         const existingAccount = await db.query.oauthAccount.findFirst({
            where: (fields) =>
               eq(fields.providerUserId, githubUserProfile.id.toString()),
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

         if (!githubUserProfile.email) {
            const emailResponse = await fetch(
               "https://api.github.com/user/emails",
               {
                  headers: {
                     Authorization: `Bearer ${tokens.accessToken}`,
                  },
               },
            )
            if (!emailResponse.ok) throw new Error("Error")

            const emails = (await emailResponse.json()) as {
               email: string
               primary: boolean
               verified: boolean
               visibility: string
            }[]

            const primaryEmail = emails.find(
               (email: { primary: boolean }) => email.primary,
            )

            // TODO verify the email if not verified
            if (primaryEmail) {
               githubUserProfile.email = primaryEmail.email
               githubUserProfile.verified = primaryEmail.verified
            } else if (emails.length > 0 && emails[0]?.email) {
               githubUserProfile.email = emails[0].email
               githubUserProfile.verified = emails[0].verified
            }
         }

         // If no existing account check if the a user with the email exists and link the account.
         const result = await db.transaction(async (tx) => {
            const [newUser] = await tx
               .insert(user)
               .values({
                  email: githubUserProfile.email,
                  name: githubUserProfile.name || githubUserProfile.login,
                  avatarUrl: githubUserProfile.avatar_url,
               })
               .returning({
                  id: user.id,
               })

            if (!newUser) throw new Error("Error")

            await tx.insert(oauthAccount).values({
               providerId: "github",
               providerUserId: githubUserProfile.id.toString(),
               userId: newUser.id,
            })

            return { newUser }
         })

         if (!result.newUser) throw new Error("Error")

         await createSession(result.newUser.id)

         return new Response(null, {
            status: 302,
            headers: {
               Location: inviteCode ? `/join/${inviteCode}` : "/",
            },
         })
      } catch (e) {
         return handleAuthError(e, request, cookies.invite_code)
      }
   },
})
