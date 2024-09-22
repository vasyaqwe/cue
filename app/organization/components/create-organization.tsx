import { Button } from "@/ui/components/button"
import { Input } from "@/ui/components/input"
import { Label } from "@/ui/components/label"
import { Logo } from "@/ui/components/logo"
import { useState } from "react"

const makeSlug = (name: string) => name.toLowerCase().replaceAll(" ", "-")

export function CreateOrganization() {
   const [name, setName] = useState("")

   return (
      <div className="grid h-svh place-content-center">
         <div className="mx-auto w-full max-w-2xl ">
            <div className="flex items-center gap-2.5">
               <Logo className="size-11" />{" "}
               <h1 className="text-2xl">Welcome to Cue,</h1>
            </div>
            <h2 className="my-5 font-bold text-foreground/90 text-xl">
               Create your first organization
            </h2>
            <form
               onSubmit={(e) => {
                  e.preventDefault()
               }}
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
               <p className="mt-2 text-foreground/75">
                  {" "}
                  {window.location.origin}/{makeSlug(name)}
               </p>
               <Button
                  size={"lg"}
                  className="mt-5 w-full"
               >
                  Create
               </Button>
            </form>
         </div>
      </div>
   )
}
