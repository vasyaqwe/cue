import { ServerFnError } from "@/error"
import { baseMiddleware } from "@/misc/middleware"
import { auth } from "@/user/auth"
import { createMiddleware } from "@tanstack/start"

export const authMiddleware = createMiddleware()
   .middleware([baseMiddleware])
   .server(async ({ next }) => {
      const result = await auth()
      if (!result.user || !result.session)
         throw new ServerFnError({ code: "UNAUTHORIZED" })

      return next({
         context: {
            session: result.session,
            user: result.user,
         },
      })
   })
