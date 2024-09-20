import { cn } from "@/ui/utils"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import type { ComponentProps } from "react"

function Avatar({
   className,
   ...props
}: ComponentProps<typeof AvatarPrimitive.Root>) {
   return (
      <AvatarPrimitive.Root
         className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className,
         )}
         {...props}
      />
   )
}

function AvatarImage({
   className,
   ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
   return (
      <AvatarPrimitive.Image
         className={cn("aspect-square h-full w-full", className)}
         {...props}
      />
   )
}

function AvatarFallback({
   className,
   ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
   return (
      <AvatarPrimitive.Fallback
         className={cn(
            "flex h-full w-full items-center justify-center rounded-full",
            className,
         )}
         {...props}
      />
   )
}

export { Avatar, AvatarFallback, AvatarImage }
