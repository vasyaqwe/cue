import { comment } from "@/comment/schema"
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
            .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))

         const [matchingIssues, issuesWithMatchingComments] = await Promise.all(
            [
               await ctx.db
                  .select({
                     id: issue.id,
                     title: issue.title,
                     content: issue.description, // renamed to content for consistency
                     status: issue.status,
                     createdAt: issue.createdAt,
                     isComment: sql`0`.as("isComment"), // to distinguish from comments
                     commentId: sql`NULL`.as("commentId"),
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
                  .orderBy(desc(issue.createdAt)),
               await ctx.db
                  .select({
                     id: issue.id,
                     title: issue.title,
                     content: comment.content, // use comment content instead of description
                     status: issue.status,
                     createdAt: issue.createdAt,
                     isComment: sql`1`.as("isComment"),
                     commentId: comment.id,
                  })
                  .from(comment)
                  .innerJoin(issue, eq(comment.issueId, issue.id))
                  .where(
                     and(
                        eq(issue.organizationId, input.organizationId),
                        or(
                           ...searchTerms.map(
                              (term) =>
                                 sql`LOWER(${comment.content}) LIKE '%' || LOWER(${term}) || '%'`,
                           ),
                        ),
                     ),
                  )
                  .orderBy(desc(comment.createdAt)),
            ],
         )

         // Remove duplicates (keep comment match if exists)
         const uniqueResults = [
            ...matchingIssues,
            ...issuesWithMatchingComments,
         ]
            .sort((a, b) => b.createdAt - a.createdAt)
            .reduce(
               (acc, current) => {
                  const existingIndex = acc.findIndex(
                     (item) => item.id === current.id,
                  )
                  if (existingIndex === -1) {
                     acc.push(current)
                  } else if (
                     current.isComment &&
                     !acc[existingIndex]?.isComment
                  ) {
                     // Replace issue match with comment match if we have both
                     acc[existingIndex] = current
                  }
                  return acc
               },
               [] as typeof matchingIssues,
            )

         return uniqueResults.map((result) => {
            let highlightedTitle = result.title
            for (const term of searchTerms) {
               const regex = new RegExp(`(${term})`, "gi")
               highlightedTitle = highlightedTitle.replace(
                  regex,
                  '<span class="bg-highlight text-highlight-foreground font-semibold">$1</span>',
               )
            }

            const contentPreview = parseEditorContent(result.content)
            let highlightedContent = contentPreview
            for (const term of searchTerms) {
               const regex = new RegExp(`(${term})`, "gi")
               highlightedContent = highlightedContent.replace(
                  regex,
                  '<span class="bg-highlight text-highlight-foreground font-semibold">$1</span>',
               )
            }

            return {
               ...result,
               highlightedTitle,
               content: contentPreview,
               highlightedContent,
               matchSource: result.isComment ? "comment" : "issue",
               commentId: result.commentId as string | null,
            }
         })
      }),
)
