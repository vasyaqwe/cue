import { env } from "@/env"
import { json } from "@tanstack/start"
import { createAPIFileRoute } from "@tanstack/start/api"
import { put } from "@vercel/blob"

export const Route = createAPIFileRoute("/api/storage/upload")({
   POST: async ({ request }) => {
      const file = request.body ?? ""
      const filename = request.headers.get("x-vercel-filename") ?? "file.txt"
      const contentType = request.headers.get("content-type") ?? "text/plain"
      const fileType = `.${contentType.split("/")[1]}`

      const finalName = filename.includes(fileType)
         ? filename
         : `${filename}${fileType}`

      const blob = await put(finalName, file, {
         contentType,
         access: "public",
         token: env.STORAGE_READ_WRITE_TOKEN,
      })

      return json(blob)
   },
})
