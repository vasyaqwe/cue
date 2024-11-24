import type { Editor } from "@tiptap/core"

export const insertLinkPreview = (url: string, editor: Editor) => {
   editor
      .chain()
      .focus()
      .insertContent([
         {
            type: "link-preview",
            attrs: {
               href: url,
            },
         },
         {
            type: "paragraph",
         },
      ])
      .run()

   return true
}

export const isUrl = (string: string) => {
   const urlRegex = /^(https?:\/\/)[^\s]+/
   return urlRegex.test(string.trim())
}
