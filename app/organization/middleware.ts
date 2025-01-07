import { ServerFnError } from "@/error"
import { authMiddleware } from "@/user/middleware"
import { createMiddleware } from "@tanstack/start"

export const organizationMemberMiddleware = createMiddleware()
   .middleware([authMiddleware])
   .server(({ next, context, data: _data }) => {
      const data = _data as unknown as Record<string, unknown>

      if (!("organizationId" in data))
         throw new ServerFnError({ code: "BAD_REQUEST" })

      if (!context.session || !context.user)
         throw new ServerFnError({ code: "UNAUTHORIZED" })

      const membership = context.session.organizationMemberships.some(
         (membership) => membership.organizationId === data.organizationId,
      )

      if (!membership) throw new ServerFnError({ code: "FORBIDDEN" })

      return next({
         context: {
            session: context.session,
            user: context.user,
         },
      })
   })
