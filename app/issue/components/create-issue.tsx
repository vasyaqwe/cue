import { useAuth } from "@/auth/hooks"
import { issueListQuery } from "@/issue/queries"
import { popModal } from "@/modals"
import { ResponsiveModalContent } from "@/modals/dynamic"
import { Button } from "@/ui/components/button"
import { DialogFooter, DialogHeader, DialogTitle } from "@/ui/components/dialog"
import { Input, inputVariants } from "@/ui/components/input"
import { Loading } from "@/ui/components/loading"
import { cn } from "@/ui/utils"
import { useLocalStorage } from "@/user-interactions/use-local-storage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { useRef } from "react"
import { toast } from "sonner"
import * as issue from "../functions"

export function CreateIssue() {
   const queryClient = useQueryClient()
   const { organizationId } = useAuth()
   const [title, setTitle] = useLocalStorage("create_issue_title", "")
   const [description, setDescription] = useLocalStorage(
      "create_issue_description",
      "",
   )
   const titleRef = useRef<HTMLInputElement>(null)

   const insertFn = useServerFn(issue.insert)
   const insert = useMutation({
      mutationFn: insertFn,
      onSuccess: () => {
         queryClient.invalidateQueries(issueListQuery({ organizationId }))
         popModal("create-issue")
         toast.success("Issue created", {
            action: {
               label: "View",
               onClick: () => {
                  toast.dismiss()
               },
            },
         })
      },
   })

   return (
      <ResponsiveModalContent
         onAnimationEndCapture={() => titleRef.current?.focus()}
      >
         <DialogHeader>
            <DialogTitle>New issue</DialogTitle>
         </DialogHeader>
         <form
            id="create-issue"
            onSubmit={(e) => {
               e.preventDefault()
               // const formData = Object.fromEntries(
               //    new FormData(e.target as HTMLFormElement),
               // )

               insert.mutate({
                  title,
                  description,
                  label: "bug",
                  status: "todo",
                  organizationId,
               })
            }}
            className="flex w-full flex-col p-4 pt-3"
         >
            <input
               ref={titleRef}
               autoComplete="off"
               name="title"
               id="title"
               placeholder="Issue title"
               required
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className={cn(
                  inputVariants(),
                  "!border-none !outline-none !bg-transparent h-8 p-0 font-bold text-xl",
               )}
            />
            <Input
               name="description"
               id="description"
               placeholder="Add description.."
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className={
                  "!border-none !outline-none !bg-transparent mt-1 h-8 p-0 text-[1rem]"
               }
            />
         </form>
         <DialogFooter className="justify-end">
            <Button
               type="submit"
               disabled={insert.isPending || insert.isSuccess}
               form="create-issue"
            >
               {insert.isPending || insert.isSuccess ? (
                  <>
                     <Loading />
                     Creating..
                  </>
               ) : (
                  "Create"
               )}
            </Button>
         </DialogFooter>
      </ResponsiveModalContent>
   )
}
