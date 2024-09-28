import * as organization from "@/organization/functions"
import { Button } from "@/ui/components/button"
import { cardVariants } from "@/ui/components/card"
import { Icons } from "@/ui/components/icons"
import { Loading } from "@/ui/components/loading"
import { Logo } from "@/ui/components/logo"
import { cn } from "@/ui/utils"
import { useMountError } from "@/user-interactions/use-mount-error"
import * as auth from "@/user/functions"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { useEffect, useState } from "react"
import { toast } from "sonner"

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
   const { data: organizationToJoin } = useQuery({
      queryKey: ["organization_by_invite_code", search.inviteCode],
      queryFn: () => byInviteCodeFn({ inviteCode: search.inviteCode ?? "" }),
      enabled: !!search.inviteCode,
   })

   useEffect(() => {
      if (!organizationToJoin) return

      toast.custom(
         () => (
            <div className="text-popover-foreground/90">
               <p className="mb-2 line-clamp-1 font-medium font-semibold text-[1rem]">
                  You are invited
               </p>
               <p className="line-clamp-1">
                  Sign up to join <b>{organizationToJoin.name}</b> organization
               </p>
            </div>
         ),
         {
            duration: Infinity,
            className:
               "!rounded-xl h-[auto] border px-3 py-2 !w-[90%] md:!w-full max-md:mb-[calc(env(safe-area-inset-bottom)+0.5rem)]",
            position: "bottom-right",
         },
      )
   }, [organizationToJoin])

   // const otpInputRef = useRef<HTMLInputElement>(null)

   const [isCodeSent, _setIsCodeSent] = useState(false)
   // const [email, setEmail] = useState("")
   // const [userId, setUserId] = useState<string>()
   // const timer = useCountdownTimer({
   //    initialTime: 45,
   // })

   // const {
   //    isPending,
   //    isSuccess,
   //    mutate: sendLoginCode,
   // } = api.user.sendLoginCode.useMutation({
   //    onMutate: () => {
   //       timer.start()
   //    },
   //    onSuccess: (res) => {
   //       res.userId && setUserId(res.userId)
   //    },
   //    onError: () => {
   //       toast.error("An error occurred, couldn't send code")
   //       timer.reset()
   //    },
   // })

   // const {
   //    isPending: verifyCodePending,
   //    isSuccess: verifyCodeSuccess,
   //    mutateAsync: verifyCodeMutate,
   // } = api.user.verifyLoginCode.useMutation({
   //    onError: () => undefined,
   //    onSuccess: () => {
   //       setTimeout(() => {
   //          toast.dismiss()
   //          navigate({ to: "/" })
   //       }, 500)
   //    },
   // })

   // const onVerifyCode = ({
   //    code,
   //    userId,
   // }: { code: string; userId: string }) => {
   //    toast.dismiss("otp")
   //    toast.promise(verifyCodeMutate({ code, userId }), {
   //       id: "otp",
   //       loading: "Verifying code...",
   //       success: () => `Code is valid`,
   //       error: () => `Code is invalid or expired`,
   //       position:
   //          window.innerWidth < MOBILE_BREAKPOINT
   //             ? "top-center"
   //             : "bottom-center",
   //    })
   // }

   // useEffect(() => {
   //    if (isSuccess) {
   //       setTimeout(() => {
   //          setIsCodeSent(true)
   //       }, 700)
   //    }
   // }, [isSuccess])

   const loginWithGithubFn = useServerFn(auth.logInWithGithub)
   const loginWithGithub = useMutation({
      mutationFn: loginWithGithubFn,
      onSuccess: (url) => {
         window.location.href = search.inviteCode
            ? `${url}?inviteCode=${search.inviteCode}`
            : url
      },
   })

   return (
      <>
         <main className=" h-svh px-7">
            <div className="isolate grid h-full place-items-center md:min-h-[92svh] max-md:pt-8">
               <div className="flex w-full max-w-[320px] flex-col">
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
                              </div>
                           </div>
                        )}
                     </>
                  </div>
               </div>
            </div>
         </main>
      </>
   )
}
