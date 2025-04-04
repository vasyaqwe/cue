import { usePresenceStoreBase } from "@/presence/store"
import { Avatar, AvatarFallback } from "@/ui/components/avatar"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import type { User } from "@/user/schema"

import { match } from "ts-pattern"

type UserAvatarProps = React.ComponentProps<typeof Avatar> & {
   user: Omit<Partial<User>, "createdAt" | "updatedAt">
   showActiveIndicator?: boolean
   size?: number
}

export function UserAvatar({
   user,
   showActiveIndicator = true,
   className,
   children,
   ...props
}: UserAvatarProps) {
   const { user: currentUser } = useAuth()
   const name = match(user.name)
      .with(undefined, () => user.email?.[0]?.toUpperCase())
      .otherwise((name) => name[0]?.toUpperCase())

   const { isUserOnline } = usePresenceStoreBase()
   const isOnline = user.id === currentUser.id || isUserOnline(user.id ?? "")

   return (
      <Avatar
         {...props}
         className={cn(
            "relative block size-8 shrink-0 overflow-visible [--indicator-size:0.875rem]",
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
                  "bg-background font-semibold text-foreground/75 shadow-button",
                  className,
               )}
            >
               {name}
            </AvatarFallback>
         )}
         <span
            title={"Online"}
            role="status"
            className={cn(
               "-right-0.5 -bottom-0.5 absolute block size-[var(--indicator-size)] rounded-full border-[3px] border-background bg-green-500 transition-all duration-300",
               isOnline && showActiveIndicator
                  ? "visible scale-100 opacity-100"
                  : "invisible scale-0 opacity-0",
            )}
         />
         {children}
      </Avatar>
   )
}
