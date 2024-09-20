import { cn } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"

const buttonVariants = cva(
   `inline-flex items-center justify-center whitespace-nowrap text-[0.95rem] leading-none
   ring-offset-background focus-visible:outline-none gap-1.5 
   focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 
   disabled:pointer-events-none disabled:opacity-80 border shadow-sm transition-all button hover:opacity-90`,
   {
      variants: {
         variant: {
            default: `bg-gradient-to-tr from-primary/85 font-medium to-primary/70 text-background border-primary`,
            outline: `bg-background hover:border-border border-border/70 backdrop-blur-md hover:bg-border/10 `,
         },
         size: {
            default: "h-9 rounded-[10px] px-2.5",
            sm: "h-8 rounded-[0.6rem] px-2",
            lg: "h-9 gap-2 rounded-xl px-3.5",
            icon: "size-8 gap-0",
         },
      },
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   },
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
   VariantProps<typeof buttonVariants> & {
      asChild?: boolean
   }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
   ({ className, variant, size, ...props }, ref) => {
      return (
         <button
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
         />
      )
   },
)
Button.displayName = "Button"

export { Button, buttonVariants, type ButtonProps }
