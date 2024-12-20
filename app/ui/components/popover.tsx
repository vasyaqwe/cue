import {
   Drawer,
   DrawerContent,
   DrawerNested,
   DrawerTitle,
   DrawerTrigger,
} from "@/ui/components/drawer"
import { popoverAnimation } from "@/ui/constants"
import { useUIStore } from "@/ui/store"
import { cn } from "@/ui/utils"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import * as React from "react"

const PopoverPortal = PopoverPrimitive.Portal
const PopoverAnchor = PopoverPrimitive.Anchor

function Popover({
   nested = false,
   drawerOnMobile = true,
   repositionInputs = false,
   ...props
}: PopoverPrimitive.PopoverProps & {
   nested?: boolean
   drawerOnMobile?: boolean
   repositionInputs?: boolean
}) {
   const isMobile = useUIStore().isMobile

   if (isMobile && drawerOnMobile)
      return nested ? (
         <DrawerNested
            repositionInputs={repositionInputs}
            {...props}
         />
      ) : (
         <Drawer
            repositionInputs={repositionInputs}
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

const PopoverContent = React.forwardRef<
   React.ElementRef<typeof PopoverPrimitive.Content>,
   React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
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
                  "!p-1 z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg outline-hidden",
                  popoverAnimation,
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
