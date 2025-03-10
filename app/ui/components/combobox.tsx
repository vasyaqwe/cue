import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from "@/ui/components/command"
import { useUIStore } from "@/ui/store"
import { cn } from "@/ui/utils"
import type {
   PopoverContentProps,
   PopoverProps,
   PopoverTriggerProps,
} from "@radix-ui/react-popover"
import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

type ComboboxSingleProps = {
   multiple?: false
   value?: string
   onValueChange?: (value?: string | undefined) => void
}

type ComboboxMultipleProps = {
   multiple: true
   value?: string[]
   onValueChange?: (value?: string[] | undefined) => void
}

type ComboboxProps = {
   children: React.ReactNode
   shortcut?: string | undefined
} & (ComboboxSingleProps | ComboboxMultipleProps)

type ComboboxContextType = ComboboxSingleProps | ComboboxMultipleProps

const ComboboxContext = React.createContext<ComboboxContextType | null>(null)

function Hotkey({
   shortcut,
   setOpen,
}: { shortcut: string; setOpen: () => void }) {
   useHotkeys(shortcut, setOpen)
   return null
}

export function Combobox({
   children,
   multiple,
   open: openProp,
   onOpenChange: onOpenChangeProp,
   shortcut,
   nested = false,
   ...props
}: ComboboxProps & PopoverProps & { nested?: boolean }) {
   const [open, setOpen] = React.useState(false)
   const isMobile = useUIStore().isMobile

   return (
      <ComboboxContext.Provider
         value={
            {
               multiple,
            } as ComboboxContextType
         }
      >
         {shortcut ? (
            <Hotkey
               shortcut={shortcut}
               setOpen={() => setOpen(!open)}
            />
         ) : null}
         <Popover
            open={!isMobile ? openProp ?? open : undefined}
            onOpenChange={!isMobile ? onOpenChangeProp ?? setOpen : undefined}
            nested={nested}
            {...props}
         >
            {children}
         </Popover>
      </ComboboxContext.Provider>
   )
}

export function ComboboxTrigger({ className, ...props }: PopoverTriggerProps) {
   return (
      <PopoverTrigger
         className={cn("!scale-[unset]", className)}
         {...props}
      />
   )
}

export function ComboboxContent({
   children,
   className,
   ...props
}: PopoverContentProps & { title: string }) {
   return (
      <PopoverContent
         className={cn("pb-safe", className)}
         {...props}
      >
         <Command
            tabIndex={0}
            className={cn("outline-hidden max-md:mt-2")}
         >
            <CommandList>
               <CommandGroup>{children}</CommandGroup>
            </CommandList>
         </Command>
      </PopoverContent>
   )
}

export function ComboboxInput({
   className,
   ...props
}: React.ComponentProps<typeof CommandInput>) {
   return (
      <div className="relative">
         <CommandInput
            className={cn(
               "h-9 w-full border-transparent bg-transparent pr-3 pl-9 placeholder:text-popover-foreground/50 focus:outline-hidden",
               className,
            )}
            {...props}
         />
         <ComboboxSeparator className="mt-0" />
      </div>
   )
}

export function ComboboxSeparator({
   className,
   ...props
}: React.ComponentProps<typeof CommandSeparator>) {
   return (
      <CommandSeparator
         className={cn(
            "-ml-1 my-1 h-px w-[calc(100%+8px)] bg-black shadow-[0px_1.5px_0px_rgb(255_255_255_/_0.1)]",
            className,
         )}
         {...props}
      />
   )
}

export function ComboboxItem({
   ...props
}: React.ComponentProps<typeof CommandItem>) {
   return <CommandItem {...props} />
}

export function ComboboxEmpty({
   className,
   children,
   ...props
}: React.ComponentProps<"div">) {
   return (
      <CommandEmpty
         className={cn(
            "py-6 text-center text-foreground/75 text-sm",
            className,
         )}
         {...props}
      >
         {children}
      </CommandEmpty>
   )
}
