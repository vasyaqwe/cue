import { useMountError } from "@/interactions/use-mount-error"
import * as organization from "@/organization/functions"
import { Button } from "@/ui/components/button"
import { cardVariants } from "@/ui/components/card"
import { Icons } from "@/ui/components/icons"
import { Loading } from "@/ui/components/loading"
import { Logo } from "@/ui/components/logo"
import { cn } from "@/ui/utils"
import * as userFns from "@/user/functions"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { match } from "ts-pattern"

export const Route = createFileRoute("/login")({
   component: Component,
   meta: () => [{ title: "Log in" }],
   validateSearch: (
      search: Record<string, unknown>,
   ): {
      inviteCode?: string | undefined
      error?: string | undefined
   } => {
      return {
         inviteCode: search.inviteCode as string | undefined,
         error: search.error as string | undefined,
      }
   },
})

function Component() {
   useMountError("Login failed, please try again")
   // const navigate = useNavigate()
   const search = Route.useSearch()

   const byInviteCodeFn = useServerFn(organization.byInviteCode)
   const organizationToJoin = useQuery({
      queryKey: ["organization_by_invite_code", search.inviteCode],
      queryFn: () => byInviteCodeFn({ inviteCode: search.inviteCode ?? "" }),
      enabled: !!search.inviteCode,
   })

   useEffect(() => {
      const organization = organizationToJoin.data

      match(organization)
         .with(undefined, () => {})
         .otherwise((org) =>
            toast.custom(
               () => (
                  <div className="text-popover-foreground/90">
                     <p className="mb-2 line-clamp-1 font-medium font-semibold text-[1rem]">
                        You are invited
                     </p>
                     <p className="line-clamp-1">
                        Sign up to join <b>{org.name}</b> organization
                     </p>
                  </div>
               ),
               {
                  duration: Infinity,
                  className:
                     "!rounded-xl h-[auto] border px-3 py-2 !w-[90%] md:!w-full max-md:mb-[calc(env(safe-area-inset-bottom)+0.5rem)]",
                  position: "bottom-right",
               },
            ),
         )
   }, [organizationToJoin.data])

   // const otpInputRef = useRef<HTMLInputElement>(null)

   const [isCodeSent, _setIsCodeSent] = useState(false)

   const loginWithGithubFn = useServerFn(userFns.logInWithGithub)
   const loginWithGithub = useMutation({
      mutationFn: loginWithGithubFn,
      onSuccess: (url) => {
         window.location.href = url
      },
   })

   const loginWithGoogleFn = useServerFn(userFns.logInWithGoogle)
   const loginWithGoogle = useMutation({
      mutationFn: loginWithGoogleFn,
      onSuccess: (url) => {
         window.location.href = url
      },
   })

   return (
      <main className="isolate grid h-svh w-full place-items-center px-4">
         <div className="-mt-8 flex w-full max-w-[320px] flex-col">
            <Logo className="mx-auto mb-6" />
            <h1 className="mb-6 gap-6 pb-2 text-center font-bold text-[1.5rem] leading-none">
               Log in to Cue
            </h1>
            <div
               className={cn(
                  cardVariants(),
                  "pattern relative mx-auto flex w-full flex-col overflow-hidden rounded-2xl p-0",
               )}
            >
               <>
                  {isCodeSent ? (
                     <div
                        className="flex h-full flex-col p-6 md:p-9"
                        key={isCodeSent.toString()}
                     >
                        <p className="text-foreground/75 md:text-[1rem]">
                           Enter the 6-digit code we sent to your email.
                        </p>
                        <div className="mt-6 flex flex-grow flex-col">
                           {/* <InputOTP
                              ref={otpInputRef}
                              autoFocus
                              onComplete={(code) => {
                                 if (!userId)
                                    return toast.error(
                                       "An error occurred, try again later",
                                    )

                                 if (verifyCodePending) return

                                 // blur on mobile for toast to be visible
                                 if (window.innerWidth < MOBILE_BREAKPOINT) {
                                    otpInputRef.current?.blur()
                                 }

                                 onVerifyCode({ code, userId })
                              }}
                              className="focus-visible:ring-0"
                              disabled={verifyCodeSuccess}
                              name="code"
                              maxLength={6}
                           >
                              <InputOTPGroup>
                                 <InputOTPSlot index={0} />
                                 <InputOTPSlot index={1} />
                                 <InputOTPSlot index={2} />
                                 <InputOTPSlot index={3} />
                                 <InputOTPSlot index={4} />
                                 <InputOTPSlot index={5} />
                              </InputOTPGroup>
                           </InputOTP>
                           <p className="mt-7 text-foreground/75">
                              The code expires in 5 minutes.{" "}
                              <br className="mb-2" /> Having problems?{" "}
                              <Button
                                 disabled={timer.timeLeft > 0}
                                 onClick={() => {
                                    sendLoginCode({
                                       email,
                                       inviteCode: search.inviteCode,
                                    })
                                 }}
                                 variant={"link"}
                              >
                                 Resend code{" "}
                                 {timer.timeLeft > 0
                                    ? `(${timer.timeLeft})`
                                    : null}
                              </Button>
                              .
                           </p> */}
                        </div>
                     </div>
                  ) : (
                     <div>
                        {/* <form
                                 onSubmit={(e) => {
                                    e.preventDefault()
                                    sendLoginCode({
                                       email,
                                       inviteCode: search.inviteCode,
                                    })
                                 }}
                                 className="px-6"
                              >
                                 <Label
                                    htmlFor="email"
                                    className={"md:text-[1rem]"}
                                 >
                                    We'll send you a one-time password.
                                 </Label>
                                 <Input
                                    required
                                    id="email"
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="my-3"
                                 />
                                 <Button
                                    className="w-full"
                                    disabled={isPending || isSuccess}
                                 >
                                    Continue{" "}
                                    <ArrowRightCircleIcon className="size-5" />
                                 </Button>
                              </form> */}

                        {/* <div className="relative my-8 w-full">
                                 <hr className="w-full border-border" />
                                 <span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 bg-muted p-2.5 font-medium text-foreground/50 dark:bg-popover">
                                    OR
                                 </span>
                              </div> */}
                        <div className="p-6 md:p-9">
                           <Button
                              size={"lg"}
                              variant={"outline"}
                              className="w-full"
                              disabled={
                                 loginWithGithub.isPending ||
                                 loginWithGithub.isSuccess
                              }
                              onClick={() =>
                                 loginWithGithub.mutate({
                                    inviteCode: search.inviteCode,
                                 })
                              }
                           >
                              {loginWithGithub.isPending ||
                              loginWithGithub.isSuccess ? (
                                 <Loading />
                              ) : (
                                 <>
                                    <Icons.github className="-mt-px size-[18px]" />
                                    Continue with Github
                                 </>
                              )}
                           </Button>
                           <Button
                              size={"lg"}
                              variant={"outline"}
                              className="mt-3 w-full"
                              disabled={
                                 loginWithGoogle.isPending ||
                                 loginWithGoogle.isSuccess
                              }
                              onClick={() =>
                                 loginWithGoogle.mutate({
                                    inviteCode: search.inviteCode,
                                 })
                              }
                           >
                              {loginWithGoogle.isPending ||
                              loginWithGoogle.isSuccess ? (
                                 <Loading />
                              ) : (
                                 <>
                                    <svg
                                       className="size-[18px]"
                                       width="256"
                                       height="262"
                                       viewBox="0 0 256 262"
                                       xmlns="http://www.w3.org/2000/svg"
                                       preserveAspectRatio="xMidYMid"
                                    >
                                       <path
                                          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                          fill="currentColor"
                                       />
                                       <path
                                          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                          fill="currentColor"
                                          fillOpacity={0.6}
                                       />
                                       <path
                                          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                                          fill="currentColor"
                                       />
                                       <path
                                          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                          fill="currentColor"
                                          fillOpacity={0.6}
                                       />
                                    </svg>
                                    Continue with Google
                                 </>
                              )}
                           </Button>
                        </div>
                     </div>
                  )}
               </>
            </div>
         </div>
      </main>
   )
}
