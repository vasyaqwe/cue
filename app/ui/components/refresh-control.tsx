import { Loading } from "@/ui/components/loading"
import { cn } from "@/ui/utils"
import type { ComponentProps } from "react"

function RefreshControl({
   children,
   isRefetching,
   className,
   ...props
}: ComponentProps<"div"> & { isRefetching: boolean }) {
   return (
      <>
         <div
            className={cn(
               `z-[1] flex w-full items-center justify-center transition-all duration-300 ease-out `,
               isRefetching
                  ? "visible h-16 opacity-100"
                  : "invisible h-0 opacity-0",
               className,
            )}
            {...props}
         >
            <Loading />
         </div>
         {children}
      </>
   )
}

export default RefreshControl
