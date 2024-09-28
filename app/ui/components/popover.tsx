import {
   Drawer,
   DrawerContent,
   DrawerTitle,
   DrawerTrigger,
} from "@/ui/components/drawer"
import { useIsMobile } from "@/ui/hooks/use-is-mobile"
import { cn } from "@/ui/utils"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import {
   type ComponentPropsWithoutRef,
   type ElementRef,
   createContext,
   forwardRef,
   useContext,
} from "react"

const PopoverPortal = PopoverPrimitive.Portal
const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContext = createContext<{
   isMobile: boolean
} | null>(null)

function Popover(props: PopoverPrimitive.PopoverProps) {
   const { isMobile } = useIsMobile()
   return (
      <PopoverContext.Provider value={{ isMobile }}>
         {isMobile ? (
            <Drawer {...props} />
         ) : (
            <PopoverPrimitive.Root {...props} />
         )}
      </PopoverContext.Provider>
   )
}

function PopoverTrigger(props: PopoverPrimitive.PopoverTriggerProps) {
   const context = useContext(PopoverContext)
   if (!context) throw new Error("PopoverTrigger must be used within Popover")
   return context.isMobile ? (
      <DrawerTrigger {...props} />
   ) : (
      <PopoverPrimitive.Trigger {...props} />
   )
}

const PopoverContent = forwardRef<
   ElementRef<typeof PopoverPrimitive.Content>,
   ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { title: string }
>(
   (
      {
         className,
         children,
         align = "center",
         sideOffset = 4,
         title,
         ...props
      },
      ref,
   ) => {
      const context = useContext(PopoverContext)
      if (!context)
         throw new Error("PopoverContent must be used within Popover")

      if (context.isMobile)
         return (
            <DrawerContent
               className={cn("px-0.5", className)}
               {...props}
            >
               <DrawerTitle className="sr-only">{title}</DrawerTitle>
               {children}
            </DrawerContent>
         )

      return (
         <PopoverPortal>
            <PopoverPrimitive.Content
               ref={ref}
               align={align}
               sideOffset={sideOffset}
               className={cn(
                  "!p-1 z-50 min-w-[8rem] overflow-hidden rounded-[10px] border border-border bg-popover text-popover-foreground shadow-lg outline-none",
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
