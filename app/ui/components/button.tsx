import { cn } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import { type ComponentProps, forwardRef } from "react"

const buttonVariants = cva(
   `inline-flex items-center cursor-pointer justify-center whitespace-nowrap leading-none gap-1.5 font-medium
    focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-primary/30 focus-visible:outline-primary/80 shadow-sm
    outline outline-transparent outline-offset-1 disabled:opacity-70 disabled:cursor-not-allowed border transition-all`,
   {
      variants: {
         variant: {
            default: `active:enabled:scale-[98%] bg-primary/90 hover:enabled:shadow-md border-transparent focus-visible:ring-foreground/30 focus-visible:outline-foreground/80 
                      text-background/95 hover:enabled:bg-primary disabled:bg-background disabled:text-foreground disabled:border-foreground/20 
                      active:enabled:shadow-sm hover:enabled:text-primary-foreground disabled:!text-foreground/70`,
            secondary: `active:enabled:scale-[98%] bg-border/75 border-transparent hover:bg-border`,
            outline: `active:enabled:scale-[98%] bg-popover !shadow-button border border-transparent text-foreground disabled:!text-foreground/70 data-[state=open]:bg-elevated/75 hover:enabled:bg-elevated/75`,
            ghost: "!shadow-none disabled:!text-foreground/70 border border-transparent active:enabled:scale-[98%] data-[state=open]:bg-muted hover:enabled:bg-border/50",
            destructive: `active:enabled:scale-[98%] bg-destructive border-destructive hover:enabled:bg-destructive/90 text-destructive-foreground`,
            link: "!h-auto !p-0 !shadow-none inline-block border-transparent text-base text-foreground/70 underline transition-none hover:enabled:text-foreground",
         },
         size: {
            default: "h-8 rounded-full px-3 text-[0.94rem]",
            sm: "h-7 rounded-full px-2.5",
            lg: "h-9 gap-2 rounded-full px-3.5 text-[1rem]",
            xl: "h-10 gap-2 rounded-full px-3.5 text-[1.0325rem]",
            icon: "size-8 gap-0 rounded-full",
            "icon-sm": "size-[30px] gap-0 rounded-full",
         },
      },
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   },
)

const Button = forwardRef<
   HTMLButtonElement,
   ComponentProps<"button"> & VariantProps<typeof buttonVariants>
>(({ className, variant, size, ...props }, ref) => {
   return (
      <button
         ref={ref}
         className={cn(buttonVariants({ variant, size, className }))}
         {...props}
      />
   )
})

export { Button, buttonVariants }
