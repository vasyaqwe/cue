import { queryOptions } from "@tanstack/react-query"
import * as organization from "./functions"

export const organizationMembershipsQuery = () =>
   queryOptions({
      queryKey: ["organization_memberships"],
      queryFn: () => organization.memberships(),
      staleTime: Infinity,
   })

export const organizationMembersQuery = ({
   organizationId,
}: { organizationId: string }) =>
   queryOptions({
      queryKey: ["organization_members"],
      queryFn: () => organization.members({ organizationId }),
   })
