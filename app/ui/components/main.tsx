import { cn } from "@/ui/utils";
import type { ComponentProps } from "react";

export function Main({className, children,...props}: ComponentProps<"main">) {
   return <main className={cn("relative w-full flex-1",className)} {...props}>{children}</main>
}