import { queryOptions } from "@tanstack/react-query"
import * as organization from "./functions"

export const organizationMembershipsQuery = () =>
   queryOptions({
      queryKey: ["organizations_memberships"],
      queryFn: () => organization.memberships(),
   })
