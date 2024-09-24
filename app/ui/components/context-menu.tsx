import { cn } from "@/ui/utils"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import type { ComponentProps } from "react"

const ContextMenu = ContextMenuPrimitive.Root
const ContextMenuGroup = ContextMenuPrimitive.Group
const ContextMenuPortal = ContextMenuPrimitive.Portal
const ContextMenuTrigger = ContextMenuPrimitive.Trigger
const ContextMenuSub = ContextMenuPrimitive.ContextMenuSub

function ContextMenuContent({
   className,
   ...props
}: ComponentProps<typeof ContextMenuPrimitive.Content>) {
   return (
      <ContextMenuPrimitive.Portal>
         <ContextMenuPrimitive.Content
            className={cn(
               "!p-1 z-50 min-w-[8rem] overflow-hidden rounded-[10px] border border-border bg-popover text-popover-foreground shadow-lg",
               "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=open]:animate-in",
               "data-[state=open]:data-[side=top]:slide-in-from-bottom-[1px] data-[state=closed]:data-[side=top]:slide-out-to-bottom-[1px] data-[state=open]:data-[side=top]:slide-in-from-left-[1px] data-[state=closed]:data-[side=top]:slide-out-to-left-[1px]",
               "data-[state=open]:data-[side=right]:slide-in-from-left-[1px] data-[state=closed]:data-[side=right]:slide-out-to-left-[1px] data-[state=open]:data-[side=right]:slide-in-from-top-[1px] data-[state=closed]:data-[side=right]:slide-out-to-top-[1px]",
               "data-[state=open]:data-[side=bottom]:slide-in-from-top-[1px] data-[state=closed]:data-[side=bottom]:slide-out-to-top-[1px] data-[state=open]:data-[side=bottom]:slide-in-from-right-[1px] data-[state=closed]:data-[side=bottom]:slide-out-to-right-[1px]",
               "data-[state=open]:data-[side=left]:slide-in-from-right-[1px] data-[state=closed]:data-[side=left]:slide-out-to-right-[1px] data-[state=open]:data-[side=left]:slide-in-from-bottom-[1px] data-[state=closed]:data-[side=left]:slide-out-to-bottom-[1px]",
               className,
            )}
            {...props}
         />
      </ContextMenuPrimitive.Portal>
   )
}

function ContextMenuSubContent({
   className,
   ...props
}: ComponentProps<typeof ContextMenuPrimitive.ContextMenuSubContent>) {
   return (
      <ContextMenuPrimitive.ContextMenuSubContent
         className={cn(
            "!p-1 z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=open]:animate-in",
            "data-[state=open]:data-[side=top]:slide-in-from-bottom-[1px] data-[state=closed]:data-[side=top]:slide-out-to-bottom-[1px] data-[state=open]:data-[side=top]:slide-in-from-left-[1px] data-[state=closed]:data-[side=top]:slide-out-to-left-[1px]",
            "data-[state=open]:data-[side=right]:slide-in-from-left-[1px] data-[state=closed]:data-[side=right]:slide-out-to-left-[1px] data-[state=open]:data-[side=right]:slide-in-from-top-[1px] data-[state=closed]:data-[side=right]:slide-out-to-top-[1px]",
            "data-[state=open]:data-[side=bottom]:slide-in-from-top-[1px] data-[state=closed]:data-[side=bottom]:slide-out-to-top-[1px] data-[state=open]:data-[side=bottom]:slide-in-from-right-[1px] data-[state=closed]:data-[side=bottom]:slide-out-to-right-[1px]",
            "data-[state=open]:data-[side=left]:slide-in-from-right-[1px] data-[state=closed]:data-[side=left]:slide-out-to-right-[1px] data-[state=open]:data-[side=left]:slide-in-from-bottom-[1px] data-[state=closed]:data-[side=left]:slide-out-to-bottom-[1px]",
            className,
         )}
         {...props}
      />
   )
}

