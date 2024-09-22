import { cn } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

const buttonVariants = cva(
   `inline-flex items-center cursor-pointer justify-center whitespace-nowrap leading-none active:enabled:scale-[97%] gap-1.5 font-medium
    focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-primary/30 focus-visible:outline-primary/80 shadow-sm
    outline outline outline-transparent outline-offset-1 disabled:opacity-75 disabled:cursor-not-allowed border transition-all`,
   {
      variants: {
         variant: {
            default: `bg-primary/90 hover:enabled:shadow-lg border-transparent focus-visible:ring-foreground/30 focus-visible:outline-foreground/80 
                      text-background/95 hover:enabled:bg-primary disabled:bg-background disabled:text-foreground disabled:border-foreground/20 
                      active:enabled:shadow-md hover:enabled:text-primary-foreground`,
            outline: `bg-popover !shadow-button border border-transparent text-foreground data-[state=open]:bg-border/5 hover:enabled:bg-border/5`,
            ghost: "border border-transparent shadow-none aria-[current=page]:bg-muted hover:enabled:bg-muted/70",
            destructive: `bg-destructive/90 hover:enabled:bg-destructive text-destructive-foreground/90 hover:enabled:text-destructive-foreground`,
            link: "!h-auto !rounded-none !p-0 text-foreground/70 underline transition-none hover:enabled:text-foreground",
         },
         size: {
            default: "h-8 rounded-lg px-3",
            sm: "h-7 rounded-[8px] px-2.5",
            lg: "h-9 gap-2 rounded-[10px] px-3.5 text-[0.95rem]",
            icon: "size-9 gap-0",
         },
      },
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   },
)

function Button({
   className,
   variant,
   size,
   ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
   return (
      <button
         className={cn(buttonVariants({ variant, size, className }))}
         {...props}
      />
   )
}

export { Button, buttonVariants }
