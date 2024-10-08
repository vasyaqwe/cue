import type { SuggestionItem } from "@/ui/components/editor/extensions"
import { Icons } from "@/ui/components/icons"

export const suggestionItems = [
   {
      title: "Text",
      searchTerms: ["p", "paragraph"],
      icon: <Icons.pencil />,
      command: ({ editor, range }) => {
         editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleNode("paragraph", "paragraph")
            .run()
      },
   },
   {
      title: "Heading 1",
      searchTerms: ["title", "big", "large"],
      icon: <span>H1</span>,
      command: ({ editor, range }) => {
         editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 1 })
            .run()
      },
   },
   {
      title: "Heading 2",
      searchTerms: ["subtitle", "medium"],
      icon: <span>H2</span>,
      command: ({ editor, range }) => {
         editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 2 })
            .run()
      },
   },
   {
      title: "Heading 3",
      searchTerms: ["subtitle", "small"],
      icon: <span>H3</span>,
      command: ({ editor, range }) => {
         editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 3 })
            .run()
      },
   },
   // {
   //    title: "Bullet List",
   //    searchTerms: ["unordered", "point"],
   //    icon: <List size={18} />,
   //    command: ({ editor, range }) => {
   //       editor.chain().focus().deleteRange(range).toggleBulletList().run()
   //    },
   // },
   // {
   //    title: "Numbered List",
   //    searchTerms: ["ordered"],
   //    icon: <ListOrdered size={18} />,
   //    command: ({ editor, range }) => {
   //       editor.chain().focus().deleteRange(range).toggleOrderedList().run()
   //    },
   // },
] satisfies SuggestionItem[]
