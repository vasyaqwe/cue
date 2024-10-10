import { organizationMembersQuery } from "@/organization/queries"
import { mentionLabelClassName } from "@/ui/components/editor/mention/constants"
import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from "@/ui/components/hover-card"
import { Loading } from "@/ui/components/loading"
import { UserAvatar } from "@/ui/components/user-avatar"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { useQuery } from "@tanstack/react-query"
import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react"

export function MentionLabel({ node }: NodeViewProps) {
   const { organizationId } = useAuth()
   const members = useQuery(organizationMembersQuery({ organizationId }))

   const userId = node.attrs.userId
   const user = members.data?.find(({ user }) => user.id === userId)?.user

   return (
      <NodeViewWrapper className="inline w-fit">
         <HoverCard
            openDelay={250}
            closeDelay={0}
         >
            <HoverCardTrigger>
               <span className={cn(mentionLabelClassName)}>
                  @{node.attrs.label}
               </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit max-w-[400px]">
               {members.isPending ? (
                  <Loading />
               ) : !user ? (
                  <>Error</>
               ) : (
                  <>
                     <div className="mb-4 flex items-center gap-3">
                        <UserAvatar
                           className="[&>img]:m-0"
                           user={user}
                        />
                        <p className="!my-0 font-semibold">{user.name}</p>
                     </div>
                     <hr className={cn("-mx-4 !my-1 border-border/75")} />
                     <p className="!mb-0 !mt-3 text-foreground/75 text-sm">
                        <svg
                           className="-mt-px mr-1.5 inline-block size-[18px]"
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth="1.5"
                           stroke="currentColor"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                           />
                        </svg>
                        <span className=" break-all">{user.email}</span>
                     </p>
                  </>
               )}
            </HoverCardContent>
         </HoverCard>
      </NodeViewWrapper>
   )
}
