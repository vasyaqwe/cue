import { Dialog, DialogContent, DialogTitle } from "@/ui/components/dialog"
import { Drawer, DrawerContent, DrawerTitle } from "@/ui/components/drawer"
import { useIsMobile } from "@/ui/hooks/use-is-mobile"
import { createContext, useContext } from "react"
import type { DialogProps } from "vaul"

const ModalContext = createContext<{
   isMobile: boolean
} | null>(null)

function ResponsiveModalWrapper(props: DialogProps) {
   const { isMobile } = useIsMobile()
   return (
      <ModalContext.Provider value={{ isMobile }}>
         {isMobile ? <Drawer {...props} /> : <Dialog {...props} />}
      </ModalContext.Provider>
   )
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ResponsiveModalContent({ ...props }: any) {
   const context = useContext(ModalContext)
   if (!context)
      throw new Error(
         "ResponsiveModalContent must be used within ModalProvider",
      )

   if (context.isMobile) {
      return <DrawerContent {...props} />
   }
   return <DialogContent {...props} />
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ResponsiveModalTitle({ ...props }: any) {
   const context = useContext(ModalContext)
   if (!context)
      throw new Error("ResponsiveModalTitle must be used within ModalProvider")

   if (context.isMobile) {
      return <DrawerTitle {...props} />
   }
   return <DialogTitle {...props} />
}

export { ResponsiveModalWrapper, ResponsiveModalContent, ResponsiveModalTitle }
