import { auth, github } from "@/auth"
import { useStorage } from "@/lib/cache"
import { createServerFn } from "@tanstack/start"
import { generateState } from "arctic"
import { setCookie, setHeader } from "vinxi/http"

export const authLoaderFn = createServerFn("GET", async () => {
   await useStorage().removeItem("cache:nitro:functions:auth:.json")
   return await auth()
})

export const logInWithGithubFn = createServerFn("POST", async () => {
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

   return {
      url: url.toString(),
   }
})
