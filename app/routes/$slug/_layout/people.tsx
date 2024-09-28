import { useAuth } from "@/auth/hooks"
import { env } from "@/env"
import {
   ModalContent,
   ModalTitle,
   ModalTrigger,
   ModalWrapper,
} from "@/modals/dynamic"
import { organizationMembersQuery } from "@/organization/queries"
import { Header, HeaderTitle } from "@/routes/$slug/-components/header"
import { Button, buttonVariants } from "@/ui/components/button"
import { DialogHeader } from "@/ui/components/dialog"
import { Icons } from "@/ui/components/icons"
import { inputVariants } from "@/ui/components/input"
import { Loading } from "@/ui/components/loading"
import { Main } from "@/ui/components/main"
import { UserAvatar } from "@/ui/components/user-avatar"
import { cn } from "@/ui/utils"
import { useCopyToClipboard } from "@/user-interactions/use-copy-to-clipboard"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useRef } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/$slug/_layout/people")({
   component: Component,
   meta: () => [{ title: "People" }],
   loader: async ({ context }) => {
      context.queryClient.prefetchQuery(
         organizationMembersQuery({ organizationId: context.organizationId }),
      )
   },
   pendingComponent: () => (
      <>
         <Header>
            <HeaderTitle>Issues</HeaderTitle>
         </Header>
         <Main>
            <Loading className="absolute inset-0 m-auto" />
         </Main>
      </>
   ),
})

