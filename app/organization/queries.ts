import { queryOptions } from "@tanstack/react-query"
import * as organization from "./functions"

export const organizationBySlugQuery = ({ slug }: { slug: string }) =>
   queryOptions({
      queryKey: ["organization_by_slug", slug],
      queryFn: () => organization.bySlug({ slug }),
      staleTime: Infinity,
   })

export const organizationMembersQuery = ({
   organizationId,
}: { organizationId: string }) =>
   queryOptions({
      queryKey: ["organization_members"],
      queryFn: () => organization.members({ organizationId }),
   })

export const organizationMembershipsQuery = () =>
   queryOptions({
      queryKey: ["organization_memberships"],
      queryFn: () => organization.memberships(),
   })
