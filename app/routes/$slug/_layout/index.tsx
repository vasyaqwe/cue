import { FavoriteList } from "@/favorite/components/favorite-list"
import { useIssueStore } from "@/issue/store"
import {
   Header,
   HeaderProfileDrawer,
   HeaderTitle,
} from "@/routes/$slug/-components/header"
import { Card } from "@/ui/components/card"
import { Icons } from "@/ui/components/icons"
import { Input } from "@/ui/components/input"
import { Logo } from "@/ui/components/logo"
import { useAuth } from "@/user/hooks"
import {
   Link,
   createFileRoute,
   redirect,
   useNavigate,
   useParams,
} from "@tanstack/react-router"
import { match } from "ts-pattern"

export const Route = createFileRoute("/$slug/_layout/")({
   component: Component,
   beforeLoad: ({ params, context }) => {
      match(context.device).with("desktop", () => {
         throw redirect({
            to: "/$slug/issues/$view",
            params: { slug: params.slug, view: "all" },
         })
      })
   },
   head: () => ({
      meta: [{ title: "Home" }],
   }),
})

function Component() {
   const { slug } = useParams({ from: "/$slug/_layout" })
   const { organization } = useAuth()
   const navigate = useNavigate()
   const lastVisitedView = useIssueStore().lastVisitedView

   return (
      <>
         <Header>
            <Logo className="size-8 md:hidden" />
            <HeaderTitle className="mx-1.5 truncate">
               {organization.name}
            </HeaderTitle>
            <HeaderProfileDrawer className="md:hidden" />
         </Header>
         <div className="overflow-y-auto p-4">
            <form
               onSubmit={(e) => {
                  e.preventDefault()

                  const q = new FormData(e.target as HTMLFormElement).get(
                     "q",
                  ) as string | null
                  if (!q) throw new Error("No query")

                  navigate({
                     to: "/$slug/search",
                     search: { q },
                     params: {
                        slug,
                     },
                  })
               }}
            >
               <div className="relative">
                  <Icons.search className="-translate-y-1/2 absolute top-1/2 left-3 size-5 opacity-50" />
                  <Input
                     name="q"
                     placeholder="Search"
                     className="pl-10"
                  />
               </div>
            </form>
            <Link
               to="/$slug/issues/$view"
               params={{ slug, view: lastVisitedView }}
            >
               <Card className="mt-4 pb-2 font-semibold">
                  <div
                     className={
                        "mb-2 size-9 shrink-0 drop-shadow-[0px_3px_3px_rgba(24,24,24,.1)]"
                     }
                  >
                     <div
                        className={
                           "squircle grid size-full transform-gpu place-content-center bg-background bg-gradient-to-b from-foreground/70 to-foreground text-background"
                        }
                     >
                        <Icons.issues className="size-[22px] opacity-90" />
                     </div>
                  </div>
                  <p className="flex items-center justify-between">
                     Issues{" "}
                     <Icons.arrowLeft className="-mb-px size-5 rotate-180 opacity-80" />
                  </p>
               </Card>
            </Link>
            <FavoriteList />
         </div>
      </>
   )
}
