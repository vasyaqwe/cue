import { Route as homeRoute } from "@/routes/$slug/_layout"
import { Button } from "@/ui/components/button"
import { Logo } from "@/ui/components/logo"
import { cn } from "@/ui/utils"
import { Link, useLocation, useParams, useRouter } from "@tanstack/react-router"
import type { ComponentProps } from "react"

export function Header({
   className,
   children,
   ...props
}: ComponentProps<"header">) {
   const router = useRouter()
   const { pathname } = useLocation()
   const { slug } = useParams({ from: "/$slug/_layout" })

   return (
      <header
         className={cn("h-[var(--header-height)]", className)}
         {...props}
      >
         <div
            className={cn(
               "fixed top-0 z-[11] flex h-[var(--header-height)] w-full items-center border-border/60 border-b bg-background shadow-sm md:pl-[17px]",
            )}
         >
            <div
               style={{
                  gridTemplateColumns: "34px 1fr 34px",
               }}
               className="container grid items-center md:flex"
            >
               <div className="md:hidden">
                  {pathname === `/${slug}` ? (
                     <Link
                        params={{ slug }}
                        to={homeRoute.to}
                        aria-label="Home"
                        className="flex shrink-0 select-none items-center gap-2 font-bold text-2xl"
                     >
                        <Logo className="size-8" />
                     </Link>
                  ) : (
                     <Button
                        onClick={() => router.history.back()}
                        variant={"ghost"}
                        size="icon"
                        className="-ml-0.5 text-foreground/80"
                        aria-label="Go back"
                     >
                        <svg
                           width="24"
                           height="24"
                           viewBox="0 0 24 24"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              d="M9.8304 6C7.727 7.55556 5.83783 9.37278 4.20952 11.4057C4.06984 11.5801 4 11.79 4 12M9.8304 18C7.727 16.4444 5.83783 14.6272 4.20952 12.5943C4.06984 12.4199 4 12.21 4 12M4 12H20"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                           />
                        </svg>
                     </Button>
                  )}
               </div>
               {children}
            </div>
         </div>
      </header>
   )
}

export function HeaderTitle({ className, ...props }: ComponentProps<"h1">) {
   return (
      <h1
         className={cn(
            "text-nowrap text-center font-bold text-lg md:text-[1.05rem]",
            className,
         )}
         {...props}
      />
   )
}
