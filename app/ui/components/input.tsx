import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import { cva } from "class-variance-authority"
import * as React from "react"

const inputVariants = cva(
   `block h-9 w-full rounded-xl duration-50 text-[0.95rem] border border-border focus:border-brand/80
    px-3 bg-popover shadow-[inset_0_1px_1px_0_rgb(0,0,0,0.1)] placeholder:text-foreground/40 outline-hidden 
    has-[+button[data-clearinput]:active]:border-primary
    has-[+button[data-clearinput]:active]:outline-primary/30 appearance-none`,
)
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
   ({ className, ...props }, ref) => {
      return (
         <input
            ref={ref}
            className={cn(inputVariants(), className)}
            {...props}
         />
      )
   },
)

function ClearInputButton({
   className,
   visible,
   ...props
}: React.ComponentProps<"button"> & {
   visible: boolean
}) {
   return (
      <button
         type="button"
         data-clearinput
         className={cn(
            "-translate-y-1/2 absolute top-1/2 right-2 grid size-10 shrink-0 cursor-pointer place-items-center p-0 text-foreground/65 transition-opacity",
            !props.disabled
               ? visible
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
               : "",
            className,
         )}
         {...props}
      >
         <span className="sr-only">Clear search</span>{" "}
         <Icons.xMark className="size-[18px]" />
      </button>
   )
}

export { Input, ClearInputButton, inputVariants }
