import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import { Link, useParams } from "@tanstack/react-router"
import type { ComponentProps } from "react"

export function ViewLinks({ className, ...props }: ComponentProps<"div">) {
   const { slug } = useParams({ from: "/$slug/_layout/issues/$view" })

   return (
      <div
         className={cn("flex items-center gap-1.5", className)}
         {...props}
      >
         <Link
            preload="render"
            activeProps={{
               className: "!border-border/80 bg-elevated opacity-100",
               "aria-current": "page",
            }}
            to={"/$slug/issues/$view"}
            params={{ view: "all", slug }}
            className={cn(
               "group flex h-[31px] items-center gap-1 rounded-[10px] border border-transparent px-1.5 font-semibold text-sm leading-none opacity-75 transition-all duration-[50ms] hover:border-border/80 hover:bg-elevated hover:opacity-100",
            )}
         >
            <Icons.allIssues className="size-[22px]" />
            All issues
         </Link>
         <Link
            preload="render"
            activeProps={{
               className: "!border-border/80 bg-elevated opacity-100",
               "aria-current": "page",
            }}
            to={"/$slug/issues/$view"}
            params={{ view: "active", slug }}
            className={cn(
               "group flex h-[31px] items-center gap-1 rounded-[10px] border border-transparent px-1.5 font-semibold text-sm leading-none opacity-75 transition-all duration-[50ms] hover:border-border/80 hover:bg-elevated hover:opacity-100",
            )}
         >
            <Icons.issues className="size-5" />
            Active
         </Link>
         <Link
            preload="render"
            activeProps={{
               className: "!border-border/80 bg-elevated opacity-100",
               "aria-current": "page",
            }}
            to={"/$slug/issues/$view"}
            params={{ view: "backlog", slug }}
            className={cn(
               "group flex h-[31px] items-center gap-1 rounded-[10px] border border-transparent px-1.5 font-semibold text-sm leading-none opacity-75 transition-all duration-[50ms] hover:border-border/80 hover:bg-elevated hover:opacity-100",
            )}
         >
            <Icons.backlog className="size-[19px]" />
            Backlog
         </Link>
      </div>
   )
}
