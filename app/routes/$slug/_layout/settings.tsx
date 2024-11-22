import {
   Modal,
   ModalContent,
   ModalDescription,
   ModalFooter,
   ModalHeader,
   ModalTitle,
   ModalTrigger,
} from "@/modals/dynamic"
import * as organization from "@/organization/functions"
import { organizationMembershipsQuery } from "@/organization/queries"
import {
   Header,
   HeaderBackButton,
   HeaderProfileDrawer,
   HeaderTitle,
} from "@/routes/$slug/-components/header"
import { Main } from "@/routes/$slug/-components/main"
import { Button, buttonVariants } from "@/ui/components/button"
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/ui/components/card"
import { Icons } from "@/ui/components/icons"
import { Input } from "@/ui/components/input"
import { Label } from "@/ui/components/label"
import { Loading } from "@/ui/components/loading"
import { useUIStore } from "@/ui/store"
import { cn } from "@/ui/utils"
import * as userFns from "@/user/functions"
import { useAuth } from "@/user/hooks"
import { userMeQuery } from "@/user/queries"
import {
   useMutation,
   useQueryClient,
   useSuspenseQuery,
} from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { useState } from "react"
import { toast } from "sonner"
import { match } from "ts-pattern"

export const Route = createFileRoute("/$slug/_layout/settings")({
   component: Component,
   head: () => ({
      meta: [{ title: "Settings" }],
   }),
})

function Component() {
   const queryClient = useQueryClient()
   const { user, organizationId } = useAuth()
   const isMobile = useUIStore().isMobile
   const navigate = useNavigate()

   const updateFn = useServerFn(userFns.update)
   const updateUser = useMutation({
      mutationFn: updateFn,
      onSettled: () => {
         queryClient.invalidateQueries(userMeQuery())
      },
      onSuccess: () => {
         toast.success("Saved")
      },
   })

   const memberships = useSuspenseQuery(organizationMembershipsQuery())
   const [confirmDeletion, setConfirmDeletion] = useState("")
   const deleteFn = useServerFn(organization.deleteFn)
   const deleteOrganization = useMutation({
      mutationFn: deleteFn,
      onSuccess: () => {
         queryClient.invalidateQueries(organizationMembershipsQuery())
         toast.success("Organization deleted")
         const existingMemberships = memberships.data?.filter(
            (m) => m.organizationId !== organizationId,
         )

         match(existingMemberships?.[0]?.organization)
            .with(undefined, () =>
               navigate({
                  to: "/new",
               }),
            )
            .otherwise(({ slug }) =>
               navigate({
                  to: "/$slug",
                  params: { slug },
               }),
            )
      },
   })

   return (
      <Main>
         <Header>
            <HeaderBackButton />
            <HeaderTitle>Settings</HeaderTitle>
            <HeaderProfileDrawer />
         </Header>
         <main className="overflow-y-auto py-5 pb-safe-4 md:py-8">
            <div className="mx-auto max-w-4xl px-4">
               <Card variant={"secondary"}>
                  <CardHeader>
                     <CardTitle>Your profile</CardTitle>
                     <CardDescription>
                        Manage your profile and how you appear to others.
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <form
                        onSubmit={(e) => {
                           e.preventDefault()

                           const formData = Object.fromEntries(
                              new FormData(
                                 e.target as HTMLFormElement,
                              ).entries(),
                           ) as {
                              name: string
                           }

                           if (
                              !formData.name ||
                              formData.name.trim().length < 1
                           )
                              return toast.error("Name is required")

                           if (formData.name === user.name)
                              return toast.success("Saved")

                           updateUser.mutate({
                              data: { name: formData.name },
                           })
                        }}
                     >
                        <Label htmlFor="name">Name</Label>
                        <Input
                           defaultValue={user.name ?? ""}
                           name="name"
                           id="name"
                           className="max-w-[300px]"
                           placeholder="Your name"
                           maxLength={32}
                           required
                        />
                        <Button
                           disabled={updateUser.isPending}
                           className="mt-3"
                        >
                           Save
                        </Button>
                     </form>
                  </CardContent>
               </Card>
               <Card
                  className="mt-5"
                  variant={"secondary"}
               >
                  <CardHeader>
                     <CardTitle>Danger zone</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between gap-4 max-lg:flex-col lg:items-center">
                     <div className="flex items-center gap-3">
                        <div className="grid size-10 shrink-0 place-content-center rounded-full border border-destructive/10 bg-destructive/15">
                           <Icons.trash className="size-5 text-destructive" />
                        </div>
                        <div>
                           <p>Delete organization</p>
                           <p className="text-foreground/75 text-sm">
                              This is permanent. Organization will be fully
                              deleted.
                           </p>
                        </div>
                     </div>
                     <Modal>
                        <ModalTrigger
                           className={cn(
                              buttonVariants({
                                 variant: "destructive",
                              }),
                              "max-lg:w-full",
                           )}
                        >
                           Delete organization
                        </ModalTrigger>
                        <ModalContent variant={"alert"}>
                           <ModalHeader>
                              <ModalTitle>Delete this organization?</ModalTitle>
                              <ModalDescription>
                                 This action cannot be undone. Your organization
                                 and all of its data will be fully deleted.
                              </ModalDescription>
                           </ModalHeader>
                           <div className="p-4">
                              <form
                                 onSubmit={(e) => {
                                    e.preventDefault()
                                    deleteOrganization.mutate({
                                       data: { organizationId },
                                    })
                                 }}
                                 id={"delete_organization"}
                              >
                                 <Label htmlFor="confirmation">
                                    To confirm, enter{" "}
                                    <strong>delete this organization</strong>{" "}
                                    below
                                 </Label>
                                 <Input
                                    autoComplete="off"
                                    autoFocus={!isMobile}
                                    id="confirmation"
                                    name="confirmation"
                                    placeholder="delete this organization"
                                    value={confirmDeletion}
                                    onChange={(e) =>
                                       setConfirmDeletion(e.target.value)
                                    }
                                 />
                              </form>
                           </div>
                           <ModalFooter>
                              <Button
                                 className="ml-auto"
                                 form={"delete_organization"}
                                 type="submit"
                                 disabled={
                                    confirmDeletion.trim() !==
                                       "delete this organization" ||
                                    deleteOrganization.isPending ||
                                    deleteOrganization.isSuccess
                                 }
                                 variant={"destructive"}
                              >
                                 {deleteOrganization.isPending ||
                                 deleteOrganization.isSuccess ? (
                                    <>
                                       <Loading />
                                       Deleting..
                                    </>
                                 ) : (
                                    "Delete forever"
                                 )}
                              </Button>
                           </ModalFooter>
                        </ModalContent>
                     </Modal>
                  </CardContent>
               </Card>
            </div>
         </main>
      </Main>
   )
}