function ContextMenuItem({
   className,
   destructive = false,
   inset,
   ...props
}: ComponentProps<typeof ContextMenuPrimitive.Item> & {
   inset?: boolean
   destructive?: boolean
}) {
   return (
      <ContextMenuPrimitive.Item
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-1.5 rounded-[8px] px-2 py-1.5 outline-none [&>svg]:size-5 data-[disabled]:cursor-not-allowed focus:bg-border/50 data-[disabled]:opacity-75",
            inset && "pl-8",
            destructive
               ? "focus:bg-destructive focus:text-destructive-foreground"
               : "",
            className,
         )}
         {...props}
      />
   )
}

function ContextMenuSubTrigger({
   className,
   destructive = false,
   inset,
   children,
   ...props
}: ComponentProps<typeof ContextMenuPrimitive.ContextMenuSubTrigger> & {
   inset?: boolean
   destructive?: boolean
}) {
   return (
      <ContextMenuPrimitive.ContextMenuSubTrigger
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-1.5 rounded-[8px] px-2 py-1.5 outline-none [&>svg]:size-5 data-[disabled]:cursor-not-allowed data-[state=open]:bg-border/50 focus:bg-border/50 data-[disabled]:opacity-75",
            inset && "pl-8",
            destructive
               ? "focus:bg-destructive focus:text-destructive-foreground"
               : "",
            className,
            className,
         )}
         {...props}
      >
         {children}
         <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="-mr-1.5 !size-4 ml-auto opacity-75"
         >
            <path
               d="M9.58599 5.18967C9.26945 4.96077 8.84859 4.93714 8.50841 5.12918C8.16824 5.32122 7.97103 5.69376 8.00347 6.08305C8.33162 10.0209 8.33162 13.9791 8.00347 17.917C7.97103 18.3062 8.16824 18.6788 8.50841 18.8708C8.84859 19.0629 9.26945 19.0392 9.58599 18.8103C11.837 17.1825 13.8566 15.2764 15.593 13.141C16.1357 12.4737 16.1357 11.5263 15.593 10.859C13.8566 8.72356 11.837 6.81746 9.58599 5.18967Z"
               fill="currentColor"
            />
         </svg>
      </ContextMenuPrimitive.ContextMenuSubTrigger>
   )
}

function ContextMenuCheckboxItem({
   className,
   children,
   checked,
   ...props
}: ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
   return (
      <ContextMenuPrimitive.CheckboxItem
         className={cn(
            "relative flex select-none items-center rounded-sm py-1 pr-2 pl-8 text-accent-foreground outline-none data-[disabled]:pointer-events-none focus:bg-popover-highlight data-[state=checked]:text-foreground focus:text-foreground data-[disabled]:opacity-50",
            className,
         )}
         checked={checked}
         {...props}
      >
         <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <ContextMenuPrimitive.ItemIndicator>
               <svg
                  className="!size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M5 12.7132L10.0168 17.7247L10.4177 17.0238C12.5668 13.2658 15.541 10.0448 19.1161 7.60354L20 7"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
            </ContextMenuPrimitive.ItemIndicator>
         </span>
         {children}
      </ContextMenuPrimitive.CheckboxItem>
   )
}

function ContextMenuLabel({
   className,
   inset,
   ...props
}: ComponentProps<typeof ContextMenuPrimitive.Label> & { inset?: boolean }) {
   return (
      <ContextMenuPrimitive.Label
         className={cn("px-2 py-1 ", inset && "pl-8", className)}
         {...props}
      />
   )
}

function ContextMenuSeparator({
   className,
   ...props
}: ComponentProps<typeof ContextMenuPrimitive.Separator>) {
   return (
      <ContextMenuPrimitive.Separator
         className={cn("-mx-1 my-1 h-px bg-border/75", className)}
         {...props}
      />
   )
}

const ContextMenuShortcut = ({
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
   ContextMenu,
   ContextMenuTrigger,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuCheckboxItem,
   ContextMenuLabel,
   ContextMenuSeparator,
   ContextMenuShortcut,
   ContextMenuGroup,
   ContextMenuPortal,
   ContextMenuSub,
   ContextMenuSubTrigger,
   ContextMenuSubContent,
}
