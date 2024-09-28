import { buttonVariants } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { type VariantProps, cva } from "class-variance-authority"
import { type ComponentProps, type ElementRef, forwardRef } from "react"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const dialogVariants = cva(
   `data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed z-50 grid w-full inset-0 !h-max m-auto rounded-xl bg-background data-[state=open]:animate-in data-[state=closed]:animate-out`,
   {
      variants: {
         variant: {
            default: `max-w-lg data-[state=closed]:zoom-out-[97%] data-[state=open]:zoom-in-[97%] shadow-lg`,
            alert: "data-[state=closed]:zoom-out-[97%] data-[state=open]:zoom-in-[97%] max-w-md shadow-lg",
            command:
               "data-[state=closed]:!animate-none top-[20px] w-[90%] max-w-[430px] translate-y-0 animate-none bg-trasparent md:top-[75px]",
            toolbar:
               "data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2 top-auto bottom-[calc(env(safe-area-inset-bottom)+5rem)] flex w-fit translate-y-0 items-center gap-1 rounded-xl border border-muted p-[5px] shadow-md md:bottom-9",
         },
      },
      defaultVariants: {
         variant: "default",
      },
   },
)

function DialogContent({
   className,
   children,
   variant,
   ...props
}: ComponentProps<typeof DialogPrimitive.Content> &
   VariantProps<typeof dialogVariants>) {
   return (
      <DialogPortal>
         {variant !== "toolbar" && (
            <DialogOverlay
               className={variant === "command" ? "bg-background/75" : ""}
            />
         )}
         <DialogPrimitive.Content
            onPointerDownOutside={(e) => {
               // don't dismiss dialog when clicking inside the toast
               if (
                  e.target instanceof Element &&
                  e.target.closest("[data-sonner-toast]")
               ) {
                  e.preventDefault()
               }
            }}
            onOpenAutoFocus={(e) => {
               if (variant !== "toolbar") return
               e.preventDefault()
               document.body.style.pointerEvents = "auto"
            }}
            onInteractOutside={(e) => {
               if (variant !== "toolbar") return
               e.preventDefault()
            }}
            className={cn(
               dialogVariants({
                  variant,
                  className,
               }),
            )}
            {...props}
         >
            {children}
            {(variant === "default" || !variant) && (
               <DialogPrimitive.Close
                  className={cn(
                     buttonVariants({ variant: "ghost", size: "icon" }),
                     "absolute top-2.5 right-2.5 size-8",
                  )}
               >
                  <Icons.xMark className="size-5" />
                  <span className="sr-only">Close</span>
               </DialogPrimitive.Close>
            )}
         </DialogPrimitive.Content>
      </DialogPortal>
   )
}

const DialogOverlay = forwardRef<
   ElementRef<typeof DialogPrimitive.Overlay>,
   ComponentProps<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
   return (
      <DialogPrimitive.Overlay
         ref={ref}
         className={cn(
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/20 data-[state=closed]:animate-out data-[state=open]:animate-in",
            className,
         )}
         {...props}
      />
   )
})

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
   return (
      <div
         className={cn("!pb-0 flex flex-col space-y-2.5 p-4", className)}
         {...props}
      />
   )
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
   return (
      <div
         style={{
            paddingBottom: `max(calc(env(safe-area-inset-bottom) + 0.5rem), 0.75rem)`,
         }}
         className={cn(
            "mt-3 flex items-center border-border border-t p-3",
            className,
         )}
         {...props}
      />
   )
}

function DialogTitle({
   className,
   ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
   return (
      <DialogPrimitive.Title
         className={cn(
            "font-semibold text-lg leading-none tracking-tight",
            className,
         )}
         {...props}
      />
   )
}

function DialogDescription({
   className,
   ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
   return (
      <DialogPrimitive.Description
         className={cn("inline-block text-foreground/70", className)}
         {...props}
      />
   )
}

export {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogOverlay,
   DialogPortal,
   DialogTitle,
   DialogTrigger,
}
