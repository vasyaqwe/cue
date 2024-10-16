import { Button } from "@/ui/components/button"
import {
   type ChangeEvent,
   type ComponentProps,
   forwardRef,
   useRef,
} from "react"

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
            inputRef?.current?.click()
            onClick?.(e)
         }}
         ref={ref}
      >
         <input
            type="file"
            hidden
            ref={inputRef}
            onChange={onChange}
         />
         {children}
      </Button>
   )
})
