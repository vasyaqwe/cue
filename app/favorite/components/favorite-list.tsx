import { favoriteListQuery } from "@/favorite/queries"
import { useLocalStorage } from "@/interactions/use-local-storage"
import { StatusIcon } from "@/issue/components/icons"
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/ui/components/accordion"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"
import { match } from "ts-pattern"

export function FavoriteList() {
   const { organizationId } = useAuth()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const favorites = useQuery(
      favoriteListQuery({ organizationId: organizationId }),
   )

   const [value, setValue] = useLocalStorage(`favs_value_${slug}`, "favorites")

   return (
      <>
         {favorites.isError || favorites.isPending ? null : favorites.data
              .length === 0 ? null : (
            <>
               <Accordion
                  type="single"
                  value={value}
                  onValueChange={(value) => setValue(value)}
                  collapsible
                  className="animate-fade-in [--animation-delay:0ms] [--animation-duration:250ms]"
               >
                  <AccordionItem value="favorites">
                     <AccordionTrigger className="mt-3 w-full cursor-pointer rounded-lg py-3 pl-1 text-foreground/75 leading-none transition-colors md:mb-1.5 hover:bg-border/50 md:py-2 md:pl-3">
                        Favorites
                     </AccordionTrigger>
                     <AccordionContent asChild>
                        <ul className="md:space-y-0.5">
                           {favorites.data.map((favorite) =>
                              match(favorite.entityType)
                                 .with("issue", () => (
                                    <li key={favorite.id}>
                                       <Link
                                          params={{
                                             slug,
                                             issueId: favorite.entityId,
                                          }}
                                          activeProps={{
                                             className:
                                                "md:!border-border/80 bg-border/50 max-md:scale-95 md:bg-elevated md:opacity-100",
                                             "aria-current": "page",
                                          }}
                                          activeOptions={{ exact: true }}
                                          to={"/$slug/issue/$issueId"}
                                          className={cn(
                                             "group max-md:-mx-2 flex h-10 items-center gap-[11px] rounded-[13px] border border-transparent px-2 font-semibold transition-all md:h-9 max-md:active:scale-95 md:rounded-[11px] max-md:active:bg-border/50 md:px-2.5 md:text-[0.925rem] hover:opacity-100 md:opacity-80 max-md:transition-all max-md:duration-300",
                                          )}
                                       >
                                          <StatusIcon
                                             className="ml-[3px] size-[18px]"
                                             status={favorite.issue.status}
                                          />
                                          <span className="nav-link-text line-clamp-1 break-all">
                                             {favorite.issue.title}
                                          </span>
                                       </Link>
                                    </li>
                                 ))
                                 .otherwise(() => null),
                           )}
                        </ul>
                     </AccordionContent>
                  </AccordionItem>
               </Accordion>
            </>
         )}
      </>
   )
}
