import { getRouteApi } from "@tanstack/react-router"

const LayoutRoute = getRouteApi("/_layout")

export function useUser() {
   return LayoutRoute.useRouteContext()
}
