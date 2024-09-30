import { cn } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

const badgeVariants = cva(
   "inline-flex h-[26px] items-center rounded-full border px-2.5 text-xs shadow-sm",
   {
      variants: {
         variant: {
            default: "border-border bg-background text-foreground/90",
         },
      },
      defaultVariants: {
         variant: "default",
      },
   },
)

function Badge({
   className,
   variant,
   ...props
}: ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
   return (
      <div
         className={cn(badgeVariants({ variant }), className)}
         {...props}
      />
   )
}

export { Badge, badgeVariants }
