import type { IssueStatus } from "@/issue/schema"
import { cn } from "@/ui/utils"
import type { ComponentProps } from "react"

export function StatusIcon({
   status,
   className,
   ...props
}: { status: IssueStatus } & ComponentProps<"svg">) {
   const iconProps = {
      backlog: {
         color: "var(--color-foreground)",
         outerDasharray: "1.4 1.74",
         outerDashoffset: "0.65",
         innerRadius: "2",
         innerDasharray: "0 100",
      },
      todo: {
         color: "var(--color-foreground)",
         outerDasharray: "3.14 0",
         outerDashoffset: "-0.7",
         innerRadius: "2",
         innerDasharray: "0 100",
      },
      "in progress": {
         color: "#eab308",
         outerDasharray: "3.14 0",
         outerDashoffset: "-0.7",
         innerRadius: "2",
         innerDasharray: "6.2517693806436885 100",
      },
      done: {
         color: "var(--color-brand)",
         outerDasharray: "3.14 0",
         outerDashoffset: "-0.7",
         innerRadius: "3",
         innerDasharray: "18.84955592153876 100",
      },
   }

   const currentIcon = iconProps[status]

   return (
      <svg
         viewBox="0 0 14 14"
         fill="none"
         className={cn("size-[18px] transition-all duration-500", className)}
         {...props}
      >
         <circle
            cx="7"
            cy="7"
            r="6"
            fill="none"
            stroke={currentIcon.color}
            strokeWidth="2"
            strokeDasharray={currentIcon.outerDasharray}
            strokeDashoffset={currentIcon.outerDashoffset}
            className="transition-all duration-500"
         />
         <circle
            className="progress transition-all duration-500"
            cx="7"
            cy="7"
            r={currentIcon.innerRadius}
            fill="none"
            stroke={currentIcon.color}
            strokeWidth={status === "done" ? "6" : "4"}
            strokeDasharray={currentIcon.innerDasharray}
            strokeDashoffset="0"
            transform="rotate(-90 7 7)"
         />
         {status === "done" && (
            <path
               className="icon transition-all duration-500"
               stroke="none"
               fill={"white"}
               d="M10.951 4.24896C11.283 4.58091 11.283 5.11909 10.951 5.45104L5.95104 10.451C5.61909 10.783 5.0809 10.783 4.74896 10.451L2.74896 8.45104C2.41701 8.11909 2.41701 7.5809 2.74896 7.24896C3.0809 6.91701 3.61909 6.91701 3.95104 7.24896L5.35 8.64792L9.74896 4.24896C10.0809 3.91701 10.6191 3.91701 10.951 4.24896Z"
            />
         )}
      </svg>
   )
}
