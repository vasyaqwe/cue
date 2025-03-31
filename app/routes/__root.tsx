import "@/ui/styles.css"
import ogImage from "@/assets/og.png"
import { Toaster } from "@/ui/components/toast"
import { TooltipProvider } from "@/ui/components/tooltip"
import styles from "@/ui/styles.css?url"
import { cn } from "@/ui/utils"
import * as Portal from "@radix-ui/react-portal"
import type { QueryClient } from "@tanstack/react-query"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
   Outlet,
   ScrollRestoration,
   createRootRouteWithContext,
} from "@tanstack/react-router"
import { Meta, Scripts } from "@tanstack/start"
import { lazy } from "react"

const _TanStackRouterDevtools = import.meta.env.PROD
   ? () => null
   : lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
           default: res.TanStackRouterDevtools,
           // For Embedded Mode
           // default: res.TanStackRouterDevtoolsPanel
        })),
     )

export const Route = createRootRouteWithContext<{
   queryClient: QueryClient
}>()({
   head: () => {
      const title = "Cue"
      const description = "Simple & minimal issue tracking."

      return {
         meta: [
            {
               charSet: "utf-8",
            },
            {
               name: "viewport",
               content:
                  "viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
            },
            { name: "theme-color", content: "#fefcfb" },
            { title },
            {
               name: "description",
               content: description,
            },
            { name: "twitter:title", content: title },
            { name: "twitter:description", content: description },
            { name: "twitter:creator", content: "@vasyaqwee" },
            { name: "twitter:site", content: "@vasyaqwee" },
            { name: "og:type", content: "website" },
            { name: "og:title", content: title },
            { name: "og:description", content: description },
            { name: "og:image", content: `https://cue.vasyaqwe.com${ogImage}` },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:creator", content: "@vasyaqwee" },
            { name: "twitter:site", content: "@vasyaqwee" },
         ],
         links: [
            { rel: "stylesheet", href: styles },
            { rel: "icon", href: "/favicon.ico" },
            { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
            { rel: "manifest", href: "/site.webmanifest" },
            {
               rel: "preload",
               href: "/font/satoshi.woff2",
               as: "font",
               type: "font/woff2",
               crossOrigin: "anonymous",
            },
            {
               rel: "preload",
               href: "/font/garamond_italic.ttf",
               as: "font",
               type: "font/ttf",
               crossOrigin: "anonymous",
            },
            {
               rel: "preload",
               href: "/font/garamond.ttf",
               as: "font",
               type: "font/ttf",
               crossOrigin: "anonymous",
            },
         ],
      }
   },
   component: RootComponent,
})

function RootComponent() {
   return (
      <RootDocument>
         <Outlet />
      </RootDocument>
   )
}

function RootDocument({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en">
         <head>
            <Meta />
         </head>
         <body suppressHydrationWarning>
            <div
               className={cn(
                  "bg-background text-foreground tracking-[0.02em] antialiased md:flex selection:bg-primary selection:text-background",
               )}
            >
               <TooltipProvider delayDuration={400}>
                  {children}
                  <Portal.Root>
                     <Toaster />
                  </Portal.Root>
               </TooltipProvider>
            </div>
            <ScrollRestoration />
            {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
            {/* <TanStackRouterDevtools position="bottom-right" /> */}
            <Scripts />
         </body>
      </html>
   )
}
