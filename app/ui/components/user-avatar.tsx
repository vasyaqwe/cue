import type { User } from "@/db/schema"
import { Avatar, AvatarFallback } from "@/ui/components/avatar"
import { cn } from "@/ui/utils"
import type { ComponentProps } from "react"

type UserAvatarProps = ComponentProps<typeof Avatar> & {
   user: Partial<User>
   showActiveIndicator?: boolean
   size?: number
}

export function UserAvatar({
   user,
   showActiveIndicator = true,
   className,
   ...props
}: UserAvatarProps) {
   const name =
      user.name && user.name !== ""
         ? user.name[0]?.toUpperCase()
         : user.email?.[0]?.toUpperCase() ?? "?"

   return (
      <Avatar
         {...props}
         className={cn(
            "relative block size-8 overflow-visible [--online-indicator-size:0.875rem]",
            className,
         )}
      >
         {user.avatarUrl ? (
            <img
               src={user.avatarUrl}
               alt={name}
               referrerPolicy="no-referrer"
               className={cn(
                  "grid h-[inherit] w-full place-content-center rounded-full object-cover object-top",
               )}
            />
         ) : (
            <AvatarFallback
               className={cn(
                  "border bg-background text-foreground/75 shadow-inner",
                  className,
               )}
            >
               {name}
            </AvatarFallback>
         )}
         {/* <span
            title={"Online"}
            role="status"
            data-online-indicator
            className={cn(
               "-right-0.5 -bottom-0.5 absolute block size-[var(--online-indicator-size)] rounded-full border-[3px] border-background bg-green-500 transition-all duration-300",
               isOnline && showActiveIndicator
                  ? "visible scale-100 opacity-100"
                  : "invisible scale-0 opacity-0",
            )}
         /> */}
      </Avatar>
   )
}