function Component() {
   const { organization, organizationId } = useAuth()
   const { data: members } = useSuspenseQuery(
      organizationMembersQuery({ organizationId }),
   )
   const inputRef = useRef<HTMLInputElement>(null)
   const { isSuccess, copy } = useCopyToClipboard()

   const joinLink = `${env.VITE_BASE_URL}/join/${organization.inviteCode}`

   const copyLink = () => {
      copy(joinLink)
      toast.success("Link copied to clipboard")
      setTimeout(() => {
         inputRef.current?.focus()
      }, 1)
   }

   return (
      <>
         <Header>
            <HeaderTitle>People</HeaderTitle>
         </Header>
         <Main>
            {members.length === 0 ? (
               <p className="absolute inset-0 m-auto size-fit">No members</p>
            ) : (
               <div className="mx-auto mt-5 flex max-w-3xl flex-col md:mt-8">
                  <ModalWrapper>
                     <ModalTrigger
                        className={cn(
                           buttonVariants({ variant: "secondary" }),
                           "mx-auto",
                        )}
                     >
                        Invite your team
                     </ModalTrigger>
                     <ModalContent>
                        <DialogHeader>
                           <ModalTitle>Invite your team</ModalTitle>
                        </DialogHeader>
                        <div className="p-4">
                           <p>
                              Anyone with this link can join your organization.
                           </p>

                           <div className="relative mt-4 flex items-center gap-1.5">
                              <input
                                 readOnly
                                 ref={inputRef}
                                 onClick={copyLink}
                                 value={joinLink}
                                 className={cn(inputVariants(), "truncate")}
                                 onFocus={(e) => e.target.select()}
                              />
                              <Button
                                 aria-label="Copy link"
                                 variant={"ghost"}
                                 size={"icon"}
                                 className="!size-10 shrink-0"
                                 onClick={copyLink}
                              >
                                 {isSuccess ? (
                                    <Icons.check
                                       className="size-5"
                                       strokeWidth={2.5}
                                    />
                                 ) : (
                                    <svg
                                       className="size-5"
                                       viewBox="0 0 20 20"
                                       fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                    >
                                       <path
                                          d="M6.82772 8.3139C6.41285 8.3139 6.07856 8.65635 6.07856 9.07624C6.07856 9.49613 6.41285 9.83857 6.82772 9.83857H13.1722C13.587 9.83857 13.9213 9.49613 13.9213 9.07624C13.9213 8.65635 13.587 8.3139 13.1722 8.3139H6.82772Z"
                                          fill="currentColor"
                                       />
                                       <path
                                          d="M6.82772 12.009C6.41285 12.009 6.07856 12.3514 6.07856 12.7713C6.07856 13.1912 6.41285 13.5336 6.82772 13.5336H13.1722C13.587 13.5336 13.9213 13.1912 13.9213 12.7713C13.9213 12.3514 13.587 12.009 13.1722 12.009H6.82772Z"
                                          fill="currentColor"
                                       />
                                       <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M12.2875 6.45935e-07H7.71247C7.51977 -9.71368e-06 7.33934 -1.94097e-05 7.18711 0.0105667C7.02246 0.0220163 6.83687 0.0483554 6.647 0.128515C6.24116 0.299847 5.9191 0.628306 5.75128 1.04125C5.70299 1.16006 5.67467 1.27715 5.6574 1.38869C5.22728 1.39609 4.88194 1.42104 4.57032 1.50614C3.37306 1.83311 2.43862 2.786 2.11815 4.005C1.99961 4.4559 1.99978 4.97931 2.00002 5.7265L2.00005 13.7506C2.00003 15.01 2.00001 16.0319 2.10626 16.8374C2.21692 17.6763 2.45505 18.3934 3.01544 18.9646C3.57599 19.5359 4.28008 19.7788 5.10378 19.8917C5.89426 20 6.8972 20 8.13259 20H11.8674C13.1028 20 14.1057 20 14.8962 19.8917C15.7199 19.7788 16.424 19.5359 16.9846 18.9646C17.5449 18.3934 17.7831 17.6763 17.8937 16.8374C18 16.0319 18 15.01 17.9999 13.7507L18 5.72653C18.0002 4.97938 18.0004 4.45589 17.8818 4.005C17.5614 2.786 16.6269 1.83311 15.4297 1.50614C15.118 1.42103 14.7727 1.39609 14.3425 1.38869C14.3253 1.27715 14.2969 1.16006 14.2487 1.04125C14.0808 0.628306 13.7588 0.299847 13.3529 0.128515C13.1631 0.0483554 12.9775 0.0220163 12.8128 0.0105667C12.6606 -1.94078e-05 12.4802 -9.71369e-06 12.2875 6.45935e-07ZM7.28926 1.53169C7.38418 1.52509 7.51262 1.52468 7.7341 1.52468H12.2658C12.4873 1.52468 12.6158 1.52509 12.7107 1.53169C12.7542 1.53472 12.7771 1.5384 12.7862 1.54018C12.8187 1.55598 12.8452 1.58287 12.8609 1.61655C12.8626 1.62582 12.8663 1.64925 12.8693 1.69436C12.8758 1.79125 12.8762 1.9223 12.8762 2.14799C12.8762 2.37368 12.8758 2.50473 12.8693 2.60162C12.8663 2.64673 12.8626 2.67016 12.8609 2.67943C12.8452 2.71312 12.8187 2.74001 12.7862 2.7558C12.7771 2.75758 12.7542 2.76126 12.7107 2.76429C12.6158 2.77089 12.4873 2.7713 12.2658 2.7713H7.7341C7.51262 2.7713 7.38418 2.77089 7.28926 2.76429C7.2457 2.76126 7.22288 2.75758 7.21372 2.7558C7.1812 2.74001 7.15473 2.71312 7.13907 2.67943C7.13732 2.67016 7.13364 2.64673 7.13062 2.60162C7.12413 2.50473 7.12373 2.37368 7.12373 2.14799C7.12373 1.9223 7.12413 1.79125 7.13062 1.69436C7.13364 1.64925 7.13732 1.62582 7.13907 1.61656C7.15473 1.58287 7.1812 1.55597 7.21372 1.54018C7.22288 1.5384 7.2457 1.53472 7.28926 1.53169ZM4.9587 2.9787C5.10749 2.93807 5.28947 2.92097 5.6585 2.91434C5.67587 3.02376 5.70401 3.13842 5.75128 3.25473C5.9191 3.66767 6.24116 3.99613 6.647 4.16747C6.83687 4.24763 7.02246 4.27396 7.18711 4.28541C7.33935 4.296 7.51974 4.29599 7.71247 4.29598H12.2875C12.4802 4.29599 12.6606 4.296 12.8128 4.28541C12.9775 4.27396 13.1631 4.24763 13.3529 4.16747C13.7588 3.99613 14.0808 3.66767 14.2487 3.25473C14.2959 3.13842 14.3241 3.02376 14.3414 2.91434C14.7105 2.92097 14.8925 2.93806 15.0413 2.9787C15.7207 3.16424 16.2521 3.70534 16.4344 4.39904C16.4952 4.63018 16.5016 4.9346 16.5016 5.84306V13.6951C16.5016 15.023 16.5001 15.9424 16.4087 16.6345C16.3203 17.3048 16.1603 17.6468 15.9242 17.8873C15.6884 18.1278 15.3533 18.2906 14.6962 18.3807C14.0174 18.4737 13.1157 18.4753 11.8127 18.4753H8.1873C6.88428 18.4753 5.98255 18.4737 5.30375 18.3807C4.64665 18.2906 4.31162 18.1278 4.07575 17.8873C3.83971 17.6468 3.67967 17.3048 3.59125 16.6345C3.49994 15.9424 3.49836 15.023 3.49836 13.6951V5.84305C3.49836 4.9346 3.50479 4.63018 3.56556 4.39904C3.74793 3.70534 4.27932 3.16424 4.9587 2.9787Z"
                                          fill="currentColor"
                                       />
                                    </svg>
                                 )}
                              </Button>
                           </div>
                        </div>
                     </ModalContent>
                  </ModalWrapper>
                  <div className="container mt-6 space-y-5">
                     {members.map((member) => (
                        <div key={member.user.email}>
                           <div className="flex items-center gap-3">
                              <UserAvatar
                                 className="size-11 [&>[data-indicator]]:size-4"
                                 user={member.user}
                              />
                              <div>
                                 <p className="line-clamp-1 font-semibold">
                                    {member.user.name}
                                 </p>
                                 <p className="line-clamp-1 opacity-75">
                                    {member.user.email}
                                 </p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </Main>
      </>
   )
}
