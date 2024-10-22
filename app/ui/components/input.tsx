import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import { cva } from "class-variance-authority"
import { type ComponentProps, forwardRef } from "react"

const inputVariants = cva(
   `block h-10 w-full rounded-full transition-all text-[0.95rem] border border-border focus:border-primary/90
    px-3 bg-muted/50 focus:bg-muted/60 placeholder:text-foreground/40 outline-2 outline-transparent focus:outline-primary/30
    has-[+button[data-clearinput]:active]:border-primary
    has-[+button[data-clearinput]:active]:outline-primary/30 appearance-none`,
)
const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
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
}: ComponentProps<"button"> & {
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
