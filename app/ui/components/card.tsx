import { cn } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

const cardVariants = cva(
   `border bg-muted border-border text-muted-foreground p-3 rounded-xl`,
   {
      variants: {
         variant: {
            default: ``,
         },
      },
      defaultVariants: {
         variant: "default",
      },
   },
)

function Card({
   className,
   variant,
   ...props
}: ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
   return (
      <div
         className={cn(cardVariants({ variant, className }))}
         {...props}
      />
   )
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
   return (
      <div
         className={cn("flex flex-col space-y-1.5 p-6", className)}
         {...props}
      />
   )
}

function CardTitle({ className, ...props }: ComponentProps<"h3">) {
   return (
      <h3
         className={cn("font-semibold leading-none tracking-tight", className)}
         {...props}
      />
   )
}

function CardDescription({ className, ...props }: ComponentProps<"p">) {
   return (
      <p
         className={cn("text-muted-foreground", className)}
         {...props}
      />
   )
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
   return (
      <div
         className={cn("p-6 pt-0", className)}
         {...props}
      />
   )
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
   return (
      <div
         className={cn("flex items-center p-6 pt-0", className)}
         {...props}
      />
   )
}

export {
   Card,
   CardHeader,
   CardFooter,
   CardTitle,
   CardDescription,
   CardContent,
   cardVariants,
}
