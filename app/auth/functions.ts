import { github, lucia } from "@/auth"
import { protectedProcedure, publicProcedure } from "@/lib/trpc"
import { createServerFn } from "@tanstack/start"
import { generateState } from "arctic"
import { deleteCookie, parseCookies, setCookie, setHeader } from "vinxi/http"
import { z } from "zod"

export const me = createServerFn(
   "GET",
   protectedProcedure.query(async ({ ctx }) => {
      return ctx.auth
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
            setCookie("invite_code", input.inviteCode, {
               path: "/",
               secure: process.env.NODE_ENV === "production",
               httpOnly: true,
               maxAge: 60 * 10,
               sameSite: "lax",
            })
         } else {
            deleteCookie("invite_code")
         }

         setCookie("github_oauth_state", state, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 60 * 10,
            sameSite: "lax",
         })

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
