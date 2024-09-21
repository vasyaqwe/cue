import { auth } from "@/auth"
import { useStorage } from "@/lib/cache"
import { createServerFn } from "@tanstack/start"
import { TRPCError } from "@trpc/server"

export const authLoader = createServerFn("GET", async () => {
   await useStorage().removeItem("cache:nitro:functions:auth:.json")
   const session = await auth()
   if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" })
   return session
})
