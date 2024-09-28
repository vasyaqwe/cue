import { CreateIssue } from "@/issue/components/create-issue"
import { ModalContent, ModalWrapper } from "@/modals/dynamic"
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
      "create-issue": {
         Wrapper: ModalWrapper,
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
