import { db } from "@/db"
import { handleAuthError } from "@/error/utils"
import {} from "@/organization/schema"
import { createSession, github } from "@/user/auth"
import { oauthAccounts, users } from "@/user/schema"
import { joinInvitedOrganization } from "@/user/utils"

import { createAPIFileRoute } from "@tanstack/start/api"
import { and, eq } from "drizzle-orm"
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
            console.error(`Invalid state or code in GitHub OAuth callback`)
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
         const existingAccount = await db.query.oauthAccounts.findFirst({
            where: (fields) =>
               and(
                  eq(fields.providerId, "github"),
                  eq(fields.providerUserId, githubUserProfile.id.toString()),
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
               .insert(users)
               .values({
                  email: githubUserProfile.email,
                  name: githubUserProfile.name || githubUserProfile.login,
                  avatarUrl: githubUserProfile.avatar_url,
               })
               .returning({
                  id: users.id,
               })

            if (!newUser) throw new Error("Error")

            await tx.insert(oauthAccounts).values({
               providerId: "github",
               providerUserId: githubUserProfile.id.toString(),
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

         if (!result.newUser) throw new Error("Error")

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
      } catch (e) {
         return handleAuthError(e, request, cookies.invite_code)
      }
   },
})
