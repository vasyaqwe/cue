import { Loading } from "@/ui/components/loading"
import { cn } from "@/ui/utils"

function RefreshControl({
   children,
   isRefreshing,
   className,
   ...props
}: React.ComponentProps<"div"> & { isRefreshing: boolean }) {
   return (
      <>
         <div
            className={cn(
               `z-[1] flex w-full items-center justify-center transition-all duration-300 ease-out `,
               isRefreshing
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
