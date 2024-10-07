import { cn } from "@/ui/utils"

export function TransitionHeight({
   children,
   className,
   ...props
}: React.ComponentProps<"div">) {
   return (
      <div
         className={cn(
            "grid overflow-hidden transition-all duration-500 ease-[var(--ease-vaul)] data-[expanded=true]:visible data-[expanded=false]:invisible data-[expanded=false]:grid-rows-[0fr] data-[expanded=true]:grid-rows-[1fr]",
            className,
         )}
         {...props}
      >
         <div className="min-h-0">{children}</div>
      </div>
   )
}
