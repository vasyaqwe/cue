import { Homepage } from "@/routes/-components/homepage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/homepage")({
   component: Homepage,
})
