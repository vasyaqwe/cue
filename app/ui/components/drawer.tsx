import { cn } from "@/ui/utils"
import { type ComponentProps, type ElementRef, forwardRef } from "react"
import { Drawer as DrawerPrimitive } from "vaul"

function Drawer(props: ComponentProps<typeof DrawerPrimitive.Root>) {
   return <DrawerPrimitive.Root {...props} />
}

const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerPortal = DrawerPrimitive.Portal
const DrawerClose = DrawerPrimitive.Close
const DrawerNested = DrawerPrimitive.NestedRoot

const DrawerOverlay = forwardRef<
   ElementRef<typeof DrawerPrimitive.Overlay>,
   ComponentProps<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => {
   return (
      <DrawerPrimitive.Overlay
         ref={ref}
         className={cn("fixed inset-0 z-50 bg-black/25", className)}
         {...props}
      />
   )
})

function DrawerContent({
   className,
   children,
   ...props
}: ComponentProps<typeof DrawerPrimitive.Content>) {
   return (
      <DrawerPortal>
         <DrawerOverlay />
         <DrawerPrimitive.Content
            onPointerDownOutside={(e) => {
               // Don't dismiss dialog when clicking inside the toast
               if (
                  e.target instanceof Element &&
                  e.target.closest("[data-sonner-toast]")
               ) {
                  e.preventDefault()
               }
            }}
            className={cn(
               "group fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-[88svh] flex-col rounded-t-2xl border border-border bg-background shadow-[0_-10px_32px_0px_rgb(0,0,0,0.07)] [&[vaul-drawer-direction=right]]:right-0 [&[vaul-drawer-direction=right]]:left-auto [&[vaul-drawer-direction=right]]:h-screen [&[vaul-drawer-direction=right]]:max-h-full [&[vaul-drawer-direction=right]]:w-[95%] lg:[&[vaul-drawer-direction=right]]:w-[556px] [&[vaul-drawer-direction=right]]:rounded-r-none [&[vaul-drawer-direction=right]]:rounded-bl-xl ",
               className,
            )}
            {...props}
         >
            <div className="!p-0 mx-auto mt-1 min-h-1 w-8 rounded-full bg-foreground/75 group-[&[vaul-drawer-direction=right]]:hidden" />
            {children}
         </DrawerPrimitive.Content>
      </DrawerPortal>
   )
}

function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
   return (
      <header
         className={cn(
            "grid gap-1.5 border-border border-b px-4 py-3.5 md:py-3",
            className,
         )}
         {...props}
      />
   )
}

function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
   return (
      <div
         style={{
            paddingBottom: `max(calc(env(safe-area-inset-bottom) + 0.5rem), 0.75rem)`,
         }}
         className={cn(
            "mt-auto flex items-center justify-between gap-2 border-border border-t p-3",
            className,
         )}
         {...props}
      />
   )
}

function DrawerTitle({
   className,
   ...props
}: ComponentProps<typeof DrawerPrimitive.Title>) {
   return (
      <DrawerPrimitive.Title
         className={cn("font-semibold text-lg leading-none", className)}
         {...props}
      />
   )
}

function DrawerDescription({
   className,
   ...props
}: ComponentProps<typeof DrawerPrimitive.Description>) {
   return (
      <DrawerPrimitive.Description
         className={cn("text-foreground/70 text-sm", className)}
         {...props}
      />
   )
}

export {
   Drawer,
   DrawerNested,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerOverlay,
   DrawerPortal,
   DrawerTitle,
   DrawerTrigger,
}
