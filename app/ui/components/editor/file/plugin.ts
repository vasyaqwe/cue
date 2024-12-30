import { logger } from "@/lib/logger"
import { type EditorState, Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view"
import type * as React from "react"

const uploadKey = new PluginKey("upload-file")

export const uploadFile = ({ className }: { className?: string } = {}) =>
   new Plugin({
      key: uploadKey,
      state: {
         init() {
            return DecorationSet.empty
         },
         apply(tr, _set) {
            let set = _set.map(tr.mapping, tr.doc)
            // See if the transaction adds or removes any placeholders
            //@ts-expect-error - not yet sure what the type I need here
            const action = tr.getMeta(this)
            if (action?.add) {
               const { id, pos, src } = action.add

               const image = document.createElement("img")
               image.setAttribute("class", className ?? "")
               image.src = src
               const deco = Decoration.widget(pos + 1, image, {
                  id,
               })
               set = set.add(tr.doc, [deco])
            } else if (action?.remove) {
               set = set.remove(
                  set.find(
                     undefined,
                     undefined,
                     (spec) => spec.id === action.remove.id,
                  ),
               )
            }
            return set
         },
      },
      props: {
         decorations(state) {
            return this.getState(state)
         },
      },
   })

// biome-ignore lint/complexity/noBannedTypes: <explanation>
const findPlaceholder = (state: EditorState, id: {}) => {
   const decos = uploadKey.getState(state) as DecorationSet
   const found = decos.find(undefined, undefined, (spec) => spec.id === id)
   return found.length ? found[0]?.from : null // Return the position of the first placeholder
}

export type FileUploadOptions = {
   validateFn?: (file: File) => void
   onUpload: (file: File) => Promise<unknown>
}

export const createFileUpload =
   ({ validateFn, onUpload }: FileUploadOptions): UploadFn =>
   async (file, view, pos) => {
      // Validate the file first
      const validated = validateFn?.(file)
      if (!validated) return

      const id = {}
      const tr = view.state.tr
      if (!tr.selection.empty) tr.deleteSelection()

      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = async () => {
         tr.setMeta(uploadKey, {
            add: {
               id,
               pos,
               src: reader.result,
            },
         })

         view.dispatch(tr) // Dispatch the transaction with the placeholder

         try {
            const src = await onUpload(file) // Ensure onUpload completes

            const { schema } = view.state
            const placeholderPos = findPlaceholder(view.state, id)

            if (placeholderPos == null) return

            const imageSrc = typeof src === "object" ? reader.result : src
            const node = schema.nodes.image?.create({ src: imageSrc })
            if (!node) return

            const transaction = view.state.tr
               .replaceWith(placeholderPos, placeholderPos, node)
               .setMeta(uploadKey, { remove: { id } })

            view.dispatch(transaction)
         } catch (error) {
            logger.error("Upload error:", error)
            const transaction = view.state.tr
               .delete(pos, pos) // Optionally delete the placeholder if upload fails
               .setMeta(uploadKey, { remove: { id } })
            view.dispatch(transaction)
         }
      }
   }

export type UploadFn = (file: File, view: EditorView, pos: number) => void

export const onFilePaste = (
   view: EditorView,
   event: ClipboardEvent,
   uploadFn: UploadFn,
) => {
   if (event.clipboardData?.files.length) {
      event.preventDefault()
      const [file] = Array.from(event.clipboardData.files)
      const pos = view.state.selection.from

      if (file) uploadFn(file, view, pos)
      return true
   }
   return false
}

export const onFileDrop = (
   view: EditorView,
   event: DragEvent,
   moved: boolean,
   uploadFn: UploadFn,
) => {
   if (!moved && event.dataTransfer?.files.length) {
      event.preventDefault()
      const [file] = Array.from(event.dataTransfer.files)
      const coordinates = view.posAtCoords({
         left: event.clientX,
         top: event.clientY,
      })

      if (file) uploadFn(file, view, coordinates?.pos ?? 0 - 1)
      return true
   }
   return false
}

export const onFileInputChange = (
   view: EditorView,
   event: React.ChangeEvent<HTMLInputElement>,
   uploadFn: UploadFn,
) => {
   const file = event.target.files?.[0]
   if (file) {
      const pos = view.state.selection.from
      uploadFn(file, view, pos)
   }
}
