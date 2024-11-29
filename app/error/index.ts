import type { ErrorCode } from "@/error/schema"
import { z } from "zod"

export class ServerFnError extends Error {
   public readonly code
   public readonly message

   constructor(opts: {
      message?: string
      code: ErrorCode
   }) {
      super()
      this.code = opts.code
      this.name = "ServerFnError"
      this.message = opts.message ?? ""
   }

   static schema = z.object({
      code: z.string(),
      message: z.string(),
      name: z.literal("ServerFnError"),
   })

   static isServerFnErrorLike(obj: unknown): obj is ServerFnError {
      return ServerFnError.schema.safeParse(obj).success
   }
}
