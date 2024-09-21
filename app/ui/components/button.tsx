import { cn } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

const buttonVariants = cva(
   `inline-flex items-center cursor-pointer justify-center whitespace-nowrap leading-none active:enabled:scale-[97%] gap-1.5
    duration-200 focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-primary/30 focus-visible:outline-primary/80 
   outline outline outline-transparent outline-offset-1 disabled:opacity-70 disabled:cursor-not-allowed border shadow-sm transition-all`,
   {
      variants: {
         variant: {
            default: `bg-primary/90 hover:enabled:shadow-lg border-transparent focus-visible:ring-foreground/30 focus-visible:outline-foreground/80 
                      text-background/95 hover:enabled:bg-primary disabled:bg-border disabled:text-foreground disabled:border-foreground/10 
                      active:enabled:shadow-md hover:enabled:text-primary-foreground`,
            outline: `bg-background border border-border text-foreground data-[state=open]:border-border hover:enabled:border-border`,
            ghost: "border border-transparent aria-[current=page]:bg-muted hover:enabled:bg-muted/70",
            destructive: `bg-destructive/90 hover:enabled:bg-destructive text-destructive-foreground/90 hover:enabled:text-destructive-foreground`,
            link: "!h-auto !rounded-none !p-0 text-foreground/70 underline transition-none hover:enabled:text-foreground",
         },
         size: {
            default: "h-9 rounded-[10px] px-2.5",
            sm: "h-8 rounded-[8px] px-2",
            lg: "h-10 gap-2 rounded-xl px-3.5",
            icon: "size-8 gap-0",
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
