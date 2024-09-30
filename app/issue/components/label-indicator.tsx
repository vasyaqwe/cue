import type { IssueLabel } from "@/issue/schema"
import { cn } from "@/ui/utils"
import type { ComponentProps } from "react"

export function LabelIndicator({
   className,
   label,
   ...props
}: ComponentProps<"span"> & { label: IssueLabel }) {
   return (
      <span
         aria-hidden={true}
         className={cn(
            "mr-0.5 inline-block size-2.5 rounded-full transition-colors duration-300",
            label === "bug"
               ? "bg-red-500"
               : label === "feature"
                 ? "bg-green-500"
                 : "bg-yellow-500",
            className,
         )}
         {...props}
      />
   )
}
