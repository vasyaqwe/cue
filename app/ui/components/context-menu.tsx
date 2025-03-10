import {
   Command,
   CommandItem,
   CommandList,
   commandItemVariants,
} from "@/ui/components/command"
import {
   Drawer,
   DrawerContent,
   DrawerNested,
   DrawerTitle,
   DrawerTrigger,
} from "@/ui/components/drawer"
import { Icons } from "@/ui/components/icons"
import { popoverAnimation } from "@/ui/constants"
import { useUIStore } from "@/ui/store"
import { cn } from "@/ui/utils"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"

const ContextMenuGroup = ContextMenuPrimitive.Group
const ContextMenuPortal = ContextMenuPrimitive.Portal

function ContextMenu({ ...props }: ContextMenuPrimitive.ContextMenuProps) {
   const { isMobile } = useUIStore()

   if (isMobile) return <Drawer {...props} />
   return <ContextMenuPrimitive.Root {...props} />
}

function ContextMenuSub({
   ...props
}: ContextMenuPrimitive.ContextMenuSubProps) {
   const { isMobile } = useUIStore()

   if (isMobile) return <DrawerNested {...props} />
   return <ContextMenuPrimitive.Sub {...props} />
}

function ContextMenuTrigger({
   children,
   ...props
}: ContextMenuPrimitive.ContextMenuTriggerProps) {
   const isMobile = useUIStore().isMobile
   return isMobile ? (
      <DrawerTrigger {...props}>{children}</DrawerTrigger>
   ) : (
      <ContextMenuPrimitive.Trigger {...props}>
         {children}
      </ContextMenuPrimitive.Trigger>
   )
}

function ContextMenuSubTrigger({
   className,
   destructive = false,
   inset,
   children,
   ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.ContextMenuSubTrigger> & {
   inset?: boolean
   destructive?: boolean
}) {
   const isMobile = useUIStore().isMobile

   if (isMobile)
      return (
         <DrawerTrigger
            className={commandItemVariants({
               variant: destructive ? "destructive" : "default",
            })}
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            {...(props as any)}
         >
            {children}
         </DrawerTrigger>
      )
   return (
      <ContextMenuPrimitive.ContextMenuSubTrigger
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-1.5 rounded-[9px] px-2 py-1.5 outline-hidden [&>svg]:size-5 data-[disabled=true]:cursor-not-allowed data-[state=open]:bg-border/50 focus:bg-border/60 data-[disabled=true]:opacity-75",
            inset && "pl-8",
            destructive
               ? "focus:bg-destructive focus:text-destructive-foreground"
               : "",
            className,
         )}
         {...props}
      >
         {children}
         <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="-mr-1.5 !size-4 ml-auto opacity-60"
         >
            <path
               d="M9.58599 5.18967C9.26945 4.96077 8.84859 4.93714 8.50841 5.12918C8.16824 5.32122 7.97103 5.69376 8.00347 6.08305C8.33162 10.0209 8.33162 13.9791 8.00347 17.917C7.97103 18.3062 8.16824 18.6788 8.50841 18.8708C8.84859 19.0629 9.26945 19.0392 9.58599 18.8103C11.837 17.1825 13.8566 15.2764 15.593 13.141C16.1357 12.4737 16.1357 11.5263 15.593 10.859C13.8566 8.72356 11.837 6.81746 9.58599 5.18967Z"
               fill="currentColor"
            />
         </svg>
      </ContextMenuPrimitive.ContextMenuSubTrigger>
   )
}

function ContextMenuContent({
   className,
   children,
   title,
   ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content> & {
   title: string
}) {
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
      <ContextMenuPortal>
         <ContextMenuPrimitive.Content
            className={cn(
               "!p-1 z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg",
               popoverAnimation,
               className,
            )}
            {...props}
         >
            {children}
         </ContextMenuPrimitive.Content>
      </ContextMenuPortal>
   )
}

function ContextMenuSubContent({
   className,
   title,
   children,
   ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.ContextMenuSubContent> & {
   title: string
}) {
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
      <ContextMenuPrimitive.ContextMenuSubContent
         className={cn(
            "!p-1 z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg",
            popoverAnimation,
            className,
         )}
         {...props}
      >
         {children}
      </ContextMenuPrimitive.ContextMenuSubContent>
   )
}

function ContextMenuItem({
   className,
   destructive = false,
   inset,
   onSelect,
   ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
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
      <ContextMenuPrimitive.Item
         onSelect={onSelect}
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-1.5 rounded-[9px] px-2 py-1.5 outline-hidden [&>svg]:size-5 data-[disabled=true]:cursor-not-allowed focus:bg-border/60 data-[disabled=true]:opacity-75",
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

function ContextMenuCheckboxItem({
   className,
   children,
   checked,
   onSelect,
   ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> & {
   onSelect?: () => void
}) {
   const isMobile = useUIStore().isMobile

   if (isMobile)
      return (
         <CommandItem
            onSelect={onSelect}
            className={className}
            isSelected={!!checked}
            {...props}
         >
            {children}
         </CommandItem>
      )
   return (
      <ContextMenuPrimitive.CheckboxItem
         checked={checked}
         onSelect={onSelect}
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-1.5 rounded-[9px] px-2 py-1.5 outline-hidden [&>svg]:size-5 data-[disabled=true]:cursor-not-allowed focus:bg-border/60 data-[disabled=true]:opacity-75",
            "pl-8",
            className,
         )}
         {...props}
      >
         <span className="absolute left-2 flex size-3.5 items-center justify-center">
            <ContextMenuPrimitive.ItemIndicator>
               <Icons.check className="!size-5" />
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
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
   inset?: boolean
}) {
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
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
   return (
      <ContextMenuPrimitive.Separator
         className={cn("-mx-0.5 md:-mx-1 my-1 h-px bg-border/75", className)}
         {...props}
      />
   )
}

const ContextMenuShortcut = ({
   className,
   ...props
}: React.ComponentProps<"span">) => {
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
