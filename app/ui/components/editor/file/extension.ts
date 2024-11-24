import { uploadFile } from "@/ui/components/editor/file/plugin"
import { cn } from "@/ui/utils"
import { mergeAttributes } from "@tiptap/core"
import imageExtension from "@tiptap/extension-image"

export const file = ({ className }: { className?: string } = {}) =>
   imageExtension
      .extend({
         name: "image",
         addProseMirrorPlugins() {
            return [uploadFile()]
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
                  class: cn("active:!outline-2", className ?? ""),
               }),
            ]
         },
      })
      .configure({
         allowBase64: true,
      })
