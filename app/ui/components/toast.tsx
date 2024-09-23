import { buttonVariants } from "@/ui/components/button"
import { cn } from "@/ui/utils"
import type { ComponentProps } from "react"
import { Toaster as Sonner, toast } from "sonner"

function Toaster(props: ComponentProps<typeof Sonner>) {
   return (
      <Sonner
         icons={{
            success: (
               <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="-mt-px text-[#39c07fdd]"
               >
                  <path
                     fillRule="evenodd"
                     clipRule="evenodd"
                     d="M9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0ZM11.1657 6.6882C11.4229 6.35486 11.9015 6.29309 12.2349 6.55024C12.5682 6.8074 12.63 7.2861 12.3729 7.61944L9.31978 11.5772C9.21573 11.7122 9.09433 11.8697 8.97217 11.9889C8.82663 12.1309 8.5862 12.314 8.23666 12.3313C7.88712 12.3486 7.62979 12.1901 7.47093 12.0632C7.3376 11.9567 7.20123 11.8119 7.08436 11.6878L5.67617 10.1943C5.38735 9.88794 5.40154 9.40548 5.70786 9.11666C6.01419 8.82784 6.49664 8.84203 6.78546 9.14835L8.15079 10.5964L11.1657 6.6882Z"
                     fill="currentColor"
                  />
               </svg>
            ),
            error: (
               <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="-mt-px text-[#ec5d5df4]"
               >
                  <path
                     fillRule="evenodd"
                     clipRule="evenodd"
                     d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9ZM9.75 5.5C9.75 5.08579 9.41421 4.75 9 4.75C8.58579 4.75 8.25 5.08579 8.25 5.5V9.5C8.25 9.91421 8.58579 10.25 9 10.25C9.41421 10.25 9.75 9.91421 9.75 9.5V5.5ZM9 13.5C9.55229 13.5 10 13.0523 10 12.5C10 11.9477 9.55229 11.5 9 11.5C8.44771 11.5 8 11.9477 8 12.5C8 13.0523 8.44771 13.5 9 13.5Z"
                     fill="currentColor"
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
                  className="-mt-px"
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
            classNames: {
               actionButton: cn(
                  buttonVariants({ variant: "outline" }),
                  "!-m-2.5 !ml-2.5 !h-[32px] !rounded-full !transition-all hover:!shadow-lg !bg-foreground !px-3 !text-white !text-sm !font-medium before:hidden before:border-foreground/[0.07] before:from-white/[0.1]",
               ),
            },
            className:
               "!mx-auto !border-border !shadow-lg !font-primary !py-3.5 !select-none !w-max !max-w-[--width] !left-1/2 max-md:mb-[calc(env(safe-area-inset-bottom)+3.25rem)] !bg-popover !right-auto !text-base !justify-center !pointer-events-auto !rounded-full",
         }}
         expand
         position="bottom-center"
         {...props}
      />
   )
}

export { toast, Toaster }
