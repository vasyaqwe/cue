import "@/styles/app.css"
import appCss from "@/styles/app.css?url"
import { Toaster } from "@/ui/components/toast"
import { TooltipProvider } from "@/ui/components/tooltip"
import { cn } from "@/ui/utils"
import * as Portal from "@radix-ui/react-portal"
import type { QueryClient } from "@tanstack/react-query"
import {
   Outlet,
   ScrollRestoration,
   createRootRouteWithContext,
} from "@tanstack/react-router"
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start"
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
   meta: () => {
      const title = "Cue"
      const description = "Simple & minimal issue tracking."

      return [
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
         { name: "keywords", content: "Cue, Issue tracking, App" },
         { name: "twitter:title", content: title },
         { name: "twitter:description", content: description },
         { name: "twitter:creator", content: "@vasyaqwee" },
         { name: "twitter:site", content: "@vasyaqwee" },
         { name: "og:type", content: "website" },
         { name: "og:title", content: title },
         { name: "og:description", content: description },
         //  [
         //    { name: 'twitter:image', content: image },
         //    { name: 'twitter:card', content: 'summary_large_image' },
         //    { name: 'og:image', content: image },
         //  ]
      ]
   },
   links: () => [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      {
         rel: "preload",
         href: "/fonts/satoshi.woff2",
         as: "font",
         type: "font/woff2",
         crossOrigin: "anonymous",
      },
      {
         rel: "preload",
         href: "/fonts/serif_bold.otf",
         as: "font",
         type: "font/otf",
         crossOrigin: "anonymous",
      },
      // {
      //    rel: "apple-touch-icon",
      //    sizes: "180x180",
      //    href: "/apple-touch-icon.png",
      // },
      // {
      //    rel: "icon",
      //    type: "image/png",
      //    sizes: "32x32",
      //    href: "/favicon-32x32.png",
      // },
      // {
      //    rel: "icon",
      //    type: "image/png",
      //    sizes: "16x16",
      //    href: "/favicon-16x16.png",
      // },
   ],
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
      <Html>
         <Head>
            <Meta />
         </Head>
         <Body suppressHydrationWarning>
            <div
               className={cn(
                  "flex h-full flex-1 flex-col bg-background text-foreground tracking-[0.02em] antialiased",
               )}
            >
               <TooltipProvider delayDuration={400}>
                  {children}
                  <Portal.Root>
                     <Toaster />
                  </Portal.Root>
               </TooltipProvider>
            </div>
            <BreakpointIndicator />
            <ScrollRestoration />
            {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
            {/* <TanStackRouterDevtools position="bottom-right" /> */}
            <Scripts />
         </Body>
      </Html>
   )
}

function BreakpointIndicator() {
   if (!import.meta.env.DEV) return null

   return (
      <div
         className={`fixed bottom-4 left-16 z-50 font-mono font-semibold text-lg`}
      >
         <div className="rounded-full border border-border bg-background px-3 pt-1 pb-1.5 leading-none">
            <span className="sm:hidden">xs</span>
            <span className="hidden sm:inline md:hidden">sm</span>
            <span className="hidden md:inline lg:hidden">md</span>
            <span className="hidden lg:inline xl:hidden">lg</span>
            <span className="hidden xl:inline 2xl:hidden">xl</span>
            <span className="hidden 2xl:inline">2xl</span>
         </div>
      </div>
   )
}
