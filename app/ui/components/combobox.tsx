import { Icons } from "@/ui/components/icons"
import { useIsMobile } from "@/ui/hooks/use-is-mobile"
import { cn } from "@/ui/utils"
import type {
   PopoverContentProps,
   PopoverProps,
   PopoverTriggerProps,
} from "@radix-ui/react-popover"
import {
   Command,
   CommandEmpty,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from "cmdk"
import type React from "react"
import { type ComponentProps, createContext, useContext } from "react"
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

type ComboboxContextType = {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
   isMobile: boolean
} & (ComboboxSingleProps | ComboboxMultipleProps)

const ComboboxContext = createContext<ComboboxContextType | null>(null)

export function Combobox({
   children,
   multiple,
   value: propValue,
   ...props
}: ComboboxProps & PopoverProps) {
   const { isMobile } = useIsMobile()
   return (
      <ComboboxContext.Provider
         value={
            {
               multiple,
               isMobile,
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
         <Command className={cn("max-md:mt-2")}>
            <CommandList>{children}</CommandList>
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

export function ComboboxItem({
   children,
   value: propValue,
   onSelect,
   className,
   destructive = false,
   inset = false,
   isSelected = false,
   ...props
}: {
   value: string
   destructive?: boolean
   inset?: boolean
   isSelected?: boolean | undefined
   onSelect: (value: string) => void
} & ComponentProps<typeof CommandItem>) {
   const context = useContext(ComboboxContext)
   if (!context) throw new Error("ComboboxItem must be used within a Combobox")

   return (
      <CommandItem
         value={propValue}
         onSelect={() => {
            if (context.isMobile) {
               document.dispatchEvent(
                  new KeyboardEvent("keydown", {
                     key: "Escape",
                  }),
               )
            }

            onSelect(propValue)
         }}
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-2.5 rounded-xl px-4 py-1.5 outline-none md:[&_svg]:size-5 max-md:h-12 max-md:active:scale-95 data-[disabled=true]:cursor-not-allowed md:gap-1.5 md:rounded-[8px] max-md:active:bg-border/50 md:data-[selected=true]:bg-border/50 md:px-2 max-md:text-[1.05rem] data-[disabled=true]:opacity-75 max-md:duration-300",
            inset && "pl-8",
            destructive
               ? "max-md:active:bg-destructive/95 md:data-[selected=true]:bg-destructive max-md:active:text-destructive-foreground md:data-[selected=true]:text-destructive-foreground"
               : "",
            className,
         )}
         {...props}
      >
         {children}
         <Icons.check
            strokeWidth={context.isMobile ? 4 : 2}
            className={cn(
               `ml-auto size-6 md:size-5`,
               isSelected ? "opacity-100" : "opacity-0",
            )}
         />
      </CommandItem>
   )
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
