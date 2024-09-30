import { Route as homeRoute } from "@/routes/$slug/_layout"
import { Route as peopleRoute } from "@/routes/$slug/_layout/people"
import { Route as settingsRoute } from "@/routes/$slug/_layout/settings"
import { Icons } from "@/ui/components/icons"
import { useParams } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"

export function BottomMenu() {
   const { slug } = useParams({ from: "/$slug/_layout" })

   return (
      <nav
         style={{
            paddingBottom: `max(calc(env(safe-area-inset-bottom) + 0.4rem), 6px)`,
         }}
         className="fixed bottom-0 z-[2] w-full border-t bg-background p-1.5 shadow md:hidden"
      >
         <ul className="flex flex-1 items-center justify-around gap-2">
            <li className="flex flex-1">
               <Link
                  params={{ slug }}
                  activeOptions={{ exact: true, includeSearch: false }}
                  activeProps={{
                     className: "!border-border/80 bg-border/30 opacity-100",
                     "aria-current": "page",
                  }}
                  to={homeRoute.to}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/80 aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
               >
                  <Icons.issues className="size-6" />
               </Link>
            </li>
            <li className="flex flex-1">
               <Link
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/80 aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
                  params={{ slug }}
                  activeProps={{
                     className: "!border-border/80 bg-border/30 opacity-100",
                     "aria-current": "page",
                  }}
                  to={peopleRoute.to}
               >
                  <Icons.people className="size-6" />
               </Link>
            </li>
            <li className="flex flex-1">
               <Link
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/80 aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
                  params={{ slug }}
                  activeProps={{
                     className: "!border-border/80 bg-border/30 opacity-100",
                     "aria-current": "page",
                  }}
                  to={settingsRoute.to}
               >
                  <Icons.settings className="size-6" />
               </Link>
            </li>
         </ul>
      </nav>
   )
}
