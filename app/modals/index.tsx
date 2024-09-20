import { Content, ResponsiveModalWrapper } from "@/modals/dynamic"
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
      "example-modal": {
         Wrapper: ResponsiveModalWrapper,
         Component: ExampleModal,
      },
   },
})

function ExampleModal() {
   return (
      <Content>
         <div className="p-4">
            Lorem ipsum dsolor sit, amet consectetur adipisicing elit. Dolores,
            asperiores.
         </div>
      </Content>
   )
}
