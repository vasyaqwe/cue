import * as auth from "@/auth/functions"
import { useUser } from "@/auth/hooks"
import { organizationMembershipsQuery } from "@/organization/queries"
import { Route as homeRoute } from "@/routes/$slug/_layout"
import { Route as settingsRoute } from "@/routes/$slug/_layout/settings"
import { Button, buttonVariants } from "@/ui/components/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/ui/components/dropdown-menu"
import { Icons } from "@/ui/components/icons"
import { Logo } from "@/ui/components/logo"
import { UserAvatar } from "@/ui/components/user-avatar"
import { cn } from "@/ui/utils"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"

export function Sidebar() {
   const { user } = useUser()
   const navigate = useNavigate()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const { data: memberships } = useSuspenseQuery(
      organizationMembershipsQuery(),
   )

   const logoutFn = useServerFn(auth.logout)
   const logout = useMutation({
      mutationFn: () => logoutFn(),
      onSuccess: () => {
         navigate({ to: "/login" })
      },
   })

   const membership = memberships.find((m) => m.organization.slug === slug)

   return (
      <div className="h-svh w-60 max-md:hidden">
         <aside className="fixed flex h-full w-60 flex-col border-border/60 border-r p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
               <Logo className="size-8" />{" "}
               <p className="font-bold text-xl">
                  {membership?.organization.name}
               </p>
            </div>
            <Button
               variant={"outline"}
               className="mb-5 w-full font-semibold text-[0.95rem]"
            >
               <svg
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     opacity="0.28"
                     d="M3.12568 17.5726C3.08011 17.7497 3.07546 17.9381 3.06616 18.3151L3 20.9955L5.72665 20.9999C6.11608 21.0005 6.31079 21.0008 6.49406 20.9568C6.65654 20.9178 6.81188 20.8534 6.95435 20.7658C7.11505 20.6669 7.25274 20.5287 7.52811 20.2521L20.5014 7.22177C20.5329 7.19018 20.5486 7.17439 20.5622 7.16005C21.0616 6.63294 21.1427 5.83327 20.7594 5.21582C20.2699 4.42508 19.6065 3.75508 18.8267 3.25131C18.204 2.84896 17.3862 2.93708 16.8626 3.46297L3.8099 16.573C3.54444 16.8396 3.41171 16.973 3.31544 17.1282C3.23007 17.2658 3.16608 17.4156 3.12568 17.5726Z"
                     fill="currentColor"
                  />
                  <path
                     d="M12 21C16.018 17.7256 16.0891 24.3574 21 19M3 20.9955L5.72665 20.9999C6.11608 21.0005 6.31079 21.0008 6.49406 20.9568C6.65654 20.9178 6.81188 20.8534 6.95435 20.7658C7.11505 20.6669 7.25274 20.5287 7.52811 20.2521L20.5014 7.22177C21.0315 6.68941 21.1632 5.86631 20.7594 5.21582C20.2713 4.42948 19.6037 3.75331 18.8267 3.25131C18.204 2.84896 17.3862 2.93708 16.8626 3.46297L3.8099 16.573C3.54444 16.8396 3.41171 16.973 3.31544 17.1282C3.23007 17.2658 3.16608 17.4156 3.12568 17.5726C3.08011 17.7497 3.07546 17.9381 3.06616 18.3151L3 20.9955Z"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
               New issue
            </Button>
            <nav>
               <ul className="space-y-1">
                  <li>
                     <Link
                        params={{ slug }}
                        activeOptions={{ exact: true }}
                        activeProps={{
                           className:
                              "!border-border/75 bg-border/30 opacity-100",
                           "aria-current": "page",
                        }}
                        to={homeRoute.to}
                        className={cn(
                           "group flex h-10 items-center gap-2 rounded-xl border border-transparent px-2.5 font-semibold text-[0.95rem] opacity-75 transition-all hover:opacity-100",
                        )}
                     >
                        <Icons.issues className="size-6" />
                        Issues
                     </Link>
                  </li>
                  <li>
                     <Link
                        params={{ slug }}
                        activeProps={{
                           className:
                              "!border-border/75 bg-border/30 opacity-100",
                           "aria-current": "page",
                        }}
                        to={settingsRoute.to}
                        className={cn(
                           "group flex h-10 items-center gap-2 rounded-xl border border-transparent px-2.5 font-semibold text-[0.95rem] opacity-75 transition-all hover:opacity-100",
                        )}
                     >
                        <Icons.settings className="size-6" />
                        Settings
                     </Link>
                  </li>
               </ul>
            </nav>
            <div className="mt-auto">
               <DropdownMenu>
                  <DropdownMenuTrigger
                     className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "rounded-full",
                     )}
                  >
                     <UserAvatar
                        className="size-7"
                        user={user}
                     />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                     <DropdownMenuItem onSelect={() => logout.mutate()}>
                        <svg
                           viewBox="0 0 24 24"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              d="M9 2C5.13401 2 2 5.13401 2 9V15C2 18.866 5.13401 22 9 22C10.7922 22 12.4291 21.3252 13.6669 20.2173C14.0784 19.849 14.1135 19.2168 13.7451 18.8053C13.3768 18.3938 12.7446 18.3588 12.3331 18.7271C11.4478 19.5194 10.2812 20 9 20C6.23858 20 4 17.7614 4 15V9C4 6.23858 6.23858 4 9 4C10.2812 4 11.4478 4.48059 12.3331 5.27292C12.7446 5.64125 13.3768 5.60623 13.7451 5.1947C14.1135 4.78317 14.0784 4.15098 13.6669 3.78265C12.4291 2.67482 10.7922 2 9 2Z"
                              fill="currentColor"
                           />
                           <path
                              d="M11.8065 9.10001C11.8462 8.70512 11.6486 8.32412 11.303 8.12908C10.9573 7.93404 10.529 7.96187 10.2115 8.2C9.15874 8.98959 8.208 9.90559 7.38045 10.9269C7.12735 11.2392 7 11.6199 7 12C7 12.3801 7.12736 12.7608 7.38045 13.0731C8.208 14.0944 9.15874 15.0104 10.2115 15.8C10.529 16.0381 10.9573 16.066 11.303 15.8709C11.6486 15.6759 11.8462 15.2949 11.8065 14.9C11.7756 14.592 11.7413 14.2989 11.7081 14.0156C11.6672 13.6656 11.628 13.3304 11.5989 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H11.5989C11.628 10.6696 11.6672 10.3344 11.7081 9.98449C11.7413 9.70113 11.7756 9.40803 11.8065 9.10001Z"
                              fill="currentColor"
                           />
                        </svg>
                        Log out
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </aside>
      </div>
   )
}
