import { ServerFnError } from "@/error"
import { routeTree } from "@/routeTree.gen"
import { Button, buttonVariants } from "@/ui/components/button"
import { Card } from "@/ui/components/card"
import { toast } from "@/ui/components/toast"
import { QueryClient } from "@tanstack/react-query"
import {
   ErrorComponent,
   type ErrorComponentProps,
   Link,
   createRouter as createTanStackRouter,
   rootRouteId,
   useMatch,
   useRouter,
} from "@tanstack/react-router"
import { routerWithQueryClient } from "@tanstack/react-router-with-query"
import superjson from "superjson"
import { z } from "zod"

export function createRouter() {
   const queryClient = new QueryClient({
      defaultOptions: {
         dehydrate: {
            serializeData: superjson.serialize,
         },
         hydrate: {
            deserializeData: superjson.deserialize,
         },
         queries: {
            retry(failureCount) {
               // 2 max
               return failureCount < 1
            },
            // 15 min
            staleTime: 900 * 1000,
         },
         mutations: {
            onError: (error) => {
               try {
                  const parsedError: unknown = JSON.parse(error.message)

                  const errorSchema = z.object({
                     body: ServerFnError.schema,
                  })
                  const result = errorSchema.safeParse(parsedError)

                  if (!result.success || !result.data.body.message) {
                     return toast.error("An unknown error occurred")
                  }

                  if (result.data.body.message)
                     return toast.error(result.data.body.message)
               } catch (_e) {
                  return toast.error("An unknown error occurred")
               }
            },
         },
      },
   })
   return routerWithQueryClient(
      createTanStackRouter({
         routeTree,
         context: { queryClient },
         defaultPreload: "intent",
         defaultPendingMs: 150,
         defaultPendingMinMs: 200,
         defaultPreloadStaleTime: 0,
         transformer: superjson,
         defaultErrorComponent: CatchBoundary,
         defaultNotFoundComponent: NotFound,
      }),
      queryClient,
   )
}

function NotFound() {
   return (
      <div className="grid h-svh flex-1 place-items-center text-center">
         <div>
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
                        opacity="0.1"
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
            <h1 className="mb-1 font-semibold text-xl">Not found</h1>
            <p className="mb-5 text-foreground/70 text-lg leading-snug">
               This page does not exist — <br /> it may have been moved or
               deleted.
            </p>
            <Link
               to={"/"}
               className={buttonVariants()}
            >
               Back home
            </Link>
         </div>
      </div>
   )
}

function CatchBoundary({ error }: ErrorComponentProps) {
   const router = useRouter()
   const isRoot = useMatch({
      strict: false,
      select: (state) => state.id === rootRouteId,
   })

   return (
      <div className="grid h-svh w-full place-items-center text-center">
         {import.meta.env.DEV && (
            <div className="absolute top-0">
               <ErrorComponent error={error} />{" "}
            </div>
         )}

         <div>
            <h1 className="mb-1 font-semibold text-xl">
               Oh, no! Something went wrong.
            </h1>
            <p className="mb-5 text-foreground/70 text-lg leading-snug">
               A technical error has occurred. <br className="sm:hidden" />{" "}
               Please try again.
            </p>
            <div className="flex items-center justify-center gap-2.5">
               <Button
                  onClick={() => {
                     router.invalidate()
                  }}
               >
                  Try Again
               </Button>
               {isRoot ? (
                  <Link
                     to="/"
                     className={buttonVariants({ variant: "outline" })}
                  >
                     Back home
                  </Link>
               ) : (
                  <Link
                     to="/"
                     className={buttonVariants({ variant: "outline" })}
                     onClick={(e) => {
                        e.preventDefault()
                        window.history.back()
                     }}
                  >
                     Go back
                  </Link>
               )}
            </div>
         </div>
      </div>
   )
}

declare module "@tanstack/react-router" {
   interface Register {
      router: ReturnType<typeof createRouter>
   }
}
