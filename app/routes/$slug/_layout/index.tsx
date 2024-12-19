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
   useLoaderData,
   useNavigate,
   useParams,
} from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createFileRoute("/$slug/_layout/")({
   component: Component,
   // server-side redirect breaks pending component of /$slug/_layout
   // beforeLoad: ({ params, context }) => {
   //    match(context.device).with("desktop", () => {
   //       throw redirect({
   //          to: "/$slug/workaround",
   //          params: { slug: params.slug },
   //       })
   //    })
   // },
   head: () => ({
      meta: [{ title: "Home" }],
   }),
})

function Component() {
   const { device } = useLoaderData({ from: "/$slug/_layout" })
   const { slug } = useParams({ from: "/$slug/_layout" })
   const { organization } = useAuth()
   const navigate = useNavigate()
   const lastVisitedView = useIssueStore().lastVisitedView

   // workaround for broken server-side redirect
   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
   useEffect(() => {
      if (device === "mobile") return

      navigate({
         to: "/$slug/issues/$view",
         params: {
            view: "all",
            slug,
         },
      })
   }, [])

   if (device !== "mobile")
      return (
         <div className="fixed inset-0 z-[999] size-full bg-background">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full">
               <Logo className="mx-auto animate-fade-in opacity-0 [--animation-delay:100ms]" />
               <h1 className="mt-4 animate-fade-in text-center font-medium text-foreground/80 opacity-0 duration-500 [--animation-delay:600ms]">
                  Workspace is loading...
               </h1>
            </div>
         </div>
      )

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
               preload={"render"}
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

// function PendingComponent() {
//    const { organization } = useAuth()

//    return (
//       <>
//          <Header>
//             <Logo className="size-8 md:hidden" />
//             <HeaderTitle>{organization.name}</HeaderTitle>
//          </Header>
//          <div>
//             <Loading className="absolute inset-0 m-auto" />
//          </div>
//       </>
//    )
// }
