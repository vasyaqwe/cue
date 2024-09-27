import { useIsMobile } from "@/ui/hooks/use-is-mobile"
import { cn } from "@/ui/utils"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Slot } from "@radix-ui/react-slot"
import { type ComponentProps, createContext, useContext } from "react"
import { buttonVariants } from "./button"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./drawer"

const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuContext = createContext<{
   isMobile: boolean
} | null>(null)

function DropdownMenu(props: DropdownMenuPrimitive.DropdownMenuProps) {
   const { isMobile } = useIsMobile()
   return (
      <DropdownMenuContext.Provider value={{ isMobile }}>
         {isMobile ? (
            <Drawer {...props} />
         ) : (
            <DropdownMenuPrimitive.Root {...props} />
         )}
      </DropdownMenuContext.Provider>
   )
}

function DropdownMenuTrigger(
   props: DropdownMenuPrimitive.DropdownMenuTriggerProps,
) {
   const context = useContext(DropdownMenuContext)
   if (!context)
      throw new Error("DropdownMenuTrigger must be used within DropdownMenu")
   return context.isMobile ? (
      <DrawerTrigger {...props} />
   ) : (
      <DropdownMenuPrimitive.Trigger {...props} />
   )
}

function DropdownMenuContent({
   className,
   children,
   sideOffset = 4,
   title,
   ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content> & { title: string }) {
   const context = useContext(DropdownMenuContext)
   if (!context)
      throw new Error("DropdownMenuContent must be used within DropdownMenu")

   if (context.isMobile)
      return (
         <DrawerContent
            style={{
               ...props.style,
               paddingBottom: `max(calc(env(safe-area-inset-bottom) + 0.5rem), 0.5rem)`,
            }}
            className={cn("px-0.5", className)}
            {...props}
         >
            <DrawerTitle className="sr-only">{title}</DrawerTitle>
            <div className="mt-2">{children}</div>
         </DrawerContent>
      )

   return (
      <DropdownMenuPortal>
         <DropdownMenuPrimitive.Content
            sideOffset={sideOffset}
            className={cn(
               "!p-1 z-50 min-w-[8rem] overflow-hidden rounded-[10px] border border-border bg-popover text-popover-foreground shadow-lg",
               "data-[state=closed]:animate-out data-[state=open]:animate-in",
               "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
               "data-[state=open]:data-[side=top]:slide-in-from-bottom-[1px] data-[state=closed]:data-[side=top]:slide-out-to-bottom-[1px] data-[state=open]:data-[side=top]:slide-in-from-left-[1px] data-[state=closed]:data-[side=top]:slide-out-to-left-[1px]",
               "data-[state=open]:data-[side=right]:slide-in-from-left-[1px] data-[state=closed]:data-[side=right]:slide-out-to-left-[1px] data-[state=open]:data-[side=right]:slide-in-from-top-[1px] data-[state=closed]:data-[side=right]:slide-out-to-top-[1px]",
               "data-[state=open]:data-[side=bottom]:slide-in-from-top-[1px] data-[state=closed]:data-[side=bottom]:slide-out-to-top-[1px] data-[state=open]:data-[side=bottom]:data-[align=start]:slide-in-from-left-[1px] data-[state=closed]:data-[side=bottom]:data-[align=start]:slide-out-to-left-[1px]",
               "data-[state=open]:data-[side=left]:slide-in-from-right-[1px] data-[state=closed]:data-[side=left]:slide-out-to-right-[1px] data-[state=open]:data-[side=left]:slide-in-from-bottom-[1px] data-[state=closed]:data-[side=left]:slide-out-to-bottom-[1px]",
               className,
            )}
            {...props}
         >
            {children}
         </DropdownMenuPrimitive.Content>
      </DropdownMenuPortal>
   )
}

function DropdownMenuItem({
   className,
   destructive = false,
   inset = false,
   onSelect,
   asChild,
   ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
   inset?: boolean
   destructive?: boolean
}) {
   const context = useContext(DropdownMenuContext)
   if (!context)
      throw new Error("DropdownMenuItem must be used within DropdownMenu")

   if (context.isMobile) {
      const Comp = asChild ? Slot : "div"
      return (
         <Comp
            onClick={(e) => {
               onSelect?.(e as never)
               document.dispatchEvent(
                  new KeyboardEvent("keydown", {
                     key: "Escape",
                  }),
               )
            }}
            className={cn(
               buttonVariants({ variant: "ghost" }),
               "flex h-12 items-center justify-start gap-2.5 rounded-xl bg-transparent px-4 font-medium text-[1.05rem] text-foreground/80 duration-300 md:[&_svg]:size-5 active:scale-95 [&:not(:active)]:aria-[current=page]:bg-transparent active:bg-border/50",
               destructive
                  ? "active:bg-destructive/95 active:text-destructive-foreground"
                  : "",
               className,
            )}
            {...props}
         />
      )
   }

   return (
      <DropdownMenuPrimitive.Item
         onSelect={onSelect}
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-1.5 rounded-[8px] px-2 py-1.5 outline-none [&>svg]:size-5 data-[disabled]:cursor-not-allowed focus:bg-border/50 data-[disabled]:opacity-75",
            inset && "pl-8",
            destructive
               ? "focus:bg-destructive/95 focus:text-destructive-foreground"
               : "",
            className,
         )}
         {...props}
      />
   )
}

function DropdownMenuCheckboxItem({
   className,
   children,
   checked,
   ...props
}: ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
   return (
      <DropdownMenuPrimitive.CheckboxItem
         className={cn(
            "relative flex select-none items-center rounded-sm py-1 pr-2 pl-8 text-accent-foreground outline-none data-[disabled]:pointer-events-none focus:bg-popover-highlight data-[state=checked]:text-foreground focus:text-foreground data-[disabled]:opacity-50",
            className,
         )}
         checked={checked}
         {...props}
      >
         <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
               {/* <CheckIcon
             strokeWidth={2}
             className="size-4 stroke-foreground"
           /> */}
            </DropdownMenuPrimitive.ItemIndicator>
         </span>
         {children}
      </DropdownMenuPrimitive.CheckboxItem>
   )
}

function DropdownMenuLabel({
   className,
   inset,
   ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
   return (
      <DropdownMenuPrimitive.Label
         className={cn("px-2 py-1 ", inset && "pl-8", className)}
         {...props}
      />
   )
}

function DropdownMenuSeparator({
   className,
   ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
   return (
      <DropdownMenuPrimitive.Separator
         className={cn("-mx-1 my-1 h-px bg-border/75", className)}
         {...props}
      />
   )
}

const DropdownMenuShortcut = ({
   className,
   ...props
}: ComponentProps<"span">) => {
   return (
      <span
         className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
         {...props}
      />
   )
}

export {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuCheckboxItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuGroup,
   DropdownMenuPortal,
}
