import { Button, buttonVariants } from "@/ui/components/button"
import { cardVariants } from "@/ui/components/card"
import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import { useMountError } from "@/user-interactions/use-mount-error"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/login")({
   component: Component,
   meta: () => [{ title: "Log in" }],
   validateSearch: (
      search: Record<string, unknown>,
   ): {
      error?: string | undefined
   } => {
      return {
         error: search.error as string | undefined,
      }
   },
})

function Component() {
   useMountError("Authentication failed, please try again")
   // const navigate = useNavigate()
   // const search = Route.useSearch()
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

   const loginWithGithub = useMutation({
      // mutationFn: () => useServerFn(loginWithGithubFn),
      // onSuccess: (data) => {
      //    window.location.href = data.url
      //  },
   })

   return (
      <>
         <header className="absolute z-[2] flex justify-between p-5">
            <a
               href="https://socialhunt.pages.dev"
               className={buttonVariants({ variant: "outline", size: "sm" })}
            >
               {/* <ArrowLeftCircleIcon className="size-[18px]" /> */}
               Homepage
            </a>
         </header>
         <main className="pattern h-svh px-7">
            <div className="isolate grid h-full place-items-center md:min-h-[92svh] max-md:pt-8">
               <div>
                  <h1 className="mb-5 flex items-center justify-center gap-3 pb-2 text-center font-bold text-[1.5rem] leading-none">
                     <Icons.logo
                        id="login"
                        className="-mt-0.5 size-11"
                     />
                     Log in to SocialHunt
                  </h1>
                  <div
                     className={cn(
                        cardVariants(),
                        "relative mx-auto my-7 flex w-full max-w-[385px] flex-col overflow-hidden rounded-2xl p-0 ring-8 ring-ring/15 dark:bg-popover dark:ring-ring/[0.12]",
                     )}
                  >
                     <div
                        className="h-6 w-full"
                        aria-hidden="true"
                     />
                     <>
                        {isCodeSent ? (
                           <div
                              className="flex h-full flex-col px-6"
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
                                       referralCode: search.referralCode,
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
                                       referralCode: search.referralCode,
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

                              <div className="relative my-8 w-full">
                                 <hr className="w-full bg-border" />
                                 <span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 bg-background p-2.5 font-medium text-foreground/50 dark:bg-popover">
                                    OR
                                 </span>
                              </div>
                              <div className="px-6">
                                 <Button
                                    variant={"outline"}
                                    size={"lg"}
                                    className="w-full"
                                    disabled={
                                       loginWithGithub.isPending ||
                                       loginWithGithub.isSuccess
                                    }
                                    onClick={() => loginWithGithub.mutate()}
                                 >
                                    <Icons.github className="-mt-px size-[21px]" />
                                    Continue with Github
                                 </Button>
                                 <p className="mt-6 text-balance text-center text-[0.72rem] text-foreground/75">
                                    By clicking continue, you acknowledge that
                                    you have read and agree to SocialHunt's{" "}
                                    <a
                                       href="https://socialhunt.pages.dev/privacy-policy"
                                       target="_blank"
                                       rel="noreferrer"
                                       className={buttonVariants({
                                          variant: "link",
                                       })}
                                    >
                                       Terms of Service{" "}
                                    </a>{" "}
                                    and{" "}
                                    <a
                                       href="https://socialhunt.pages.dev/privacy-policy"
                                       target="_blank"
                                       rel="noreferrer"
                                       className={buttonVariants({
                                          variant: "link",
                                       })}
                                    >
                                       Privacy Policy
                                    </a>
                                    .
                                 </p>
                              </div>
                           </div>
                        )}
                     </>
                     <div
                        className="h-7 w-full"
                        aria-hidden="true"
                     />
                  </div>
               </div>
            </div>
         </main>
      </>
   )
}
