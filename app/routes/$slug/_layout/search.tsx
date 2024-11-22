import { useLocalStorage } from "@/interactions/use-local-storage"
import { StatusIcon } from "@/issue/components/icons"
import { Header, HeaderBackButton } from "@/routes/$slug/-components/header"
import { Main } from "@/routes/$slug/-components/main"
import { searchListQuery } from "@/search/queries"
import { Button, buttonVariants } from "@/ui/components/button"
import { Card } from "@/ui/components/card"
import { Icons } from "@/ui/components/icons"
import { ClearInputButton, Input } from "@/ui/components/input"
import { useIsClient } from "@/ui/hooks/use-is-client"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { formatDateRelative } from "@/utils/format"
import { useQuery } from "@tanstack/react-query"
import {
   Link,
   createFileRoute,
   useNavigate,
   useParams,
} from "@tanstack/react-router"
import { useRef, useState } from "react"

export const Route = createFileRoute("/$slug/_layout/search")({
   component: Component,
   head: () => ({
      meta: [{ title: "Search" }],
   }),
   validateSearch: (search: Record<string, unknown>): { q: string } => {
      if (typeof search.q !== "string") throw new Error("Invalid search query")

      return {
         q: search.q,
      }
   },
})

function Component() {
   const { organizationId } = useAuth()
   const { slug } = useParams({ from: "/$slug/_layout" })

   const { q } = Route.useSearch()
   const navigate = useNavigate()
   const [query, setQuery] = useState(q)
   const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
      `search_recent_${slug}`,
      [],
   )
   const inputRef = useRef<HTMLInputElement>(null)

   const { isClient } = useIsClient()

   const searchResults = useQuery(searchListQuery({ query: q, organizationId }))

   return (
      <Main>
         <Header className="md:px-0">
            <HeaderBackButton />
            <form
               onSubmit={(e) => {
                  e.preventDefault()
                  const query = (
                     new FormData(e.target as HTMLFormElement).get(
                        "q",
                     ) as string
                  )
                     .toString()
                     .trim()

                  if (query.length === 0) return

                  navigate({
                     to: "/$slug/search",
                     params: { slug },
                     search: { q: query },
                  })

                  if (!recentSearches.includes(query))
                     setRecentSearches((prev) => [query, ...prev])
               }}
               className="relative col-span-2 flex w-full items-center"
            >
               <div className="max-md:-translate-y-1/2 top-1/2 left-4 grid size-5 shrink-0 place-items-center opacity-50 max-md:absolute">
                  <Icons.search className="md:-mt-px size-5" />
               </div>
               <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                     setQuery(e.target.value)
                     if (e.target.value.length === 0) {
                        navigate({
                           to: "/$slug/search",
                           params: {
                              slug,
                           },
                           search: {
                              q: "",
                           },
                        })
                     }
                  }}
                  name="q"
                  autoFocus
                  placeholder="Search your workspace.."
                  className="md:!border-none md:!outline-hidden w-full max-md:ml-1 md:bg-transparent md:focus:bg-transparent max-md:pl-10"
               />
               <ClearInputButton
                  onClick={() => {
                     setQuery("")
                     navigate({
                        to: "/$slug/search",
                        params: { slug },
                        search: { q: "" },
                     })
                     setTimeout(() => {
                        inputRef.current?.focus()
                     }, 0)
                  }}
                  visible={query.length > 0}
               />
            </form>
         </Header>
         <main className="relative flex-1 overflow-y-auto">
            {q.length === 0 ? (
               <>
                  {!isClient || recentSearches.length === 0 ? null : (
                     <>
                        <div className="my-2 flex items-center justify-between px-4 md:px-8">
                           <p className="opacity-65">Recent searches</p>
                           <Button
                              onClick={() => setRecentSearches([])}
                              size={"sm"}
                              variant={"ghost"}
                              className="-mr-3 text-foreground/80"
                           >
                              Clear
                           </Button>
                        </div>
                        {recentSearches.map((q) => (
                           <Link
                              onClick={(e) => {
                                 // @ts-expect-error ...
                                 if (e.target.closest("button"))
                                    return e.preventDefault()

                                 setQuery(q)
                              }}
                              className={cn(
                                 buttonVariants({ variant: "ghost" }),
                                 "group flex h-[34px] justify-between rounded-none px-4 transition-none hover:bg-border/50 md:px-8",
                              )}
                              key={q}
                              to="/$slug/search"
                              params={{ slug }}
                              search={{ q }}
                           >
                              <span className="line-clamp-1 break-all">
                                 {q}
                              </span>
                              <button
                                 onClick={(_e) => {
                                    setRecentSearches((prev) =>
                                       prev.filter((item) => item !== q),
                                    )
                                 }}
                                 className="hidden size-6 shrink-0 cursor-pointer place-items-center rounded-full opacity-80 group-hover:grid hover:bg-border"
                              >
                                 <Icons.xMark className="size-4" />
                                 <span className="sr-only">
                                    Remove recent search
                                 </span>{" "}
                              </button>
                           </Link>
                        ))}
                     </>
                  )}
               </>
            ) : (
               <>
                  {searchResults.isPending ? null : searchResults.isError ||
                    searchResults.data.length === 0 ? (
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
                           No results found
                        </p>
                     </div>
                  ) : (
                     <div className="space-y-1.5 p-1.5">
                        {searchResults.data.map((item) => (
                           <Link
                              key={item.id}
                              to="/$slug/issue/$issueId"
                              params={{
                                 slug,
                                 issueId: item.id,
                              }}
                              hash={
                                 item.isComment && item.commentId
                                    ? item.commentId
                                    : undefined
                              }
                              className={
                                 "block w-full rounded-xl p-2 hover:bg-border/50"
                              }
                           >
                              <div className="-mt-px flex w-full items-center">
                                 <StatusIcon
                                    className="size-[15px]"
                                    status={item.status}
                                 />
                                 <p
                                    dangerouslySetInnerHTML={{
                                       __html: item.highlightedTitle,
                                    }}
                                    className="ml-1.5 line-clamp-1 break-all font-semibold leading-snug"
                                 />
                                 <span className="ml-auto whitespace-nowrap text-xs opacity-75">
                                    {formatDateRelative(
                                       item.createdAt,
                                       "narrow",
                                    )
                                       .replace("ago", "")
                                       .replace("yesterday", "1d")}
                                 </span>
                              </div>
                              <div className="flex w-full items-center gap-[5px]">
                                 <p
                                    dangerouslySetInnerHTML={{
                                       __html: item.highlightedContent,
                                    }}
                                    className="line-clamp-1 break-all text-sm tracking-normal opacity-75"
                                 />
                                 {item.isComment ? (
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="none"
                                       viewBox="0 0 24 24"
                                       strokeWidth="2"
                                       stroke="currentColor"
                                       className="-mb-px ml-auto size-[18px] opacity-80"
                                    >
                                       <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                                       />
                                    </svg>
                                 ) : null}
                              </div>
                           </Link>
                        ))}
                     </div>
                  )}
               </>
            )}
         </main>
      </Main>
   )
}
