import * as userFns from "@/auth/functions"
import { useAuth } from "@/auth/hooks"
import { meQuery } from "@/auth/queries"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Button } from "@/ui/components/button"
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/ui/components/card"
import { Input } from "@/ui/components/input"
import { Label } from "@/ui/components/label"
import { Main } from "@/ui/components/main"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export const Route = createFileRoute("/$slug/_layout/settings")({
   component: Component,
   meta: () => [{ title: "Settings" }],
})

function Component() {
   const queryClient = useQueryClient()
   const { user } = useAuth()

   const updateFn = useServerFn(userFns.update)
   const updateUser = useMutation({
      mutationFn: updateFn,
      onSettled: () => {
         queryClient.invalidateQueries(meQuery())
      },
      onSuccess: () => {
         toast.success("Saved")
      },
   })

   return (
      <>
         <Header>
            <HeaderTitle>Settings</HeaderTitle>
         </Header>
         <Main className="mx-auto mt-5 max-w-5xl md:mt-8">
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
                           new FormData(e.target as HTMLFormElement).entries(),
                        ) as {
                           name: string
                        }

                        if (!formData.name || formData.name.trim().length < 1)
                           return toast.error("Name is required")

                        if (formData.name === user.name)
                           return toast.success("Saved")

                        updateUser.mutate({
                           name: formData.name,
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
               <CardContent>Delete organization</CardContent>
            </Card>
         </Main>
      </>
   )
}
