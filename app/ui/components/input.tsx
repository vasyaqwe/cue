import { cn } from "@/ui/utils"
import { cva } from "class-variance-authority"
import { type ComponentProps, forwardRef } from "react"
import { buttonVariants } from "./button"

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
         data-clearinput
         className={cn(
            buttonVariants({ variant: "outline" }),
            "-translate-y-1/2 !size-[22px] !rounded-md absolute top-1/2 right-[7px] bg-background/90 p-[2px] text-foreground/70 shadow-shadow transition-all ",
            !props.disabled
               ? visible
                  ? "scale-100 opacity-100"
                  : "scale-50 opacity-0"
               : "",
            className,
         )}
         {...props}
      >
         <span className="sr-only">Clear search</span>{" "}
         {/* <xMarkIcon
            className="size-5"
            strokeWidth={2.5}
         /> */}
      </button>
   )
}

export { Input, ClearInputButton, inputVariants }
