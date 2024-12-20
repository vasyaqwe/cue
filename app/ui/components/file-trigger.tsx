import { Button } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { Kbd } from "@/ui/components/kbd"
import { useUIStore } from "@/ui/store"
import * as React from "react"

export const FILE_TRIGGER_HOTKEY = "mod+shift+f"

export const FileTrigger = React.forwardRef<
   HTMLButtonElement,
   Omit<React.ComponentProps<typeof Button>, "onChange"> & {
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
   }
>(({ children, onClick, onChange, ...props }, ref) => {
   const inputRef = React.useRef<HTMLInputElement>(null)
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
