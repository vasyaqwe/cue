import { db } from "@/db"
import { createMiddleware } from "@tanstack/start"

export const baseMiddleware = createMiddleware().server(async ({ next }) => {
   return next({
      context: {
         db,
      },
   })
})
