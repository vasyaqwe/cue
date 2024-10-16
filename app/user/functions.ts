import { protectedProcedure, publicProcedure } from "@/lib/trpc"
import {
   deleteSessionTokenCookie,
   getSessionToken,
   github,
   google,
   invalidateSession,
} from "@/user/auth"
import { COOKIE_OPTIONS } from "@/user/constants"
import { user } from "@/user/schema"
import { createServerFn } from "@tanstack/start"
import { generateCodeVerifier, generateState } from "arctic"
import { eq } from "drizzle-orm"
import { P, match } from "ts-pattern"
import { deleteCookie, setCookie, setHeader } from "vinxi/http"
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
            .update(user)
            .set(input)
            .where(eq(user.id, ctx.user.id))
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

         match(input.inviteCode)
            .with(P.nullish, () => deleteCookie("invite_code"))
            .otherwise((code) => setCookie("invite_code", code, COOKIE_OPTIONS))

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

         match(input.inviteCode)
            .with(P.nullish, () => deleteCookie("invite_code"))
            .otherwise((code) => setCookie("invite_code", code, COOKIE_OPTIONS))

         setCookie("google_oauth_state", state, COOKIE_OPTIONS)
         setCookie("google_oauth_code_verifier", codeVerifier, COOKIE_OPTIONS)

         setHeader("Location", url.toString())

         return url.toString()
      }),
)

export const logout = createServerFn(
   "POST",
   publicProcedure.mutation(async () => {
      return match(getSessionToken())
         .with(undefined, () => "OK")
         .otherwise(async (sessionId) => {
            await invalidateSession(sessionId)
            deleteSessionTokenCookie()

            return "OK"
         })
   }),
)
