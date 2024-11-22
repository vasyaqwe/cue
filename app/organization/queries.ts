import { queryOptions } from "@tanstack/react-query"
import * as organization from "./functions"

export const organizationBySlugQuery = ({ slug }: { slug: string }) =>
   queryOptions({
      queryKey: ["organization_by_slug", slug],
      queryFn: () => organization.bySlug({ data: { slug } }),
      staleTime: Infinity,
   })

export const organizationMembersQuery = ({
   organizationId,
}: { organizationId: string }) =>
   queryOptions({
      queryKey: ["organization_members", organizationId],
      queryFn: () => organization.members({ data: { organizationId } }),
   })

export const organizationTeammatesIdsQuery = ({
   organizationId,
}: { organizationId: string }) =>
   queryOptions({
      queryKey: ["organization_teammates_ids", organizationId],
      queryFn: () => organization.teammatesIds({ data: { organizationId } }),
   })

export const organizationMembershipsQuery = () =>
   queryOptions({
      queryKey: ["organization_memberships"],
      queryFn: () => organization.memberships(),
   })
