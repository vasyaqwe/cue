import { useAuth } from "@/auth/hooks"
import { issueListQuery } from "@/issue/queries"
import { popModal } from "@/modals"
import { ResponsiveModalContent } from "@/modals/dynamic"
import { Button } from "@/ui/components/button"
import { DialogHeader, DialogTitle } from "@/ui/components/dialog"
import { Input } from "@/ui/components/input"
import { Loading } from "@/ui/components/loading"
import { useLocalStorage } from "@/user-interactions/use-local-storage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
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
      <ResponsiveModalContent>
         <DialogHeader>
            <DialogTitle>New issue</DialogTitle>
         </DialogHeader>
         <div className="p-4 pt-3">
            <form
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
               className="flex w-full flex-col"
            >
               <Input
                  autoFocus
                  name="title"
                  id="title"
                  placeholder="Issue title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={
                     "!border-none !outline-none !bg-transparent h-8 p-0 font-bold text-xl"
                  }
               />
               <Input
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={
                     "!border-none !outline-none !bg-transparent mt-1 h-8 p-0"
                  }
               />

               <div className="mt-5 flex items-center justify-end">
                  <Button disabled={insert.isPending || insert.isSuccess}>
                     {insert.isPending || insert.isSuccess ? (
                        <>
                           <Loading />
                           Creating..
                        </>
                     ) : (
                        "Create"
                     )}
                  </Button>
               </div>
            </form>
         </div>
      </ResponsiveModalContent>
   )
}
