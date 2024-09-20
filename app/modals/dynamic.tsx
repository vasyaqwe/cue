import { createResponsiveWrapper } from "@/modals/responsive"
import { Dialog, DialogContent } from "@/ui/components/dialog"
import { Drawer, DrawerContent } from "@/ui/components/drawer"

export const { Content, Wrapper: ResponsiveModalWrapper } =
   createResponsiveWrapper({
      desktop: {
         Wrapper: Dialog,
         Content: DialogContent,
      },
      mobile: {
         Wrapper: Drawer,
         Content: DrawerContent,
      },
   })

function ResponsiveModalContent({
   children,
   ...props
}: Parameters<typeof Content>[0] & {
   variant?: "alert" | "overlay"
}) {
   return <Content {...props}>{children}</Content>
}

export { ResponsiveModalContent }
