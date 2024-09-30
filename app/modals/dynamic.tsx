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
import { useUIStore } from "@/ui/store"
import type { DialogTriggerProps } from "@radix-ui/react-dialog"
import type { DialogProps } from "vaul"

function Modal(props: DialogProps) {
   const isMobile = useUIStore().isMobile

   return <>{isMobile ? <Drawer {...props} /> : <Dialog {...props} />}</>
}

function ModalTrigger(props: DialogTriggerProps) {
   const isMobile = useUIStore().isMobile

   if (isMobile) return <DrawerTrigger {...props} />
   return <DialogTrigger {...props} />
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ModalHeader(props: any) {
   const isMobile = useUIStore().isMobile

   if (isMobile) return <DrawerHeader {...props} />
   return <DialogHeader {...props} />
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ModalFooter(props: any) {
   const isMobile = useUIStore().isMobile

   if (isMobile) return <DrawerFooter {...props} />
   return <DialogFooter {...props} />
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ModalContent(props: any) {
   const isMobile = useUIStore().isMobile

   if (isMobile) return <DrawerContent {...props} />
   return <DialogContent {...props} />
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ModalTitle(props: any) {
   const isMobile = useUIStore().isMobile

   if (isMobile) return <DrawerTitle {...props} />
   return <DialogTitle {...props} />
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ModalDescription(props: any) {
   const isMobile = useUIStore().isMobile

   if (isMobile) return <DrawerDescription {...props} />
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
