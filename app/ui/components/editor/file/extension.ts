import { uploadFile } from "@/ui/components/editor/file/plugin"
import { cn } from "@/ui/utils"
import imageExtension from "@tiptap/extension-image"

export const file = imageExtension
   .extend({
      name: "image",
      addProseMirrorPlugins() {
         return [
            uploadFile({
               className: cn(""),
            }),
         ]
      },
      addAttributes() {
         return {
            ...this.parent?.(),
            width: {
               default: null,
            },
            height: {
               default: null,
            },
         }
      },
   })
   .configure({
      allowBase64: true,
   })
