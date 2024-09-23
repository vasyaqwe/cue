import { env } from "@/env"
import { organizationMembershipsQuery } from "@/organization/queries"
import { Button } from "@/ui/components/button"
import { Input } from "@/ui/components/input"
import { Label } from "@/ui/components/label"
import { Loading } from "@/ui/components/loading"
import { Logo } from "@/ui/components/logo"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import type { TRPCError } from "@trpc/server"
import { useState } from "react"
import { toast } from "sonner"
import * as organization from "../functions"

const makeSlug = (name: string) => name.toLowerCase().replaceAll(" ", "-")

const parseError = (error: Error) => {
   try {
      const parsedError = JSON.parse(error.message) as {
         body: TRPCError
      }

      return parsedError
   } catch (jsonError) {
      console.error("Failed to parse error message as JSON:", jsonError)
   }
}

export function CreateOrganization() {
   const [name, setName] = useState("")
   const navigate = useNavigate()
   const queryClient = useQueryClient()

   const insertFn = useServerFn(organization.insert)
   const insert = useMutation({
      mutationFn: () => insertFn({ name, slug: makeSlug(name) }),
      onSuccess: () => {
         queryClient.invalidateQueries(organizationMembershipsQuery())
         navigate({ to: `/${makeSlug(name)}` })
      },
      onError: (error) => {
         const parsedError = parseError(error)
         if (parsedError?.body?.code === "CONFLICT")
            return toast.error("Organization URL is not available")

         toast.error("An unknown error occurred")
      },
   })

   return (
      <div className="grid h-svh place-items-center">
         <div className="mx-auto w-full max-w-[22rem]">
            <div className="flex items-center gap-2.5">
               <Logo className="size-11" />{" "}
               <h1 className="font-extrabold text-2xl">Welcome to Cue,</h1>
            </div>
            <h2 className="my-5 font-bold text-foreground/90 text-xl">
               Create your first organization
            </h2>
            <form
               onSubmit={(e) => {
                  e.preventDefault()
                  insert.mutate()
               }}
               className="w-full"
            >
               <Label htmlFor="name">Name</Label>
               <Input
                  autoComplete="off"
                  autoFocus
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Required"
                  required
               />
               <p className="mt-2 break-all text-foreground/75">
                  <u>
                     {env.VITE_BASE_URL}/{makeSlug(name)}
                  </u>
               </p>
               <Button
                  size={"lg"}
                  className="mt-5 w-full"
                  disabled={insert.isPending || insert.isSuccess}
               >
                  {insert.isPending || insert.isSuccess ? (
                     <Loading />
                  ) : (
                     "Create"
                  )}
               </Button>
            </form>
         </div>
      </div>
   )
}
