import { Route as homeRoute } from "@/routes/$slug/_layout"
import { Button } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { Logo } from "@/ui/components/logo"
import { cn } from "@/ui/utils"
import { Link, useLocation, useParams, useRouter } from "@tanstack/react-router"
import type { ComponentProps } from "react"

export function Header({
   className,
   children,
   ...props
}: ComponentProps<"div">) {
   const router = useRouter()
   const { pathname } = useLocation()
   const { slug } = useParams({ from: "/$slug/_layout" })

   return (
      <header className={cn("h-[var(--header-height)]")}>
         <div
            className={cn(
               "fixed top-0 z-[2] flex h-[var(--header-height)] w-full items-center border-border/75 border-b bg-background shadow-sm md:pl-[17px]",

               className,
            )}
            {...props}
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
                        <Icons.arrowLeft />
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
         className={cn("text-nowrap text-center font-bold text-lg", className)}
         {...props}
      />
   )
}
