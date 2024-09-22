import { organizationMembershipsFn } from "@/organization/functions"
import { queryOptions } from "@tanstack/react-query"

export const organizationMembershipsQuery = () =>
   queryOptions({
      queryKey: ["organizations_memberships"],
      queryFn: () => organizationMembershipsFn(),
   })
