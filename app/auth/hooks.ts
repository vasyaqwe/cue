import { getRouteApi } from "@tanstack/react-router"

const LayoutRoute = getRouteApi("/$slug/_layout")

export function useUser() {
   return LayoutRoute.useRouteContext()
}
