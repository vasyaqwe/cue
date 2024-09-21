import "@/styles/app.css"
// @ts-expect-error
import appCss from "@/styles/app.css?url"
import { Toaster } from "@/ui/components/toast"
import { cn } from "@/ui/utils"
import * as Portal from "@radix-ui/react-portal"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
   Outlet,
   ScrollRestoration,
   createRootRouteWithContext,
} from "@tanstack/react-router"
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start"
import { lazy } from "react"

const TanStackRouterDevtools = import.meta.env.PROD
   ? () => null
   : lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
           default: res.TanStackRouterDevtools,
           // For Embedded Mode
           // default: res.TanStackRouterDevtoolsPanel
        })),
     )

const title = "Cue"

export const Route = createRootRouteWithContext<{
   queryClient: QueryClient
}>()({
   meta: () => [
      {
         charSet: "utf-8",
      },
      {
         name: "viewport",
         content: "width=device-width, initial-scale=1",
      },
      { title },
      //  { name: 'description', content: description },
      //  { name: 'keywords', content: keywords },
      //  { name: 'twitter:title', content: title },
      //  { name: 'twitter:description', content: description },
      //  { name: 'twitter:creator', content: '@vasyaqwee' },
      //  { name: 'twitter:site', content: '@vasyaqwee' },
      //  { name: 'og:type', content: 'website' },
      //  { name: 'og:title', content: title },
      //  { name: 'og:description', content: description },
      //  [
      //    { name: 'twitter:image', content: image },
      //    { name: 'twitter:card', content: 'summary_large_image' },
      //    { name: 'og:image', content: image },
      //  ]
   ],
   links: () => [
      { rel: "stylesheet", href: appCss },
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
      // { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      // { rel: "icon", href: "/favicon.ico" },
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
         <Body
            className={cn("min-h-screen bg-background font-sans antialiased")}
            suppressHydrationWarning
         >
            {children}
            <Portal.Root>
               <Toaster />
            </Portal.Root>
            <ScrollRestoration />
            <ReactQueryDevtools buttonPosition="bottom-left" />
            <TanStackRouterDevtools position="bottom-right" />
            <Scripts />
         </Body>
      </Html>
   )
}
