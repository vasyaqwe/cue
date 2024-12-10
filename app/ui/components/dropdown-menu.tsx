import { CommandItem } from "@/ui/components/command"
import { Icons } from "@/ui/components/icons"
import { popoverAnimation } from "@/ui/constants"
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
            className={cn("px-0.5 pb-safe-1", className)}
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
               popoverAnimation,
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

   if (isMobile)
      return (
         <CommandItem
            variant={destructive ? "destructive" : "default"}
            inset={inset}
            onSelect={onSelect}
            className={className}
            {...props}
         />
      )
   return (
      <DropdownMenuPrimitive.Item
         onSelect={onSelect}
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-1.5 rounded-[9px] px-2 py-1.5 outline-hidden [&>svg]:size-5 data-[disabled=true]:cursor-not-allowed focus:bg-border/60 data-[disabled=true]:opacity-75",
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
   inset = false,
   ...props
}: ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
   inset?: boolean
}) {
   return (
      <DropdownMenuPrimitive.CheckboxItem
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-1.5 rounded-[9px] px-2 py-1.5 outline-hidden [&>svg]:size-5 data-[disabled=true]:cursor-not-allowed focus:bg-border/60 data-[disabled=true]:opacity-75",
            inset ? "pl-8" : "pl-2",
            className,
         )}
         checked={checked}
         {...props}
      >
         {!inset ? children : null}
         <span
            className={cn(
               "flex size-3.5 items-center justify-center",
               inset ? "absolute left-2" : "ml-auto",
            )}
         >
            <DropdownMenuPrimitive.ItemIndicator>
               <Icons.check className="!size-5" />
            </DropdownMenuPrimitive.ItemIndicator>
         </span>
         {inset ? children : null}
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
