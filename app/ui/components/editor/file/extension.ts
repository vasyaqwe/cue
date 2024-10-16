import { uploadFile } from "@/ui/components/editor/file/plugin"
import { cn } from "@/ui/utils"
import { mergeAttributes } from "@tiptap/core"
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
      renderHTML({ HTMLAttributes }) {
         return [
            "img",
            mergeAttributes(HTMLAttributes, {
               class: cn("active:!outline-2"),
            }),
         ]
      },
   })
   .configure({
      allowBase64: true,
   })
