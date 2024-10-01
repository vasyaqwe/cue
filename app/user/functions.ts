import { protectedProcedure, publicProcedure } from "@/lib/trpc"
import { github, google, lucia } from "@/user/auth"
import { COOKIE_OPTIONS } from "@/user/constants"
import { users } from "@/user/schema"
import { createServerFn } from "@tanstack/start"
import { generateCodeVerifier, generateState } from "arctic"
import { eq } from "drizzle-orm"
import { deleteCookie, parseCookies, setCookie, setHeader } from "vinxi/http"
import { z } from "zod"

export const me = createServerFn(
   "GET",
   protectedProcedure.query(async ({ ctx }) => {
      return ctx.auth
   }),
)

export const update = createServerFn(
   "POST",
   protectedProcedure
      .input(z.object({ name: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
         return await ctx.db
            .update(users)
            .set(input)
            .where(eq(users.id, ctx.user.id))
      }),
)

export const logInWithGithub = createServerFn(
   "POST",
   publicProcedure
      .input(
         z.object({
            inviteCode: z.string().optional(),
         }),
      )
      .mutation(async ({ input }) => {
         const state = generateState()
         const url = await github.createAuthorizationURL(state, {
            scopes: ["user:email"],
         })

         if (input.inviteCode) {
            setCookie("invite_code", input.inviteCode, COOKIE_OPTIONS)
         } else {
            deleteCookie("invite_code")
         }

         setCookie("github_oauth_state", state, COOKIE_OPTIONS)

         setHeader("Location", url.toString())

         return url.toString()
      }),
)

export const logInWithGoogle = createServerFn(
   "POST",
   publicProcedure
      .input(
         z.object({
            inviteCode: z.string().optional(),
         }),
      )
      .mutation(async ({ input }) => {
         const state = generateState()
         const codeVerifier = generateCodeVerifier()
         const url = await google.createAuthorizationURL(state, codeVerifier, {
            scopes: ["profile", "email"],
         })

         if (input.inviteCode) {
            setCookie("invite_code", input.inviteCode, COOKIE_OPTIONS)
         } else {
            deleteCookie("invite_code")
         }

         setCookie("google_oauth_state", state, COOKIE_OPTIONS)
         setCookie("google_oauth_code_verifier", codeVerifier, COOKIE_OPTIONS)

         setHeader("Location", url.toString())

         return url.toString()
      }),
)

export const logout = createServerFn(
   "POST",
   publicProcedure.mutation(async () => {
      const sessionId = parseCookies()[lucia.sessionCookieName]
      if (!sessionId) return "OK"

      await lucia.invalidateSession(sessionId)
      const sessionCookie = lucia.createBlankSessionCookie()

      setCookie(sessionCookie.name, sessionCookie.value, {
         ...sessionCookie.npmCookieOptions(),
      })

      return "OK"
   }),
)
