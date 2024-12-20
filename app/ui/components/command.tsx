import { Icons } from "@/ui/components/icons"
import { useUIStore } from "@/ui/store"
import { cn } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import {
   CommandEmpty as CommandEmptyPrimitive,
   CommandGroup as CommandGroupPrimitive,
   CommandInput as CommandInputPrimitive,
   CommandList as CommandListPrimitive,
   Command as CommandPrimitive,
} from "cmdk"
import type * as React from "react"

export const Command = CommandPrimitive
export const CommandGroup = CommandGroupPrimitive
export const CommandList = CommandListPrimitive
export const CommandEmpty = CommandEmptyPrimitive
export const CommandInput = CommandInputPrimitive

export const commandItemVariants = cva(
   `relative flex cursor-pointer w-full select-none items-center gap-2.5 rounded-2xl px-4 py-1.5 outline-hidden [&_svg]:size-6 md:[&_svg]:size-5 max-md:h-12 
   max-md:active:scale-95 data-[disabled=true]:cursor-not-allowed md:gap-1.5 md:rounded-[9px] max-md:active:bg-border/75 
   md:data-[selected=true]:bg-border/50 md:px-2 max-md:text-[1.05rem] data-[disabled=true]:opacity-75 max-md:duration-300`,
   {
      variants: {
         variant: {
            default: ``,
            destructive:
               "max-md:active:bg-destructive/95 md:data-[selected=true]:bg-destructive max-md:active:text-destructive-foreground md:data-[selected=true]:text-destructive-foreground",
         },
      },
      defaultVariants: {
         variant: "default",
      },
   },
)

export function CommandItem({
   children,
   onSelect,
   className,
   inset = false,
   isSelected = false,
   value,
   variant,
   ...props
}: {
   inset?: boolean
   isSelected?: boolean | undefined
   value?: string
} & React.ComponentProps<typeof Command.Item> &
   VariantProps<typeof commandItemVariants>) {
   const isMobile = useUIStore().isMobile

   return (
      <Command.Item
         onSelect={() => {
            // if (isMobile) {
            document.dispatchEvent(
               new KeyboardEvent("keydown", {
                  key: "Escape",
               }),
            )
            // }
            onSelect?.(value ?? "")
         }}
         value={value}
         className={cn(
            commandItemVariants({ variant, className }),
            inset && "pl-8",
         )}
         {...props}
      >
         {children}
         <Icons.check
            strokeWidth={isMobile ? 4 : 2}
            className={cn(
               `ml-auto size-6 md:size-5`,
               isSelected ? "opacity-100" : "opacity-0",
            )}
         />
      </Command.Item>
   )
}

export function CommandLabel({
   className,
   ...props
}: React.ComponentProps<"p">) {
   return (
      <p
         className={cn(
            "px-4 py-1.5 text-foreground/75 text-sm md:px-2",
            className,
         )}
         {...props}
      />
   )
}

export function CommandSeparator({
   className,
   ...props
}: React.ComponentProps<typeof Command.Separator>) {
   return (
      <Command.Separator
         className={cn("-mx-1 my-1 h-px bg-border/75", className)}
         {...props}
      />
   )
}
