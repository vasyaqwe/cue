import { createFileUpload } from "@/ui/components/editor/file/plugin"
import { toast } from "sonner"
import { match } from "ts-pattern"

const onUpload = (file: File) => {
   const promise = fetch("/api/storage/upload", {
      method: "POST",
      headers: {
         "content-type": file?.type || "application/octet-stream",
         "x-vercel-filename": file?.name || "image.png",
      },
      body: file,
   })

   return new Promise((resolve) => {
      toast.promise(
         promise.then(async (res) => {
            match(res.status)
               .with(200, async () => {
                  const { url } = (await res.json()) as never
                  // preload the image
                  const image = new Image()
                  image.src = url
                  image.onload = () => {
                     resolve(url)
                  }
               })
               .with(401, () => {
                  resolve(file)
                  throw new Error(
                     "`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.",
                  )
               })
               .otherwise(() => {
                  throw new Error(`Error uploading image. Please try again.`)
               })
         }),
         {
            loading: "Uploading..",
            success: "Done",
            error: (e) => e.message,
         },
      )
   })
}

export const uploadFile = createFileUpload({
   onUpload,
   validateFn: (file) => {
      if (!file.type.includes("image/")) {
         toast.error("File type not supported")
         return false
      }
      if (file.size / 1024 / 1024 > 20) {
         toast.error("File size too big (max 20MB)")
         return false
      }
      return true
   },
})
