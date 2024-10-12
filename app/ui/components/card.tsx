import { cn } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

const cardVariants = cva(`border border-border p-3 rounded-xl`, {
   variants: {
      variant: {
         default: `bg-secondary`,
         secondary: "bg-background",
      },
   },
   defaultVariants: {
      variant: "default",
   },
})

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

function CardHeader({ className, children, ...props }: ComponentProps<"div">) {
   return (
      <div
         className={cn("", className)}
         {...props}
      >
         {children}
         <div className={cn("-mx-3 mt-3 h-px bg-border/75")} />
      </div>
   )
}

function CardTitle({ className, ...props }: ComponentProps<"h3">) {
   return (
      <p
         className={cn(
            "mb-2 font-semibold text-lg leading-none tracking-tight",
            className,
         )}
         {...props}
      />
   )
}

function CardDescription({ className, ...props }: ComponentProps<"p">) {
   return (
      <p
         className={cn("mt-2 text-muted-foreground leading-tight", className)}
         {...props}
      />
   )
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
   return (
      <div
         className={cn("pt-3", className)}
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
