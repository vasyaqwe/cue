import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
   "/$slug/_layout/inbox/_layout/issue/$issueId",
)({
   component: () => <div>Hello /$slug/_layout/inbox/issue/$issueId!</div>,
})
