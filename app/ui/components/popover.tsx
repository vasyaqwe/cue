import {
   Drawer,
   DrawerContent,
   DrawerTitle,
   DrawerTrigger,
} from "@/ui/components/drawer"
import { useUIStore } from "@/ui/store"
import { cn } from "@/ui/utils"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import {
   type ComponentPropsWithoutRef,
   type ElementRef,
   forwardRef,
} from "react"

const PopoverPortal = PopoverPrimitive.Portal
const PopoverAnchor = PopoverPrimitive.Anchor

function Popover({
   nested = false,
   drawerOnMobile = true,
   ...props
}: PopoverPrimitive.PopoverProps & {
   nested?: boolean
   drawerOnMobile?: boolean
}) {
   const isMobile = useUIStore().isMobile

   if (isMobile && drawerOnMobile)
      return (
         <Drawer
            nested
            repositionInputs={false}
            {...props}
         />
      )
   return <PopoverPrimitive.Root {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.PopoverTriggerProps) {
   const isMobile = useUIStore().isMobile

   if (isMobile) return <DrawerTrigger {...props} />
   return <PopoverPrimitive.Trigger {...props} />
}

const PopoverContent = forwardRef<
   ElementRef<typeof PopoverPrimitive.Content>,
   ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
      title: string
      drawerOnMobile?: boolean
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      container?: any
   }
>(
   (
      {
         className,
         children,
         align = "center",
         sideOffset = 4,
         title,
         container,
         drawerOnMobile = true,
         ...props
      },
      ref,
   ) => {
      const isMobile = useUIStore().isMobile

      if (isMobile && drawerOnMobile)
         return (
            <DrawerContent
               className={cn("px-0.5 pb-safe-1", className)}
               {...props}
            >
               <DrawerTitle className="sr-only">{title}</DrawerTitle>
               {children}
            </DrawerContent>
         )

      return (
         <PopoverPortal container={container}>
            <PopoverPrimitive.Content
               onWheel={(e) => e.stopPropagation()}
               onTouchMove={(e) => e.stopPropagation()}
               ref={ref}
               align={align}
               sideOffset={sideOffset}
               className={cn(
                  "!p-1 z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg outline-none",
                  "data-[state=closed]:animate-out data-[state=open]:animate-in",
                  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                  "data-[state=open]:data-[side=top]:slide-in-from-bottom-[1px] data-[state=closed]:data-[side=top]:slide-out-to-bottom-[1px] data-[state=open]:data-[side=top]:slide-in-from-left-[1px] data-[state=closed]:data-[side=top]:slide-out-to-left-[1px]",
                  "data-[state=open]:data-[side=right]:slide-in-from-left-[1px] data-[state=closed]:data-[side=right]:slide-out-to-left-[1px] data-[state=open]:data-[side=right]:slide-in-from-top-[1px] data-[state=closed]:data-[side=right]:slide-out-to-top-[1px]",
                  "data-[state=open]:data-[side=bottom]:slide-in-from-top-[1px] data-[state=closed]:data-[side=bottom]:slide-out-to-top-[1px] data-[state=open]:data-[side=bottom]:data-[align=start]:slide-in-from-left-[1px] data-[state=closed]:data-[side=bottom]:data-[align=start]:slide-out-to-left-[1px]",
                  "data-[state=open]:data-[side=left]:slide-in-from-right-[1px] data-[state=closed]:data-[side=left]:slide-out-to-right-[1px] data-[state=open]:data-[side=left]:slide-in-from-top-[1px] data-[state=closed]:data-[side=left]:slide-out-to-top-[1px]",
                  className,
               )}
               {...props}
            >
               {children}
            </PopoverPrimitive.Content>
         </PopoverPortal>
      )
   },
)
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverPortal }
