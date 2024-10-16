import { Button } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { Kbd } from "@/ui/components/kbd"
import { useUIStore } from "@/ui/store"
import {
   type ChangeEvent,
   type ComponentProps,
   forwardRef,
   useRef,
} from "react"

export const FILE_TRIGGER_HOTKEY = "mod+shift+f"

export const FileTrigger = forwardRef<
   HTMLButtonElement,
   Omit<ComponentProps<typeof Button>, "onChange"> & {
      onChange: (e: ChangeEvent<HTMLInputElement>) => void
   }
>(({ children, onClick, onChange, ...props }, ref) => {
   const inputRef = useRef<HTMLInputElement>(null)
   return (
      <Button
         aria-label="Add files"
         {...props}
         onClick={(e) => {
            useUIStore.setState({ fileTriggerOpen: true })
            inputRef?.current?.click()
            onClick?.(e)
         }}
         ref={ref}
      >
         <input
            type="file"
            hidden
            ref={inputRef}
            onChange={(e) => {
               onChange(e)
               useUIStore.setState({ fileTriggerOpen: false })
            }}
         />
         {children}
      </Button>
   )
})

export function FileTriggerTooltipContent() {
   return (
      <span className="flex items-center gap-2">
         Add files
         <span className="inline-flex items-center gap-1">
            <Kbd>Ctrl</Kbd>
            <Kbd className="px-0.5 py-0">
               <Icons.shift className="h-5 w-[18px]" />
            </Kbd>
            <Kbd>F</Kbd>
         </span>
      </span>
   )
}
