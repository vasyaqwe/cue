import { Header } from "@/routes/$slug/-components/header"
import { Main } from "@/routes/$slug/-components/main"
import { Card } from "@/ui/components/card"
import { Icons } from "@/ui/components/icons"
import { Input } from "@/ui/components/input"
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/search")({
   component: Component,
   meta: () => [{ title: "Search" }],
   loaderDeps: ({ search: { q } }) => ({ q }),
   // loader: ({ deps: { q } }) => {
   // },
   validateSearch: (search: Record<string, unknown>): { q: string } => {
      if (typeof search.q !== "string") throw new Error("Invalid search query")

      return {
         q: search.q,
      }
   },
})

function Component() {
   const { slug } = useParams({ from: "/$slug/_layout" })
   // const { q } = Route.useSearch()
   const navigate = useNavigate()

   return (
      <Main>
         <Header className="md:px-0">
            <form
               onSubmit={(e) => {
                  e.preventDefault()
                  const query = new FormData(e.target as HTMLFormElement).get(
                     "q",
                  ) as string

                  navigate({
                     to: "/$slug/search",
                     params: { slug },
                     search: { q: query },
                  })
               }}
               className="relative col-span-2 flex w-full items-center"
            >
               <Icons.search className="max-md:-translate-y-1/2 top-1/2 left-4 size-5 shrink-0 opacity-50 max-md:absolute" />
               <Input
                  name="q"
                  autoFocus
                  placeholder="Search your workspace.."
                  className="md:!border-none md:!outline-none w-full max-md:ml-1 md:bg-transparent md:focus:bg-transparent max-md:pl-10"
               />
               {/* <ClearInputButton visible={q.length > 0} /> */}
            </form>
         </Header>
         <main className="relative flex-1 overflow-y-auto py-5 pb-safe-4 md:py-8">
            <div className="md:-translate-y-10 absolute inset-0 m-auto h-fit">
               <div className="relative mb-6">
                  <Card className="absolute inset-0 mx-auto grid h-28 w-[5.5rem] rotate-6 place-content-center rounded-xl" />
                  <Card className="-rotate-6 mx-auto grid h-28 w-[5.5rem] place-content-center rounded-xl">
                     <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           opacity="0.12"
                           d="M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
                           fill="currentColor"
                        />
                        <path
                           d="M21 21L17.5104 17.5104M17.5104 17.5104C19.0486 15.9722 20 13.8472 20 11.5C20 6.80558 16.1944 3 11.5 3C6.80558 3 3 6.80558 3 11.5C3 16.1944 6.80558 20 11.5 20C13.8472 20 15.9722 19.0486 17.5104 17.5104Z"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  </Card>
               </div>
               <p className="mb-1 text-center font-semibold text-lg opacity-75">
                  Search is coming soon
               </p>
            </div>
         </main>
      </Main>
   )
}
