import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import type {
   PopoverContentProps,
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
import {
   type ComponentProps,
   createContext,
   useContext,
   useEffect,
   useState,
} from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

type ComboboxSingleProps = {
   multiple?: false
   value?: string
   onSelect?: (value?: string | undefined) => void
}

type ComboboxMultipleProps = {
   multiple: true
   value?: string[]
   onSelect?: (value?: string[] | undefined) => void
}

type ComboboxProps = {
   children: React.ReactNode
} & (ComboboxSingleProps | ComboboxMultipleProps)

type ComboboxContextType = {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
   internalValue: string | string[]
   setInternalValue: React.Dispatch<React.SetStateAction<string | string[]>>
} & (ComboboxSingleProps | ComboboxMultipleProps)

const ComboboxContext = createContext<ComboboxContextType | null>(null)

export function Combobox({
   children,
   multiple,
   value: externalValue,
   onSelect,
}: ComboboxProps) {
   const [isOpen, setIsOpen] = useState(false)
   const [internalValue, setInternalValue] = useState<string | string[]>(
      multiple ? [] : "",
   )

   useEffect(() => {
      if (externalValue !== undefined) {
         setInternalValue(externalValue)
      }
   }, [externalValue])

   const handleValueChange = (newValue: string | string[]) => {
      setInternalValue(newValue)
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      onSelect?.(newValue as any)
   }

   return (
      <ComboboxContext.Provider
         value={
            {
               multiple,
               value:
                  externalValue !== undefined ? externalValue : internalValue,
               onSelect: handleValueChange,
               isOpen,
               setIsOpen,
               internalValue,
               setInternalValue,
            } as ComboboxContextType
         }
      >
         <Popover
            open={isOpen}
            onOpenChange={setIsOpen}
         >
            {children}
         </Popover>
      </ComboboxContext.Provider>
   )
}

export function ComboboxTrigger({ ...props }: PopoverTriggerProps) {
   return <PopoverTrigger {...props} />
}

export function ComboboxContent({ children, ...props }: PopoverContentProps) {
   return (
      <PopoverContent {...props}>
         <Command>
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
   className,
   destructive = false,
   inset = false,
   ...props
}: {
   value?: string | undefined
   destructive?: boolean
   inset?: boolean
} & ComponentProps<typeof CommandItem>) {
   const context = useContext(ComboboxContext)
   if (!context) throw new Error("ComboboxItem must be used within a Combobox")

   const { multiple, internalValue, onSelect } = context

   const isSelected = !propValue
      ? false
      : multiple
        ? (internalValue as string[]).includes(propValue)
        : internalValue === propValue

   return (
      <CommandItem
         value={propValue}
         onSelect={() => {
            if (multiple) {
               const newValue = isSelected
                  ? (internalValue as string[]).filter(Boolean)
                  : [...(internalValue as string[]), propValue]

               onSelect?.(
                  newValue
                     ? newValue.filter((v) => v !== undefined)
                     : undefined,
               )
            } else {
               onSelect?.(propValue ? propValue : undefined)
            }
         }}
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-1.5 rounded-[8px] px-2 py-1.5 outline-none [&>svg]:size-5 data-[disabled=true]:cursor-not-allowed data-[selected=true]:bg-border/50 data-[disabled=true]:opacity-75",
            inset && "pl-8",
            destructive
               ? "data-[selected=true]:bg-destructive data-[selected=true]:text-destructive-foreground"
               : "",
            className,
         )}
         {...props}
      >
         {children}
         <Icons.check
            className={cn(
               `ml-auto size-5`,
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
