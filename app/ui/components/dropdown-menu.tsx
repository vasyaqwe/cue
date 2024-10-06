import { CommandItem } from "@/ui/components/command"
import { useUIStore } from "@/ui/store"
import { cn } from "@/ui/utils"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Command, CommandList } from "cmdk"
import type { ComponentProps } from "react"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./drawer"

const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

function DropdownMenu(props: DropdownMenuPrimitive.DropdownMenuProps) {
   const isMobile = useUIStore().isMobile
   return (
      <>
         {isMobile ? (
            <Drawer {...props} />
         ) : (
            <DropdownMenuPrimitive.Root {...props} />
         )}
      </>
   )
}

function DropdownMenuTrigger(
   props: DropdownMenuPrimitive.DropdownMenuTriggerProps,
) {
   const isMobile = useUIStore().isMobile

   return isMobile ? (
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
   const isMobile = useUIStore().isMobile

   if (isMobile)
      return (
         <DrawerContent
            className={cn("px-0.5 pb-safe-2", className)}
            {...props}
         >
            <DrawerTitle className="sr-only">{title}</DrawerTitle>
            <Command className="pt-4">
               <CommandList>{children}</CommandList>
            </Command>
         </DrawerContent>
      )

   return (
      <DropdownMenuPortal>
         <DropdownMenuPrimitive.Content
            sideOffset={sideOffset}
            className={cn(
               "!p-1 z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg",
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
         </DropdownMenuPrimitive.Content>
      </DropdownMenuPortal>
   )
}

function DropdownMenuItem({
   className,
   destructive = false,
   inset = false,
   onSelect,
   ...props
}: ComponentProps<typeof CommandItem> & {
   inset?: boolean
   destructive?: boolean
   onSelect?: () => void
}) {
   const isMobile = useUIStore().isMobile

   if (isMobile) {
      return (
         <CommandItem
            variant={destructive ? "destructive" : "default"}
            inset={inset}
            onSelect={onSelect}
            className={className}
            {...props}
         />
      )
   }

   return (
      <DropdownMenuPrimitive.Item
         onSelect={onSelect}
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-1.5 rounded-[9px] px-2 py-1.5 outline-none [&>svg]:size-5 data-[disabled]:cursor-not-allowed focus:bg-border/50 data-[disabled]:opacity-75",
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
         className={cn(
            "px-4 py-1.5 text-foreground/75 text-sm md:px-2",
            inset && "pl-8",
            className,
         )}
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
