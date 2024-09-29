import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/ui/components/dialog"
import {
   Drawer,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from "@/ui/components/drawer"
import { useIsMobile } from "@/ui/hooks/use-is-mobile"
import type { DialogTriggerProps } from "@radix-ui/react-dialog"

import { createContext, useContext } from "react"
import type { DialogProps } from "vaul"

const ModalContext = createContext<{
   isMobile: boolean
} | null>(null)

function Modal(props: DialogProps) {
   const { isMobile } = useIsMobile()
   return (
      <ModalContext.Provider value={{ isMobile }}>
         {isMobile ? <Drawer {...props} /> : <Dialog {...props} />}
      </ModalContext.Provider>
   )
}

function ModalTrigger(props: DialogTriggerProps) {
   const context = useContext(ModalContext)
   if (!context)
      throw new Error("ModalTrigger must be used within ModalProvider")

   if (context.isMobile) return <DrawerTrigger {...props} />
   return <DialogTrigger {...props} />
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ModalHeader(props: any) {
   const context = useContext(ModalContext)
   if (!context)
      throw new Error("ModalHeader must be used within ModalProvider")

   if (context.isMobile) return <DrawerHeader {...props} />
   return <DialogHeader {...props} />
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ModalFooter(props: any) {
   const context = useContext(ModalContext)
   if (!context)
      throw new Error("ModalFooter must be used within ModalProvider")

   if (context.isMobile) return <DrawerFooter {...props} />
   return <DialogFooter {...props} />
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ModalContent(props: any) {
   const context = useContext(ModalContext)
   if (!context)
      throw new Error("ModalContent must be used within ModalProvider")

   if (context.isMobile) return <DrawerContent {...props} />
   return <DialogContent {...props} />
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ModalTitle(props: any) {
   const context = useContext(ModalContext)
   if (!context) throw new Error("ModalTitle must be used within ModalProvider")

   if (context.isMobile) return <DrawerTitle {...props} />
   return <DialogTitle {...props} />
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ModalDescription(props: any) {
   const context = useContext(ModalContext)
   if (!context)
      throw new Error("ModalDescription must be used within ModalProvider")

   if (context.isMobile) return <DrawerDescription {...props} />
   return <DialogDescription {...props} />
}

export {
   Modal,
   ModalContent,
   ModalTitle,
   ModalTrigger,
   ModalDescription,
   ModalHeader,
   ModalFooter,
}
