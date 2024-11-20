import app from "@/assets/app.webp"
import app_mobile from "@/assets/app_mobile.webp"
import pattern from "@/assets/pattern.webp"
import { buttonVariants } from "@/ui/components/button"
import { Kbd } from "@/ui/components/kbd"
import { Logo } from "@/ui/components/logo"
import { cn } from "@/ui/utils"
import { Link, useNavigate } from "@tanstack/react-router"
import { useHotkeys } from "react-hotkeys-hook"
import { match } from "ts-pattern"

export function Homepage({
   memberships = [],
   isAuthed = false,
}: { memberships?: { organization: { slug: string } }[]; isAuthed?: boolean }) {
   const navigate = useNavigate()

   useHotkeys("l", () =>
      match(isAuthed)
         .with(false, () => navigate({ to: "/login" }))
         .otherwise(() => navigate({ to: "/" })),
   )

   const slug = memberships?.[0]?.organization.slug

   return (
      <div className="max-h-svh w-full overflow-y-auto">
         <header className="mx-auto flex w-full max-w-[68rem] items-center justify-between px-4 py-4">
            <Link
               to={!isAuthed ? "/" : "/homepage"}
               className="flex items-center gap-3 font-medium font-secondary text-[1.725rem] tracking-tight"
            >
               <Logo className="size-9" />
               Cue
            </Link>
            {isAuthed ? (
               <Link
                  to={slug ? "/$slug" : "/"}
                  params={slug ? { slug } : {}}
                  className={cn(
                     buttonVariants({ variant: "outline" }),
                     "active:scale-[98%] hover:bg-elevated/75",
                  )}
               >
                  Open app
                  <Kbd className="font-semibold">L</Kbd>
               </Link>
            ) : (
               <Link
                  to="/login"
                  className={cn(
                     buttonVariants({ variant: "outline" }),
                     "active:scale-[98%] hover:bg-elevated/75",
                  )}
               >
                  Log in
                  <Kbd className="font-semibold">L</Kbd>
               </Link>
            )}
         </header>
         <main className="mt-5 md:mt-8">
            <section className="mx-auto max-w-3xl px-4">
               <h1 className="text-center font-medium font-secondary text-5xl leading-[1.3] tracking-tighter md:text-[4rem] sm:text-6xl sm:leading-[1.1]">
                  Simple & minimal <br /> <em>issue tracking</em>
               </h1>
            </section>
            <section className="mx-auto my-12 flex max-w-3xl justify-center px-4 md:mt-14 md:mb-20">
               <ul className="space-y-4 font-medium text-lg tracking-wide">
                  <li className="flex flex-col gap-3 sm:flex-row sm:items-center">
                     <svg
                        className="size-7 sm:size-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <g opacity="0.12">
                           <path
                              d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                              fill="currentColor"
                           />
                           <path
                              d="M17 21.3193C17.4 21.3193 21 19.375 21 16.6528C21 15.2918 19.8 14.3365 18.6 14.3196C18 14.3111 17.4 14.514 17 15.0973C16.6 14.514 15.9896 14.3196 15.4 14.3196C14.2 14.3196 13 15.2918 13 16.6528C13 19.375 16.6 21.3193 17 21.3193Z"
                              fill="currentColor"
                           />
                           <path
                              d="M8 15H10.1875V15.2368C10.0661 15.6788 10 16.1519 10 16.6528C10 18.1612 10.5441 19.4302 11.2266 20.4315V21H6C4.89543 21 4 20.1046 4 19C4 16.7909 5.79086 15 8 15Z"
                              fill="currentColor"
                           />
                        </g>
                        <path
                           d="M10.4023 21H6C4.89543 21 4 20.1046 4 19C4 16.7909 5.79086 15 8 15H9.21484M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM17 21.3193C16.6 21.3193 13 19.375 13 16.6528C13 15.2918 14.2 14.3196 15.4 14.3196C15.9896 14.3196 16.6 14.514 17 15.0973C17.4 14.514 18 14.3111 18.6 14.3196C19.8 14.3365 21 15.2918 21 16.6528C21 19.375 17.4 21.3193 17 21.3193Z"
                           stroke="currentColor"
                           strokeWidth={2}
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                     Create organizations & invite your teammates.
                  </li>
                  <li className="flex flex-col gap-3 sm:flex-row sm:items-center">
                     <svg
                        className="size-7 sm:size-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           opacity="0.12"
                           d="M3.12568 17.5726C3.08011 17.7497 3.07546 17.9381 3.06616 18.3151L3 20.9955L5.72665 20.9999C6.11608 21.0005 6.31079 21.0008 6.49406 20.9568C6.65654 20.9178 6.81188 20.8534 6.95435 20.7658C7.11505 20.6669 7.25274 20.5287 7.52811 20.2521L20.5014 7.22177C20.5329 7.19018 20.5486 7.17439 20.5622 7.16005C21.0616 6.63294 21.1427 5.83327 20.7594 5.21582C20.2699 4.42508 19.6065 3.75508 18.8267 3.25131C18.204 2.84896 17.3862 2.93708 16.8626 3.46297L3.8099 16.573C3.54444 16.8396 3.41171 16.973 3.31544 17.1282C3.23007 17.2658 3.16608 17.4156 3.12568 17.5726Z"
                           fill="currentColor"
                        />
                        <path
                           d="M12 21C16.018 17.7256 16.0891 24.3574 21 19M3 20.9955L5.72665 20.9999C6.11608 21.0005 6.31079 21.0008 6.49406 20.9568C6.65654 20.9178 6.81188 20.8534 6.95435 20.7658C7.11505 20.6669 7.25274 20.5287 7.52811 20.2521L20.5014 7.22177C21.0315 6.68941 21.1632 5.86631 20.7594 5.21582C20.2713 4.42948 19.6037 3.75331 18.8267 3.25131C18.204 2.84896 17.3862 2.93708 16.8626 3.46297L3.8099 16.573C3.54444 16.8396 3.41171 16.973 3.31544 17.1282C3.23007 17.2658 3.16608 17.4156 3.12568 17.5726C3.08011 17.7497 3.07546 17.9381 3.06616 18.3151L3 20.9955Z"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                     Report issues with a powerful rich-text editor.
                  </li>
                  <li className="flex flex-col gap-3 sm:flex-row sm:items-center">
                     <svg
                        className="size-7 sm:size-6"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M12.7545 1.01089C12.3242 0.95893 11.9454 1.09904 11.6352 1.30003C11.3356 1.49407 11.0572 1.77131 10.7903 2.08245C10.2683 2.69106 9.65136 3.59885 8.88079 4.73375L4.53616 11.1324C4.00298 11.9176 3.55441 12.5782 3.29234 13.1239C3.02396 13.6826 2.842 14.341 3.19747 14.9859C3.55294 15.6308 4.21659 15.8463 4.84272 15.9366C5.45415 16.0247 6.26679 16.0247 7.23274 16.0246H7.92392C8.45007 16.0246 8.77685 16.0258 9.0175 16.0533C9.23823 16.0786 9.28712 16.1174 9.29836 16.1263C9.32349 16.1461 9.34679 16.1689 9.36718 16.1934C9.37633 16.2044 9.41577 16.2516 9.44165 16.4668C9.46986 16.7014 9.47112 17.0199 9.47112 17.5328V17.5866C9.4711 18.9581 9.47109 20.0547 9.5623 20.8475C9.60867 21.2505 9.68388 21.6315 9.82379 21.9545C9.96871 22.289 10.2052 22.6096 10.5935 22.7978C10.7982 22.897 11.0186 22.9617 11.2455 22.9891C11.6758 23.0411 12.0546 22.901 12.3648 22.7C12.6644 22.5059 12.9428 22.2287 13.2097 21.9176C13.7346 21.3056 14.3555 20.3911 15.132 19.2474L19.4638 12.8676C19.997 12.0824 20.4456 11.4218 20.7077 10.8761C20.976 10.3174 21.158 9.65896 20.8025 9.01408C20.4471 8.36919 19.7834 8.15371 19.1573 8.06345C18.5459 7.97531 17.7332 7.97535 16.7672 7.97539L16.0761 7.97539C15.5499 7.97539 15.2232 7.97417 14.9825 7.94666C14.7618 7.92143 14.7129 7.88264 14.7016 7.87372C14.6765 7.85385 14.6532 7.83106 14.6328 7.80656C14.6237 7.7956 14.5842 7.74837 14.5584 7.5332C14.5301 7.29862 14.5289 6.98007 14.5289 6.46718V6.41337C14.5289 5.04187 14.5289 3.94525 14.4377 3.15252C14.3913 2.74948 14.3161 2.36849 14.1762 2.04553C14.0313 1.711 13.7948 1.39039 13.4065 1.20219C13.2018 1.10297 12.9814 1.03829 12.7545 1.01089Z"
                           fill="currentColor"
                           fillOpacity="0.12"
                        />
                        <path
                           fillRule="evenodd"
                           clipRule="evenodd"
                           d="M12.0422 3.16266C11.5876 3.69366 11.0219 4.52578 10.2138 5.71801L5.98343 11.959C5.40904 12.8064 5.03389 13.3638 4.83125 13.7865C4.73349 13.9904 4.70297 14.1101 4.69608 14.1742C4.69309 14.202 4.69538 14.2143 4.69538 14.2143L4.69709 14.2178C4.69863 14.2206 4.69912 14.2212 4.69912 14.2212C4.69912 14.2212 4.7082 14.2297 4.73384 14.2428C4.79235 14.2725 4.91143 14.3137 5.13951 14.3467C5.61229 14.415 6.29539 14.4171 7.33607 14.4171L8.00262 14.4171C8.46735 14.4171 8.88717 14.4171 9.231 14.4564C9.60419 14.4992 9.99541 14.5977 10.3407 14.8712C10.4527 14.9599 10.555 15.0598 10.6459 15.1693C10.926 15.5064 11.0269 15.8884 11.0707 16.2528C11.111 16.5886 11.111 16.9985 11.1109 17.4523L11.1109 17.4958C11.1109 18.9255 11.1122 19.9242 11.1913 20.6121C11.2306 20.9544 11.2834 21.1579 11.3331 21.273C11.3435 21.297 11.3522 21.3135 11.3584 21.3243C11.3771 21.3314 11.3963 21.337 11.4158 21.3412C11.4271 21.3355 11.4436 21.3264 11.4659 21.312C11.5724 21.2429 11.7315 21.1016 11.9578 20.8373C12.4124 20.3063 12.9781 19.4742 13.7862 18.282L18.0166 12.041C18.591 11.1936 18.9661 10.6362 19.1688 10.2135C19.2665 10.0096 19.297 9.88991 19.3039 9.82584C19.3069 9.79777 19.3046 9.78571 19.3046 9.78571C19.3046 9.78571 19.3045 9.78496 19.3029 9.78215C19.3014 9.77935 19.3009 9.77881 19.3009 9.77881C19.3009 9.77881 19.2916 9.77015 19.2662 9.75723C19.2076 9.72748 19.0886 9.68625 18.8605 9.65332C18.3877 9.58505 17.7046 9.58285 16.6639 9.58285L15.9974 9.58285C15.5326 9.58289 15.1128 9.58293 14.769 9.54356C14.3958 9.50083 14.0046 9.40229 13.6593 9.12881C13.5473 9.04005 13.445 8.94016 13.3541 8.83074C13.074 8.49359 12.9731 8.11157 12.9293 7.74717C12.889 7.41143 12.889 7.00149 12.8891 6.5477L12.8891 6.50422C12.8891 5.0745 12.8878 4.07576 12.8087 3.38792C12.7694 3.04564 12.7166 2.84205 12.6669 2.72704C12.6565 2.70299 12.6478 2.68648 12.6416 2.67569C12.6229 2.66864 12.6037 2.663 12.5842 2.65884C12.5729 2.66445 12.5564 2.67358 12.5341 2.68802C12.4276 2.75712 12.2685 2.89842 12.0422 3.16266ZM12.7574 1.01139C12.9909 1.03962 13.2177 1.10629 13.4283 1.20855C13.8342 1.40563 14.0791 1.74053 14.2274 2.08353C14.3703 2.41392 14.4459 2.8005 14.4922 3.20355C14.5831 3.99511 14.5831 5.08778 14.5831 6.44614V6.50422C14.5831 7.01547 14.5845 7.3268 14.6118 7.55454C14.6245 7.66007 14.64 7.71944 14.6518 7.7522C14.6613 7.77882 14.6678 7.78645 14.6695 7.78845C14.6864 7.80882 14.7056 7.82764 14.7265 7.84416C14.7285 7.8458 14.7366 7.85229 14.7638 7.86161C14.7974 7.87309 14.8582 7.88829 14.9663 7.90066C15.1995 7.92736 15.5183 7.9287 16.0419 7.9287L16.7323 7.92869C17.6858 7.92864 18.4964 7.9286 19.1083 8.01696C19.7362 8.10761 20.4253 8.32706 20.7952 8.99921C21.165 9.67136 20.9721 10.3536 20.703 10.9149C20.4407 11.4619 19.9932 12.122 19.4669 12.8983L15.166 19.2434C14.3982 20.3761 13.7806 21.2873 13.2574 21.8984C12.991 22.2095 12.7094 22.4912 12.4035 22.6897C12.0859 22.8957 11.6924 23.043 11.2426 22.9886C11.0091 22.9604 10.7823 22.8937 10.5717 22.7915C10.1658 22.5944 9.9209 22.2595 9.77256 21.9165C9.62968 21.5861 9.55409 21.1995 9.50779 20.7965C9.41687 20.0049 9.41688 18.9122 9.4169 17.5538V17.4958C9.4169 16.9845 9.41554 16.6732 9.38819 16.4455C9.37552 16.3399 9.35996 16.2806 9.34821 16.2478C9.33865 16.2212 9.3322 16.2135 9.33052 16.2115C9.31359 16.1912 9.29436 16.1724 9.2735 16.1558C9.2735 16.1558 9.26455 16.1481 9.23616 16.1384C9.2026 16.1269 9.1418 16.1117 9.03373 16.0993C8.80051 16.0726 8.48167 16.0713 7.9581 16.0713L7.26773 16.0713C6.31422 16.0714 5.50359 16.0714 4.8917 15.983C4.26385 15.8924 3.57471 15.6729 3.20484 15.0008C2.83498 14.3286 3.02794 13.6464 3.29705 13.0851C3.55932 12.5381 4.00677 11.878 4.53309 11.1017L8.83397 4.75663C9.60176 3.62388 10.2194 2.7127 10.7426 2.10161C11.009 1.79047 11.2906 1.50884 11.5965 1.31034C11.9141 1.10426 12.3076 0.956972 12.7574 1.01139Z"
                           fill="currentColor"
                        />
                        <path
                           d="M12.6036 2.65063L12.601 2.65142M12.63 2.65841L12.6318 2.66046M11.3964 21.3494L11.399 21.3486M11.37 21.3416L11.3682 21.3395M10.2138 5.71801C11.0219 4.52578 11.5876 3.69366 12.0422 3.16266C12.2685 2.89842 12.4276 2.75712 12.5341 2.68802C12.5564 2.67358 12.5729 2.66445 12.5842 2.65884C12.6037 2.663 12.6229 2.66864 12.6416 2.67569C12.6478 2.68648 12.6565 2.70299 12.6669 2.72704C12.7166 2.84205 12.7694 3.04564 12.8087 3.38792C12.8878 4.07576 12.8891 5.0745 12.8891 6.50422L12.8891 6.5477C12.889 7.00149 12.889 7.41143 12.9293 7.74717C12.9731 8.11157 13.074 8.49359 13.3541 8.83074C13.445 8.94016 13.5473 9.04005 13.6593 9.12881C14.0046 9.40229 14.3958 9.50083 14.769 9.54356C15.1128 9.58293 15.5326 9.58289 15.9974 9.58285L16.6639 9.58285C17.7046 9.58285 18.3877 9.58505 18.8605 9.65332C19.0886 9.68625 19.2076 9.72748 19.2662 9.75723C19.2916 9.77015 19.3009 9.77881 19.3009 9.77881C19.3009 9.77881 19.3014 9.77935 19.3029 9.78215C19.3045 9.78496 19.3046 9.78571 19.3046 9.78571C19.3046 9.78571 19.3069 9.79777 19.3039 9.82584C19.297 9.88991 19.2665 10.0096 19.1688 10.2135C18.9661 10.6362 18.591 11.1936 18.0166 12.041L13.7862 18.282C12.9781 19.4742 12.4124 20.3063 11.9578 20.8373C11.7315 21.1016 11.5724 21.2429 11.4659 21.312C11.4436 21.3264 11.4271 21.3355 11.4158 21.3412C11.3963 21.337 11.3771 21.3314 11.3584 21.3243C11.3522 21.3135 11.3435 21.297 11.3331 21.273C11.2834 21.1579 11.2306 20.9544 11.1913 20.6121C11.1122 19.9242 11.1109 18.9255 11.1109 17.4958L11.1109 17.4523C11.111 16.9985 11.111 16.5886 11.0707 16.2528C11.0269 15.8884 10.926 15.5064 10.6459 15.1693C10.555 15.0598 10.4527 14.9599 10.3407 14.8712C9.99541 14.5977 9.60419 14.4992 9.231 14.4564C8.88717 14.4171 8.46735 14.4171 8.00262 14.4171L7.33607 14.4171C6.29539 14.4171 5.61229 14.415 5.13951 14.3467C4.91143 14.3137 4.79235 14.2725 4.73384 14.2428C4.7082 14.2297 4.69912 14.2212 4.69912 14.2212C4.69912 14.2212 4.69863 14.2206 4.69709 14.2178L4.69538 14.2143C4.69538 14.2143 4.69309 14.202 4.69608 14.1742C4.70297 14.1101 4.73349 13.9904 4.83125 13.7865C5.03389 13.3638 5.40904 12.8064 5.98343 11.959L10.2138 5.71801ZM12.7574 1.01139C12.9909 1.03962 13.2177 1.10629 13.4283 1.20855C13.8342 1.40563 14.0791 1.74053 14.2274 2.08353C14.3703 2.41392 14.4459 2.8005 14.4922 3.20355C14.5831 3.99511 14.5831 5.08778 14.5831 6.44614V6.50422C14.5831 7.01547 14.5845 7.3268 14.6118 7.55454C14.6245 7.66007 14.64 7.71944 14.6518 7.7522C14.6613 7.77882 14.6678 7.78645 14.6695 7.78845C14.6864 7.80882 14.7056 7.82764 14.7265 7.84416C14.7285 7.8458 14.7366 7.85229 14.7638 7.86161C14.7974 7.87309 14.8582 7.88829 14.9663 7.90066C15.1995 7.92736 15.5183 7.9287 16.0419 7.9287L16.7323 7.92869C17.6858 7.92864 18.4964 7.9286 19.1083 8.01696C19.7362 8.10761 20.4253 8.32706 20.7952 8.99921C21.165 9.67136 20.9721 10.3536 20.703 10.9149C20.4407 11.4619 19.9932 12.122 19.4669 12.8983L15.166 19.2434C14.3982 20.3761 13.7806 21.2873 13.2574 21.8984C12.991 22.2095 12.7094 22.4912 12.4035 22.6897C12.0859 22.8957 11.6924 23.043 11.2426 22.9886C11.0091 22.9604 10.7823 22.8937 10.5717 22.7915C10.1658 22.5944 9.9209 22.2595 9.77256 21.9165C9.62968 21.5861 9.55409 21.1995 9.50779 20.7965C9.41687 20.0049 9.41688 18.9122 9.4169 17.5538V17.4958C9.4169 16.9845 9.41554 16.6732 9.38819 16.4455C9.37552 16.3399 9.35996 16.2806 9.34821 16.2478C9.33865 16.2212 9.3322 16.2135 9.33052 16.2115C9.31359 16.1912 9.29436 16.1724 9.2735 16.1558C9.2735 16.1558 9.26455 16.1481 9.23616 16.1384C9.2026 16.1269 9.1418 16.1117 9.03373 16.0993C8.80051 16.0726 8.48167 16.0713 7.9581 16.0713L7.26773 16.0713C6.31422 16.0714 5.50359 16.0714 4.8917 15.983C4.26385 15.8924 3.57471 15.6729 3.20484 15.0008C2.83498 14.3286 3.02794 13.6464 3.29705 13.0851C3.55932 12.5381 4.00677 11.878 4.53309 11.1017L8.83397 4.75663C9.60176 3.62388 10.2194 2.7127 10.7426 2.10161C11.009 1.79047 11.2906 1.50884 11.5965 1.31034C11.9141 1.10426 12.3076 0.956972 12.7574 1.01139Z"
                           stroke="black"
                           strokeWidth="0.325"
                           strokeLinecap="round"
                        />
                     </svg>
                     Everything is synced, blazing fast & in real-time.
                  </li>
                  <li className="flex flex-col gap-3 sm:flex-row sm:items-center">
                     <svg
                        className="size-7 sm:size-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           opacity="0.12"
                           d="M4.81837 9.60867C5.12965 5.87324 8.25229 3 12.0007 3C15.7491 3 18.8717 5.87324 19.183 9.60867L19.5382 13.8711C19.5811 14.3856 19.7441 14.8637 19.9054 15.3497C20.2235 16.3078 19.5779 17.3156 18.5745 17.4271C17.3333 17.5651 16.0887 17.6639 14.8428 17.7235C12.9491 17.8141 11.0522 17.8141 9.15854 17.7236C7.91232 17.6641 6.66752 17.5653 5.42604 17.4274C4.42166 17.3158 3.77569 16.3065 4.09526 15.3478C4.25729 14.8617 4.42046 14.3836 4.46337 13.8687L4.81837 9.60867Z"
                           fill="currentColor"
                        />
                        <path
                           d="M9.15854 17.7236C7.91232 17.6641 6.66752 17.5653 5.42604 17.4274C4.42166 17.3158 3.77569 16.3065 4.09526 15.3478C4.25729 14.8617 4.42046 14.3836 4.46337 13.8687L4.81837 9.60867C5.12965 5.87324 8.25229 3 12.0007 3C15.7491 3 18.8717 5.87324 19.183 9.60867L19.5382 13.8711C19.5811 14.3856 19.7441 14.8637 19.9054 15.3497C20.2235 16.3078 19.5779 17.3156 18.5745 17.4271C17.3333 17.5651 16.0887 17.6639 14.8428 17.7235M9.15854 17.7236C11.0522 17.8141 12.9491 17.8141 14.8428 17.7235M9.15854 17.7236L9.15857 18.1579C9.15857 19.7276 10.431 21 12.0007 21C13.5703 21 14.8428 19.7276 14.8428 18.1579L14.8428 17.7235"
                           stroke="currentColor"
                           strokeWidth={2}
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                     Receive instant notifications when stuff happens.
                  </li>
                  <li className="flex flex-col gap-3 sm:flex-row sm:items-center">
                     <svg
                        className="size-7 sm:size-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           fillRule="evenodd"
                           clipRule="evenodd"
                           d="M11.935 1H12.065C13.6859 0.999977 14.9923 0.999959 16.0199 1.13146C17.0866 1.26799 17.9849 1.56008 18.6983 2.23916C19.4116 2.91825 19.7185 3.77329 19.8619 4.78879C20 5.76691 20 7.01056 20 8.55348V15.4465C20 16.9894 20 18.2331 19.8619 19.2112C19.7185 20.2267 19.4116 21.0818 18.6983 21.7608C17.9849 22.4399 17.0866 22.732 16.0199 22.8685C14.9923 23 13.6859 23 12.065 23H11.935C10.3141 23 9.00767 23 7.98015 22.8685C6.91335 22.732 6.01513 22.4399 5.30175 21.7608C4.58837 21.0818 4.28153 20.2267 4.1381 19.2112C3.99996 18.2331 3.99998 16.9894 4 15.4465V8.55348C3.99998 7.01055 3.99996 5.76691 4.1381 4.78879C4.28153 3.77329 4.58837 2.91825 5.30175 2.23916C6.01513 1.56008 6.91335 1.26799 7.98015 1.13146C9.00766 0.999959 10.3141 0.999977 11.935 1ZM8.21703 2.80868C7.34737 2.91998 6.88684 3.12356 6.55883 3.43581C6.23081 3.74805 6.01695 4.18644 5.90003 5.01429C5.77967 5.86648 5.77778 6.99594 5.77778 8.61538V15.3846C5.77778 17.0041 5.77967 18.1335 5.90003 18.9857C6.01695 19.8136 6.23081 20.252 6.55883 20.5642C6.88684 20.8764 7.34737 21.08 8.21703 21.1913C9.11226 21.3059 10.2988 21.3077 12 21.3077C13.7012 21.3077 14.8877 21.3059 15.783 21.1913C16.6526 21.08 17.1132 20.8764 17.4412 20.5642C17.7692 20.252 17.983 19.8136 18.1 18.9857C18.2203 18.1335 18.2222 17.0041 18.2222 15.3846V8.61539C18.2222 6.99594 18.2203 5.86648 18.1 5.01429C17.983 4.18644 17.7692 3.74805 17.4412 3.43581C17.1132 3.12356 16.6526 2.91998 15.783 2.80868C14.8877 2.69411 13.7012 2.69231 12 2.69231C10.2988 2.69231 9.11226 2.69411 8.21703 2.80868Z"
                           fill="currentColor"
                        />
                        <path
                           fillRule="evenodd"
                           clipRule="evenodd"
                           d="M8.74075 18.748C8.74075 18.2923 9.13872 17.923 9.62964 17.923H14.3704C14.8613 17.923 15.2593 18.2923 15.2593 18.748C15.2593 19.2036 14.8613 19.573 14.3704 19.573H9.62964C9.13872 19.573 8.74075 19.2036 8.74075 18.748Z"
                           fill="currentColor"
                        />
                        <path
                           fillRule="evenodd"
                           clipRule="evenodd"
                           d="M12.065 1H11.935C10.3141 0.999978 9.00766 0.99996 7.98015 1.13146C6.91335 1.26799 6.01513 1.56008 5.30175 2.23917C4.58837 2.91825 4.28153 3.77329 4.1381 4.78879C3.99996 5.76691 3.99998 7.01054 4 8.55346V15.4465C3.99998 16.9894 3.99996 18.2331 4.1381 19.2112C4.28153 20.2267 4.58837 21.0818 5.30175 21.7608C6.01513 22.4399 6.91335 22.732 7.98015 22.8685C9.00767 23 10.3141 23 11.935 23H12.065C13.6859 23 14.9923 23 16.0199 22.8685C17.0866 22.732 17.9849 22.4399 18.6983 21.7608C19.4116 21.0818 19.7185 20.2267 19.8619 19.2112C20 18.2331 20 16.9894 20 15.4465V8.55348C20 7.01056 20 5.76691 19.8619 4.78879C19.7185 3.77329 19.4116 2.91825 18.6983 2.23917C17.9849 1.56008 17.0866 1.26799 16.0199 1.13146C14.9923 0.99996 13.6859 0.999978 12.065 1Z"
                           fill="currentColor"
                           fillOpacity="0.12"
                        />
                     </svg>
                     Mobile optimized, add to your phone's homescreen.
                  </li>
               </ul>
            </section>
            <section className="relative isolate mx-auto max-w-[68rem] px-4">
               <img
                  src={pattern}
                  alt=""
                  aria-hidden="true"
                  className="-left-5 absolute bottom-0 z-[-1] w-full blur-2xl"
               />

               <picture>
                  <source
                     srcSet={app_mobile}
                     media="(max-width: 768px)"
                  />
                  <img
                     className="-mb-px md:-mb-[4px] mx-auto w-full rounded-t-xl border border-border shadow-[0_-10px_32px_0px_#ebe9e8] max-md:max-w-[390px]"
                     src={app}
                     alt="App screenshot"
                  />
               </picture>
            </section>
         </main>
         <footer className="relative z-[2] border-border/75 border-t bg-background py-8 shadow-md md:py-12">
            <div className="mx-auto flex max-w-4xl flex-col justify-between gap-6 px-4 sm:flex-row">
               <div>
                  <Link
                     to="/"
                     className="flex items-center gap-3 font-medium font-secondary text-[1.725rem] tracking-tight"
                  >
                     <Logo className="size-9" />
                     Cue
                  </Link>
                  <p className="mt-6 text-foreground/75 text-sm transition-colors hover:text-foreground">
                     Cue is fully open-source.{" "}
                     <a
                        href="https://github.com/vasyaqwe/cue"
                        target="_blank"
                        rel="noreferrer"
                     >
                        <u>View it on Github</u>
                     </a>
                  </p>
               </div>
               <small className="mt-auto inline-block text-foreground/75 text-sm ">
                  {`© ${new Date().getFullYear()} Cue. All rights reserved.`}
               </small>
            </div>
         </footer>
      </div>
   )
}
