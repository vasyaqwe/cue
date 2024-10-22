import { issue } from "@/issue/schema"
import { organizationProtectedProcedure } from "@/lib/trpc"
import { createServerFn } from "@tanstack/start"
import { and, desc, eq, or, sql } from "drizzle-orm"
import { HTMLElement, parse as parseHTML } from "node-html-parser"
import { z } from "zod"

const parseEditorContent = (html: string) => {
   const root = parseHTML(html)
   let text = ""

   const processNode = (node: HTMLElement) => {
      // Text node
      if (node.nodeType === 3 && node.text.trim()) {
         text += `${node.text.trim()} `
         return
      }

      if (node.getAttribute("data-label")) {
         text += `@${node.getAttribute("data-label")} `
         return
      }

      if (node.tagName?.toLowerCase() === "img") return

      // Process all child nodes
      if (node.childNodes) {
         for (const child of node.childNodes) {
            if (child instanceof HTMLElement) {
               processNode(child)
            } else if (child.nodeType === 3 && child.text.trim()) {
               // Handle text nodes that might be direct children
               text += `${child.text.trim()} `
            }
         }
      }
   }

   processNode(root)
   return text.replace(/\s+/g, " ").trim()
}

export const list = createServerFn(
   "GET",
   organizationProtectedProcedure
      .input(z.object({ organizationId: z.string(), query: z.string() }))
      .query(async ({ ctx, input }) => {
         const searchTerms = input.query
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // Escape regex special chars

         const matchingIssues = await ctx.db
            .select({
               id: issue.id,
               title: issue.title,
               description: issue.description,
               status: issue.status,
               createdAt: issue.createdAt,
            })
            .from(issue)
            .where(
               and(
                  eq(issue.organizationId, input.organizationId),
                  or(
                     ...searchTerms.map(
                        (term) =>
                           sql`(
                      LOWER(${issue.title}) LIKE '%' || LOWER(${term}) || '%'
                      OR
                      LOWER(${issue.description}) LIKE '%' || LOWER(${term}) || '%'
                    )`,
                     ),
                  ),
               ),
            )
            .orderBy(desc(issue.createdAt))

         return matchingIssues.map((issue) => {
            let highlightedTitle = issue.title
            for (const term of searchTerms) {
               const regex = new RegExp(`(${term})`, "gi")
               highlightedTitle = highlightedTitle.replace(
                  regex,
                  '<span class="bg-highlight text-highlight-foreground font-semibold">$1</span>',
               )
            }

            const descriptionPreview = parseEditorContent(issue.description)
            let highlightedDescription = descriptionPreview
            for (const term of searchTerms) {
               const regex = new RegExp(`(${term})`, "gi")
               highlightedDescription = highlightedDescription.replace(
                  regex,
                  '<span class="bg-highlight text-highlight-foreground font-semibold">$1</span>',
               )
            }

            return {
               ...issue,
               highlightedTitle,
               description: descriptionPreview,
               highlightedDescription,
            }
         })
      }),
)
