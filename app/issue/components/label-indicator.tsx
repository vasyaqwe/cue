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
            "mr-0.5 inline-block size-2.5 rounded-full",
            label === "bug"
               ? "bg-red-400"
               : label === "feature"
                 ? "bg-green-400"
                 : "bg-yellow-400",
            className,
         )}
         {...props}
      />
   )
}
