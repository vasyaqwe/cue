import { CreateIssue } from "@/issue/components/create-issue"
import { Modal, ModalContent } from "@/modals/dynamic"
import { createPushModal } from "@/modals/factory"

export const {
   pushModal,
   popModal,
   popAllModals,
   replaceWithModal,
   useOnPushModal,
   onPushModal,
   ModalProvider,
} = createPushModal({
   modals: {
      create_issue: {
         Wrapper: Modal,
         Component: CreateIssue,
      },
   },
})

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
function ExampleModal() {
   return (
      <ModalContent>
         <div className="p-4">
            Lorem ipsum dsolor sit, amet consectetur adipisicing elit. Dolores,
            asperiores.
         </div>
      </ModalContent>
   )
}
