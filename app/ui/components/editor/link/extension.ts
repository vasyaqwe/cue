import { LinkPreview } from "@/ui/components/editor/link/link-preview"
import { cn } from "@/ui/utils"
import { Node, mergeAttributes } from "@tiptap/core"
import linkExtension from "@tiptap/extension-link"
import { ReactNodeViewRenderer } from "@tiptap/react"

const link = linkExtension.configure({
   HTMLAttributes: {
      class: cn("cursor-pointer underline"),
   },
   openOnClick: false,
})

const linkPreview = ({ className }: { className?: string } = {}) => {
   return Node.create({
      name: "link-preview",
      group: "block",
      atom: true,
      inline: false,
      content: "",
      addAttributes() {
         return {
            ...this.parent?.(),
            href: { default: null },
            title: { default: null },
            domain: { default: null },
            image: { default: null },
            className: { default: className },
         }
      },
      parseHTML() {
         return [
            {
               tag: "div",
            },
         ]
      },
      renderHTML({ HTMLAttributes }) {
         return ["div", mergeAttributes(HTMLAttributes, { className })]
      },
      addNodeView() {
         return ReactNodeViewRenderer(LinkPreview)
      },
   })
}

export { link, linkPreview }
