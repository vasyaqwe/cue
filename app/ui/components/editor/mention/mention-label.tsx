import { StatusIcon } from "@/issue/components/icons"
import { issueListQuery } from "@/issue/queries"
import type { IssueStatus } from "@/issue/schema"
import { organizationMembersQuery } from "@/organization/queries"
import {
   mentionLabelIssueClassName,
   mentionLabelPersonClassName,
} from "@/ui/components/editor/mention/constants"
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
import { Link, useParams } from "@tanstack/react-router"
import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react"

export function MentionLabel({ node }: NodeViewProps) {
   const { organizationId } = useAuth()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const members = useQuery(organizationMembersQuery({ organizationId }))
   const issues = useQuery(issueListQuery({ organizationId }))

   const label = node.attrs.label as string | undefined
   const userId = node.attrs.userId as string | undefined
   const issueId = node.attrs.issueId as string | undefined
   const status = node.attrs.status as IssueStatus | undefined
   const user = members.data?.find(({ user }) => user.id === userId)?.user
   const issue = issues.data?.find(({ id }) => id === issueId)

   const isIssueError = issues.isError || !issue

   return (
      <NodeViewWrapper className="inline w-fit">
         {issueId ? (
            <Link
               to={"/$slug/issue/$issueId"}
               params={{
                  issueId,
                  slug,
               }}
               className={cn(
                  cn(
                     mentionLabelIssueClassName,
                     issues.isPending ? "text-transparent" : "",
                  ),
               )}
            >
               {isIssueError && status ? (
                  <>
                     <StatusIcon
                        status={status}
                        className="-mt-1 mr-1 inline-block size-4"
                     />
                     {label}
                  </>
               ) : issues.isPending ? (
                  <>@{label}</>
               ) : issue ? (
                  <>
                     <StatusIcon
                        className="-mt-1 mr-1 inline-block size-4"
                        status={issue.status}
                     />
                     {issue.title}
                  </>
               ) : null}
            </Link>
         ) : userId ? (
            <HoverCard
               openDelay={250}
               closeDelay={0}
            >
               <HoverCardTrigger>
                  <span className={cn(mentionLabelPersonClassName)}>
                     @{label}
                  </span>
               </HoverCardTrigger>
               <HoverCardContent className="w-fit max-w-[400px]">
                  {members.isPending ? (
                     <Loading />
                  ) : !user ? (
                     <p className="text-base text-foreground/75">
                        Couldn't find this person.
                     </p>
                  ) : (
                     <>
                        <div className="mb-4 flex items-center gap-3">
                           <UserAvatar
                              className="size-7 [--indicator-size:0.75rem] [&>img]:m-0"
                              user={user}
                           />
                           <p className="!my-0 font-semibold text-base">
                              {user.name}
                           </p>
                        </div>
                        <hr className={cn("-mx-4 !my-1 border-border/75")} />
                        <p className="!mb-0 !mt-3 font-medium text-foreground/75 text-sm">
                           <svg
                              className="-mt-px mr-1.5 inline-block size-[18px]"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
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
         ) : null}
      </NodeViewWrapper>
   )
}
