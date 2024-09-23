import { CreateIssue } from "@/issue/components/create-issue"
import {
   ResponsiveModalContent,
   ResponsiveModalWrapper,
} from "@/modals/dynamic"
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
         Wrapper: ResponsiveModalWrapper,
         Component: CreateIssue,
      },
   },
})

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
function ExampleModal() {
   return (
      <ResponsiveModalContent>
         <div className="p-4">
            Lorem ipsum dsolor sit, amet consectetur adipisicing elit. Dolores,
            asperiores.
         </div>
      </ResponsiveModalContent>
   )
}
