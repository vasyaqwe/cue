import { cn } from "@/ui/utils"

export function Logo({
   className,
   rounded = false,
   ...props
}: React.ComponentProps<"div"> & { rounded?: boolean }) {
   return (
      <div
         className={cn(
            "size-12 shrink-0 drop-shadow-[0px_3px_3px_rgba(24,24,24,.1)]",
            className,
         )}
         {...props}
      >
         <div
            className={cn(
               rounded ? "rounded-full" : "squircle",
               "grid size-full transform-gpu place-content-center bg-background bg-gradient-to-b from-[#1e1448]/70 to-[#1e1448] text-background",
            )}
         >
            <svg
               viewBox="0 0 21 13"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
               style={{
                  filter: "drop-shadow(0px 3px 3px rgba(24, 24, 24, .25))",
               }}
               className="mx-auto w-full max-w-[60%]"
            >
               <path
                  d="M1 8.3333C1 8.3333 2.5 9 4.5 12C4.5 12 4.78485 11.5192 5.32133 10.7526M15 1C12.7085 2.14577 10.3119 4.55181 8.3879 6.8223"
                  stroke="currentColor"
                  strokeOpacity="0.7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               />
               <path
                  d="M6 8.3333C6 8.3333 7.5 9 9.5 12C9.5 12 15 3.5 20 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               />
            </svg>
         </div>
      </div>
   )
}
