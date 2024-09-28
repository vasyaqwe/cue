import { CommandItem } from "@/ui/components/command"
import { cn } from "@/ui/utils"
import type {
   PopoverContentProps,
   PopoverProps,
   PopoverTriggerProps,
} from "@radix-ui/react-popover"
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandList,
   CommandSeparator,
} from "cmdk"
import type React from "react"
import { type ComponentProps, createContext } from "react"
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
} & (ComboboxSingleProps | ComboboxMultipleProps)

type ComboboxContextType = ComboboxSingleProps | ComboboxMultipleProps

const ComboboxContext = createContext<ComboboxContextType | null>(null)

export function Combobox({
   children,
   multiple,
   value: propValue,
   ...props
}: ComboboxProps & PopoverProps) {
   return (
      <ComboboxContext.Provider
         value={
            {
               multiple,
            } as ComboboxContextType
         }
      >
         <Popover {...props}>{children}</Popover>
      </ComboboxContext.Provider>
   )
}

export function ComboboxTrigger({ ...props }: PopoverTriggerProps) {
   return <PopoverTrigger {...props} />
}

export function ComboboxContent({
   children,
   ...props
}: PopoverContentProps & { title: string }) {
   return (
      <PopoverContent
         style={{
            ...props.style,
            paddingBottom: `max(calc(env(safe-area-inset-bottom) + 0.5rem), 0.5rem)`,
         }}
         {...props}
      >
         <Command
            tabIndex={0}
            className={cn("outline-none max-md:mt-2")}
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
         {/* <MagnifyingGlassIcon
            className="-translate-y-1/2 absolute top-[49%] left-2 size-5 text-popover-foreground/50"
            strokeWidth={2}
         /> */}
         <CommandInput
            className={cn(
               "h-9 w-full border-transparent bg-transparent pr-3 pl-9 placeholder:text-popover-foreground/50 focus:outline-none",
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
}: ComponentProps<typeof CommandSeparator>) {
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

export function ComboboxItem({ ...props }: ComponentProps<typeof CommandItem>) {
   return <CommandItem {...props} />
}

export function ComboboxEmpty({
   className,
   children,
   ...props
}: ComponentProps<"div">) {
   return (
      <CommandEmpty
         className={cn("py-6 text-center text-sm", className)}
         {...props}
      >
         {children}
      </CommandEmpty>
   )
}
