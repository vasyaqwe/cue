import { useLocalStorage } from "@/interactions/use-local-storage"
import { useOnPushModal } from "@/modals"
import { useEffect, useState } from "react"

export function DraftIndicator() {
   const [issueTitle] = useLocalStorage("create_issue_title", "")
   const [issueDescription] = useLocalStorage("create_issue_description", "")
   const [createIssueOpen, setCreateIssueOpen] = useState(false)
   useOnPushModal("create_issue", (open) => setCreateIssueOpen(open))

   const [isMounted, setIsMounted] = useState(false)
   useEffect(() => {
      setIsMounted(true)
   }, [])

   if (!isMounted) return null

   const descriptionEmpty = !issueDescription || issueDescription === "<p></p>"

   return (
      <span
         data-visible={
            createIssueOpen
               ? false
               : !!((issueTitle && issueTitle.length > 0) || !descriptionEmpty)
         }
         className="md:-translate-y-1/2 -right-3 -top-1 absolute block size-3 rounded-full border-[2.5px] border-background bg-primary opacity-0 transition-opacity md:top-1/2 md:right-2 md:size-[11px] md:border-2 data-[visible=true]:opacity-100"
      />
   )
}
