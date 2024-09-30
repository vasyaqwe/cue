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
                  viewBox="0 0 14 14"
                  fill="none"
                  className="size-5 text-brand"
               >
                  <circle
                     cx="7"
                     cy="7"
                     r="6"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeDasharray="3.14 0"
                     strokeDashoffset="-0.7"
                  />
                  <circle
                     cx="7"
                     cy="7"
                     r="3"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="6"
                     strokeDasharray="18.84955592153876 100"
                     strokeDashoffset="0"
                     transform="rotate(-90 7 7)"
                  />
                  <path
                     stroke="none"
                     fill="white"
                     d="M10.951 4.24896C11.283 4.58091 11.283 5.11909 10.951 5.45104L5.95104 10.451C5.61909 10.783 5.0809 10.783 4.74896 10.451L2.74896 8.45104C2.41701 8.11909 2.41701 7.5809 2.74896 7.24896C3.0809 6.91701 3.61909 6.91701 3.95104 7.24896L5.35 8.64792L9.74896 4.24896C10.0809 3.91701 10.6191 3.91701 10.951 4.24896Z"
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
                  className="-mt-px size-5 text-[#ec5d5df4]"
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
                  className="-mt-px size-5"
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
                  "!-m-2 !-mr-[9px] !ml-2.5 !h-[34px] !rounded-full !transition-all hover:!shadow-lg !bg-foreground !px-3 !text-white !text-sm !font-medium before:hidden before:border-foreground/[0.07] before:from-white/[0.1]",
               ),
            },
            className:
               "!mx-auto !border-border !shadow-lg !font-primary !py-3.5 !select-none !w-max !max-w-[--width] !left-1/2 max-md:mb-[calc(env(safe-area-inset-bottom)+1.75rem)] !bg-popover !right-auto !text-base !justify-center !pointer-events-auto !rounded-full",
         }}
         expand
         position="bottom-center"
         {...props}
      />
   )
}

export { toast, Toaster }
