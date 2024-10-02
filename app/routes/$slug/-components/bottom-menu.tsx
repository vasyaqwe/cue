import { pushModal } from "@/modals"
import { Route as homeRoute } from "@/routes/$slug/_layout"
import { Route as inboxRoute } from "@/routes/$slug/_layout/inbox/_layout/index"
import { Route as peopleRoute } from "@/routes/$slug/_layout/people"
import { Route as settingsRoute } from "@/routes/$slug/_layout/settings"
import { Icons } from "@/ui/components/icons"
import { useParams } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"

export function BottomMenu() {
   const { slug } = useParams({ from: "/$slug/_layout" })

   return (
      <nav className="fixed bottom-0 z-[2] h-[calc(var(--bottom-menu-height)+max(calc(env(safe-area-inset-bottom)+6px),5px))] w-full border-border border-t bg-background p-1.5 shadow md:hidden">
         <ul className="flex flex-1 items-center justify-around gap-2">
            <li className="flex flex-1">
               <Link
                  params={{ slug }}
                  activeOptions={{ exact: true }}
                  activeProps={{
                     "aria-current": "page",
                  }}
                  to={homeRoute.to}
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/50 transition-colors aria-[current=page]:text-foreground"
               >
                  <Icons.issues className="size-7" />
               </Link>
            </li>
            <li className="flex flex-1">
               <Link
                  params={{ slug }}
                  activeProps={{
                     "aria-current": "page",
                  }}
                  to={inboxRoute.to}
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/50 transition-colors aria-[current=page]:text-foreground"
                  // data-has-unread={true}
               >
                  <Icons.inbox className="size-[29px]" />
               </Link>
            </li>
            <li className="flex flex-1">
               <button
                  onClick={() => pushModal("create_issue")}
                  className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-md text-foreground/50 transition-colors active:text-foreground"
               >
                  <Icons.pencil className="size-[27px] [&>path:first-child]:opacity-0" />
               </button>
            </li>
            <li className="flex flex-1">
               <Link
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/50 transition-colors aria-[current=page]:text-foreground"
                  params={{ slug }}
                  activeProps={{
                     "aria-current": "page",
                  }}
                  to={peopleRoute.to}
               >
                  <Icons.people className="size-7" />
               </Link>
            </li>
            <li className="flex flex-1">
               <Link
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/50 transition-colors aria-[current=page]:text-foreground"
                  params={{ slug }}
                  activeProps={{
                     "aria-current": "page",
                  }}
                  to={settingsRoute.to}
               >
                  <Icons.settings className="size-7" />
               </Link>
            </li>
         </ul>
      </nav>
   )
}
