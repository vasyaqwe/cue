import { cn } from "@/ui/utils"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const dialogVariants = cva(
   `data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed z-50 grid w-full inset-0 !h-max m-auto rounded-xl bg-background data-[state=open]:animate-in`,
   {
      variants: {
         variant: {
            default: `max-w-lg data-[state=open]:slide-in-from-bottom-28 shadow-lg`,
            alert: "data-[state=open]:slide-in-from-bottom-28 max-w-md shadow-lg",
            overlay: "bg-transparent",
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
               className={
                  variant === "overlay"
                     ? "bg-background/85 backdrop-blur-[6px]"
                     : variant === "command"
                       ? "bg-background/75"
                       : ""
               }
               style={{
                  animationDuration: "250ms",
               }}
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
            style={{
               animationTimingFunction: `var(--ease)`,
               animationDuration: "750ms",
               ...props.style,
            }}
            {...props}
         >
            {children}
            {(variant === "default" || !variant) && (
               <DialogPrimitive.Close className="absolute top-3.5 right-3.5 grid size-7 place-content-center rounded-full bg-muted text-foreground/70 ring-offset-background transition-all disabled:pointer-events-none active:scale-95 hover:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
                  {/* <XMarkIcon
               className="size-4"
               strokeWidth={3}
            /> */}
                  <span className="sr-only">Close</span>
               </DialogPrimitive.Close>
            )}
         </DialogPrimitive.Content>
      </DialogPortal>
   )
}

function DialogOverlay({
   className,
   ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
   return (
      <DialogPrimitive.Overlay
         className={cn(
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in",
            className,
         )}
         {...props}
      />
   )
}

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
            paddingBottom: `max(calc(env(safe-area-inset-bottom) + 0.5rem), 1rem)`,
         }}
         className={cn(
            "flex flex-col-reverse border-t-2 border-dashed py-3 md:mt-0.5 sm:flex-row sm:justify-end sm:space-x-2",
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
            "font-semibold text-[1.2rem] leading-none tracking-tight",
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
