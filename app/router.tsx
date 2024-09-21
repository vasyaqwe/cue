import { routeTree } from "@/routeTree.gen"
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
import type { TRPCError } from "@trpc/server"
import superjson from "superjson"

type TRPCClientError = Error & {
   data: {
      code: TRPCError["code"]
   }
}

export const isTRPCClientError = (error: Error): error is TRPCClientError =>
   "data" in error &&
   error.data !== null &&
   typeof error.data === "object" &&
   "code" in error.data

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
            retry(failureCount, error) {
               if (
                  isTRPCClientError(error) &&
                  error.data?.code === "UNAUTHORIZED"
               ) {
                  return false
               }

               // 2 max
               return failureCount < 1
            },
            // 3 min
            staleTime: 180 * 1000,
         },
         mutations: {
            onError: (error) => {
               if (isTRPCClientError(error)) {
                  if (error.data?.code === "TOO_MANY_REQUESTS") {
                     return toast.error(
                        "Too many requests, please try again later",
                     )
                  }

                  if (error.data?.code !== "INTERNAL_SERVER_ERROR")
                     return toast.error(error.message)

                  return toast.error("An error occurred, please try again")
               }

               toast.error("An unknown error occurred")
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
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4">
         <div className="flex flex-wrap items-center gap-2">
            <button
               onClick={() => {
                  window.history.back()
               }}
               className={`rounded bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700`}
            >
               Go Back
            </button>
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

   if (import.meta.env.DEV === "development") {
      console.error(error)
   }

   return (
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4">
         <ErrorComponent error={error} />
         <div className="flex flex-wrap items-center gap-2">
            <button
               onClick={() => {
                  router.invalidate()
               }}
               className={`rounded bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700`}
            >
               Try Again
            </button>
            {isRoot ? (
               <Link
                  to="/"
                  className={`rounded bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700`}
               >
                  Home
               </Link>
            ) : (
               <Link
                  to="/"
                  className={`rounded bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700`}
                  onClick={(e) => {
                     e.preventDefault()
                     window.history.back()
                  }}
               >
                  Go Back
               </Link>
            )}
         </div>
      </div>
   )
}

declare module "@tanstack/react-router" {
   interface Register {
      router: ReturnType<typeof createRouter>
   }
}
