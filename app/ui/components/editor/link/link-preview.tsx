import { ServerFnError } from "@/error"
import { cardVariants } from "@/ui/components/card"
import { Loading } from "@/ui/components/loading"
import { cn } from "@/ui/utils"
import { authMiddleware } from "@/user/middleware"
import { useQuery } from "@tanstack/react-query"
import { createServerFn, useServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import type { NodeViewProps } from "@tiptap/core"
import { NodeViewWrapper } from "@tiptap/react"
import ogs from "open-graph-scraper"
import { z } from "zod"

export const getMetadata = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .validator(zodValidator(z.object({ url: z.string() })))
   .handler(async ({ data }) => {
      const res = await ogs({ url: data.url })
      if (res.error) throw new ServerFnError({ code: "BAD_REQUEST" })

      return {
         favicon: res.result.favicon,
         ogImage: res.result.ogImage,
         title: res.result.ogTitle,
         description: res.result.ogDescription,
      }
   })

export function LinkPreview({ node }: NodeViewProps) {
   const { href, className } = node.attrs
   const domain = href ? new URL(href).hostname : ""

   const getMetadataQuery = useServerFn(getMetadata)
   const metadata = useQuery({
      queryKey: ["metadata", href],
      queryFn: () => getMetadataQuery({ data: { url: href } }),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
      staleTime: Infinity,
      retryOnMount: false,
   })

   if (!href) return null

   return (
      <NodeViewWrapper
         data-link-preview-wrapper
         className={cn("group relative", className)}
      >
         <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
               cardVariants({ variant: "secondary" }),
               "my-3 flex items-center justify-between overflow-hidden p-0 no-underline",
               metadata.isError ? " h-[40px]" : "h-[70px]",
            )}
         >
            {metadata.isPending ? (
               <Loading className="ml-4" />
            ) : metadata.isError ? (
               <div className="flex flex-col gap-1 p-3">
                  <p className="!m-0 !text-foreground/70 line-clamp-1 break-all">
                     {href}
                  </p>
               </div>
            ) : (
               <>
                  <div className="flex flex-col gap-1 p-3">
                     <p className="!m-0 line-clamp-1 break-all font-medium text-lg">
                        {metadata.data.title}
                     </p>
                     <p className="!m-0 !text-foreground/70 line-clamp-1 break-all">
                        {domain}
                     </p>
                  </div>

                  {metadata.data?.ogImage?.[0]?.url ? (
                     <img
                        src={metadata.data.ogImage[0].url}
                        alt=""
                        className="!m-0 h-full border-border border-l object-cover"
                     />
                  ) : metadata.data?.favicon ? (
                     <img
                        src={
                           metadata.data.favicon.startsWith("https://")
                              ? metadata.data.favicon
                              : `https://${domain}${metadata.data?.favicon}`
                        }
                        alt=""
                        className="!m-4 size-9"
                     />
                  ) : null}
               </>
            )}
         </a>

         {/* <div className="absolute top-2 right-2">
         <button>
         
         </button>
         </div> */}
      </NodeViewWrapper>
   )
}
