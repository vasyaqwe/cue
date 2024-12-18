import type { ReactNode } from "@tanstack/react-router"
import type { Editor } from "@tiptap/core"
import type { Range } from "@tiptap/core"

type CommandItem = {
   title: string
   icon: ReactNode
   command?: (props: { editor: Editor; range: Range }) => void
}

export const commandItems = [
   {
      title: "Text",
      icon: (
         <svg
            viewBox="0 0 24 24"
            strokeWidth="2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               d="M21.0909 4C21.593 4 22 4.39797 22 4.88889C22 5.37981 21.593 5.77778 21.0909 5.77778L2.90909 5.77778C2.40701 5.77778 2 5.37981 2 4.88889C2 4.39797 2.40701 4 2.90909 4H21.0909Z"
               fill="currentColor"
            />
            <path
               d="M18.3636 12C18.3636 11.5091 17.9566 11.1111 17.4546 11.1111L2.9091 11.1111C2.40703 11.1111 2.00001 11.5091 2.00001 12C2.00001 12.4909 2.40703 12.8889 2.9091 12.8889L17.4546 12.8889C17.9566 12.8889 18.3636 12.4909 18.3636 12Z"
               fill="currentColor"
            />
            <path
               d="M22 19.1111C22 18.6202 21.593 18.2222 21.0909 18.2222L2.90909 18.2222C2.40701 18.2222 2 18.6202 2 19.1111C2 19.602 2.40701 20 2.90909 20L21.0909 20C21.593 20 22 19.602 22 19.1111Z"
               fill="currentColor"
            />
         </svg>
      ),
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
      icon: (
         <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               d="M2.243 4.493v7.5m0 0v7.502m0-7.501h10.5m0-7.5v7.5m0 0v7.501m4.501-8.627 2.25-1.5v10.126m0 0h-2.25m2.25 0h2.25"
            />
         </svg>
      ),
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
      icon: (
         <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               d="M21.75 19.5H16.5v-1.609a2.25 2.25 0 0 1 1.244-2.012l2.89-1.445c.651-.326 1.116-.955 1.116-1.683 0-.498-.04-.987-.118-1.463-.135-.825-.835-1.422-1.668-1.489a15.202 15.202 0 0 0-3.464.12M2.243 4.492v7.5m0 0v7.502m0-7.501h10.5m0-7.5v7.5m0 0v7.501"
            />
         </svg>
      ),
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
      icon: (
         <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               d="M20.905 14.626a4.52 4.52 0 0 1 .738 3.603c-.154.695-.794 1.143-1.504 1.208a15.194 15.194 0 0 1-3.639-.104m4.405-4.707a4.52 4.52 0 0 0 .738-3.603c-.154-.696-.794-1.144-1.504-1.209a15.19 15.19 0 0 0-3.639.104m4.405 4.708H18M2.243 4.493v7.5m0 0v7.502m0-7.501h10.5m0-7.5v7.5m0 0v7.501"
            />
         </svg>
      ),
      command: ({ editor, range }) => {
         editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 3 })
            .run()
      },
   },
   {
      title: "Bullet List",
      icon: (
         <svg
            className="!size-[22px] ml-[-2px]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
         </svg>
      ),
      command: ({ editor, range }) => {
         editor.chain().focus().deleteRange(range).toggleBulletList().run()
      },
   },
   {
      title: "Numbered List",
      icon: (
         <svg
            className="!size-[22px] ml-[-2px]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99"
            />
         </svg>
      ),
      command: ({ editor, range }) => {
         editor.chain().focus().deleteRange(range).toggleOrderedList().run()
      },
   },
   {
      title: "Code",
      icon: (
         <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
            />
         </svg>
      ),
      command: ({ editor, range }) => {
         editor.chain().focus().deleteRange(range).toggleCode().run()
      },
   },
] satisfies CommandItem[]
