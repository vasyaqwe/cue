import { createSession, github } from "@/auth"
import { oauthAccounts, users } from "@/auth/schema"
import { db } from "@/db"
import { organizationMembers, organizations } from "@/organization/schema"

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

      if (!code || !state || !storedState || state !== storedState) {
         console.error(
            `Invalid state or code in GitHub OAuth callback: ${JSON.stringify({ code, state, storedState })}`,
         )
         throw new Error("Error")
      }

      try {
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
            return new Response(null, {
               status: 302,
               headers: {
                  Location: "/",
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
            const inviteCode = cookies.invite_code

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

            const organizationToJoin = await tx.query.organizations.findFirst({
               where: eq(organizations.inviteCode, inviteCode),
               columns: {
                  id: true,
                  slug: true,
               },
            })

            if (organizationToJoin) {
               await tx.insert(organizationMembers).values({
                  id: newUser.id,
                  organizationId: organizationToJoin.id,
               })
            }

            return { newUser, organizationSlug: organizationToJoin?.slug }
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
         console.error(e)

         const redirectUrl = new URL("/login", request.url)
         redirectUrl.searchParams.set("error", "true")
         if (cookies.invite_code) {
            redirectUrl.searchParams.set("inviteCode", cookies.invite_code)
         }

         return new Response(null, {
            status: 302,
            headers: {
               Location: redirectUrl.toString(),
            },
         })
      }
   },
})
