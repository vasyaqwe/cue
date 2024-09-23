import { issueListQuery } from "@/issue/queries"
import { popModal } from "@/modals"
import { ResponsiveModalContent } from "@/modals/dynamic"
import { useOrganization } from "@/organization/hooks"
import { Button } from "@/ui/components/button"
import { DialogHeader, DialogTitle } from "@/ui/components/dialog"
import { Input } from "@/ui/components/input"
import { Loading } from "@/ui/components/loading"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"
import * as issue from "../functions"

export function CreateIssue() {
   const queryClient = useQueryClient()
   const { organization } = useOrganization()

   const insertFn = useServerFn(issue.insert)
   const insert = useMutation({
      mutationFn: insertFn,
      onSuccess: () => {
         queryClient.invalidateQueries(
            issueListQuery({ organizationId: organization.id }),
         )
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
         <div className="p-4">
            <form
               onSubmit={(e) => {
                  e.preventDefault()
                  const formData = Object.fromEntries(
                     new FormData(e.target as HTMLFormElement),
                  )

                  insert.mutate({
                     label: "bug",
                     organizationId: organization.id,
                     status: "todo",
                     title: formData.title as string,
                  })
               }}
               className="flex w-full flex-col"
            >
               <Input
                  autoComplete="off"
                  autoFocus
                  name="title"
                  id="title"
                  placeholder="Issue title"
                  required
                  className={
                     "!border-none !outline-none !bg-transparent h-8 p-0 font-bold text-xl"
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
