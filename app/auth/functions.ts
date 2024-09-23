import { auth, github, lucia } from "@/auth"
import { createServerFn } from "@tanstack/start"
import { generateState } from "arctic"
import { parseCookies, setCookie, setHeader } from "vinxi/http"

export const me = createServerFn("GET", async () => {
   return await auth()
})

export const logInWithGithub = createServerFn("POST", async () => {
   const state = generateState()
   const url = await github.createAuthorizationURL(state, {
      scopes: ["user:email"],
   })

   setCookie("github_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
   })

   setHeader("Location", url.toString())

   return url.toString()
})

export const logout = createServerFn("POST", async () => {
   const sessionId = parseCookies()[lucia.sessionCookieName]
   if (!sessionId) {
      return "OK"
   }

   await lucia.invalidateSession(sessionId)
   const sessionCookie = lucia.createBlankSessionCookie()

   setCookie(sessionCookie.name, sessionCookie.value, {
      ...sessionCookie.npmCookieOptions(),
   })

   return "OK"
})
