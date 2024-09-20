import type { ComponentProps } from "react"
import { Toaster as Sonner, toast } from "sonner"

function Toaster(props: ComponentProps<typeof Sonner>) {
   return (
      <Sonner
         icons={{
            success: (
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  height="20"
                  width="20"
                  className="-mt-0.5 text-[#3dd68cdd]"
               >
                  <path
                     fillRule="evenodd"
                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                     clipRule="evenodd"
                  />
               </svg>
            ),
            error: (
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  height="20"
                  width="20"
                  className="-mt-0.5 text-[#ec5d5df4]"
               >
                  <path
                     fillRule="evenodd"
                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                     clipRule="evenodd"
                  />
               </svg>
            ),
            info: (
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  height="20"
                  width="20"
                  className="-mt-0.5"
               >
                  <path
                     fillRule="evenodd"
                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                     clipRule="evenodd"
                  />
               </svg>
            ),
         }}
         toastOptions={{
            style: {
               translate: "-50% 0",
            },
            className:
               "!border-none mx-auto select-none !w-max max-w-[--width] !left-1/2 max-md:mb-[calc(env(safe-area-inset-bottom)+3.25rem)] bg-popover !right-auto text-popover-foreground py-3 text-base justify-center pointer-events-auto rounded-full",
         }}
         expand
         position="bottom-center"
         style={{ font: "inherit" }}
         {...props}
      />
   )
}

export { toast, Toaster }
