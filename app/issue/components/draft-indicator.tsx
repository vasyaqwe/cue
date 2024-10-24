import { useLocalStorage } from "@/interactions/use-local-storage"
import { useOnPushModal } from "@/modals"
import { useIsClient } from "@/ui/hooks/use-is-client"
import { useParams } from "@tanstack/react-router"
import { useState } from "react"
import { match } from "ts-pattern"

export function DraftIndicator() {
   const { slug } = useParams({ from: "/$slug/_layout" })
   const [issueTitle] = useLocalStorage(`create_issue_title_${slug}`, "")
   const [issueDescription] = useLocalStorage(
      `create_issue_description_${slug}`,
      "",
   )
   const [createIssueOpen, setCreateIssueOpen] = useState(false)
   useOnPushModal("create_issue", (open) => {
      match(open)
         .with(true, () => setCreateIssueOpen(true))
         .otherwise(() =>
            // delay due to dialog animation
            setTimeout(() => {
               setCreateIssueOpen(false)
            }, 100),
         )
   })

   const { isClient } = useIsClient()

   if (!isClient) return null

   const descriptionEmpty = !issueDescription || issueDescription === "<p></p>"

   return (
      <span
         data-visible={
            createIssueOpen
               ? false
               : !!((issueTitle && issueTitle.length > 0) || !descriptionEmpty)
         }
         className="md:-translate-y-1/2 -right-px absolute top-0 block size-3 rounded-full border-[2.5px] border-background bg-primary opacity-0 transition-opacity md:top-1/2 md:right-2 md:size-[11px] max-md:border-[2.5px] md:border-2 data-[visible=true]:opacity-100"
      />
   )
}
