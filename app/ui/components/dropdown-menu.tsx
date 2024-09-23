import { cn } from "@/ui/utils"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import type { ComponentProps } from "react"
const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

function DropdownMenuTrigger({
   ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
   return <DropdownMenuPrimitive.Trigger {...props} />
}

function DropdownMenuContent({
   className,
   sideOffset = 4,
   ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
   return (
      <DropdownMenuPrimitive.Portal>
         <DropdownMenuPrimitive.Content
            sideOffset={sideOffset}
            className={cn(
               "!p-1 z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-md",
               "data-[state=closed]:animate-out data-[state=open]:animate-in",
               "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
               "data-[state=open]:data-[side=top]:slide-in-from-bottom-[1px] data-[state=closed]:data-[side=top]:slide-out-to-bottom-[1px] data-[state=open]:data-[side=top]:slide-in-from-left-[1px] data-[state=closed]:data-[side=top]:slide-out-to-left-[1px]",
               "data-[state=open]:data-[side=right]:slide-in-from-left-[1px] data-[state=closed]:data-[side=right]:slide-out-to-left-[1px] data-[state=open]:data-[side=right]:slide-in-from-top-[1px] data-[state=closed]:data-[side=right]:slide-out-to-top-[1px]",
               "data-[state=open]:data-[side=bottom]:slide-in-from-top-[1px] data-[state=closed]:data-[side=bottom]:slide-out-to-top-[1px] data-[state=open]:data-[side=bottom]:slide-in-from-right-[1px] data-[state=closed]:data-[side=bottom]:slide-out-to-right-[1px]",
               "data-[state=open]:data-[side=left]:slide-in-from-right-[1px] data-[state=closed]:data-[side=left]:slide-out-to-right-[1px] data-[state=open]:data-[side=left]:slide-in-from-bottom-[1px] data-[state=closed]:data-[side=left]:slide-out-to-bottom-[1px]",
               className,
            )}
            {...props}
         />
      </DropdownMenuPrimitive.Portal>
   )
}

function DropdownMenuItem({
   className,
   destructive = false,
   inset,
   ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
   inset?: boolean
   destructive?: boolean
}) {
   return (
      <DropdownMenuPrimitive.Item
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-1.5 outline-none [&>svg]:size-5 data-[disabled]:cursor-not-allowed focus:bg-border/50 data-[disabled]:opacity-75",
            inset && "pl-8",
            destructive
               ? "focus:bg-destructive/95 focus:[--popover-icon:hsl(var(--popover-foreground))]"
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
         className={cn("-mx-1 my-1 h-px bg-popover-highlight/80", className)}
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
