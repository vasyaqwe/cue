import * as Dialog from "@radix-ui/react-dialog"
import { useNavigate, useSearch } from "@tanstack/react-router"
import mitt, { type Handler } from "mitt"
import { type ComponentType, type ReactNode, Suspense, useEffect } from "react"

type CreatePushModalOptions<T> = {
   modals: {
      [key in keyof T]:
         | {
              Wrapper: ComponentType<{
                 open: boolean
                 onOpenChange: (open?: boolean) => void
                 children: ReactNode
                 defaultOpen?: boolean
              }>
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              Component: ComponentType<any>
           }
         | ComponentType<T[key]>
   }
}

export function createPushModal<T>({ modals }: CreatePushModalOptions<T>) {
   type Modals = typeof modals
   type ModalKeys = keyof Modals

   type EventHandlers = {
      change: { name: ModalKeys; open: boolean }
      push: ModalKeys
      replace: ModalKeys
      pop?: ModalKeys
      popAll: undefined
   }

   const emitter = mitt<EventHandlers>()

   function ModalProvider() {
      const navigate = useNavigate({ from: "/" })
      const search = useSearch({ strict: false })

      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      useEffect(() => {
         const pushHandler: Handler<EventHandlers["push"]> = (name) => {
            emitter.emit("change", { name, open: true })
            navigate({
               search: (prev) => ({ ...prev, [name]: true }),
               replace: true,
            })
         }
         const replaceHandler: Handler<EventHandlers["replace"]> = (name) => {
            emitter.emit("change", { name, open: true })
            navigate({
               search: (prev) => ({ ...prev, [name]: true }),
               replace: true,
            })
         }

         const popHandler: Handler<EventHandlers["pop"]> = (name) => {
            if (name) {
               emitter.emit("change", { name, open: false })
               navigate({
                  search: (prev) => ({ ...prev, [name]: undefined }),
                  replace: true,
               })
            } else {
               const currentModal = Object.keys(search).find(
                  (key) => key in search,
               )
               if (currentModal) {
                  emitter.emit("change", {
                     name: currentModal as ModalKeys,
                     open: false,
                  })
                  if (!name) return
                  navigate({
                     search: (prev) => ({ ...prev, [name]: undefined }),
                     replace: true,
                  })
               }
            }
         }

         const popAllHandler: Handler<EventHandlers["popAll"]> = () => {
            navigate({
               search: (prev: Record<string, never>) => {
                  const openedModals = Object.keys(modals).filter(
                     (m) => m in search,
                  )
                  // biome-ignore lint/complexity/noForEach: <explanation>
                  openedModals.forEach((key) => {
                     delete prev[key] // Remove each key from the search object
                  })
                  return prev
               },
               replace: true,
            })
         }

         emitter.on("push", pushHandler)
         emitter.on("replace", replaceHandler)
         emitter.on("pop", popHandler)
         emitter.on("popAll", popAllHandler)

         return () => {
            emitter.off("push", pushHandler)
            emitter.off("replace", replaceHandler)
            emitter.off("pop", popHandler)
            emitter.off("popAll", popAllHandler)
         }
      }, [modals])

      return (
         <>
            {Object.keys(modals).map((modalName) => {
               const isOpen = modalName in search
               const modal = modals[modalName as ModalKeys]
               const Component =
                  "Component" in modal
                     ? modal.Component
                     : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                       (modal as ComponentType<any>)
               const Root = "Wrapper" in modal ? modal.Wrapper : Dialog.Root

               return (
                  <Root
                     key={modalName}
                     open={isOpen}
                     onOpenChange={(isOpen) => {
                        if (!isOpen) {
                           popModal(modalName as ModalKeys)
                        }
                     }}
                  >
                     <Suspense>
                        <Component />
                     </Suspense>
                  </Root>
               )
            })}
         </>
      )
   }

   const pushModal = <T extends ModalKeys>(name: T) =>
      emitter.emit("push", name)

   const popModal = (name?: ModalKeys) => emitter.emit("pop", name)

   const replaceWithModal = <T extends ModalKeys>(name: T) =>
      emitter.emit("replace", name)

   const popAllModals = () => emitter.emit("popAll")

   type EventCallback<T extends ModalKeys> = (open: boolean, name?: T) => void

   const onPushModal = <T extends ModalKeys>(
      name: T | "*",
      callback: EventCallback<T>,
   ) => {
      const fn: Handler<EventHandlers["change"]> = (payload) => {
         if (payload.name === name) {
            callback(payload.open, payload.name as T)
         } else if (name === "*") {
            callback(payload.open, payload.name as T)
         }
      }

      emitter.on("change", fn)

      return () => emitter.off("change", fn)
   }

   return {
      ModalProvider,
      pushModal,
      popModal,
      popAllModals,
      replaceWithModal,
      onPushModal,
      useOnPushModal: <T extends ModalKeys>(
         name: T | "*",
         callback: EventCallback<T>,
      ) => {
         useEffect(() => {
            return onPushModal(name, callback)
         }, [name, callback])
      },
   }
}
