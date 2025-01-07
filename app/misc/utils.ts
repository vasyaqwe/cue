import type { StoreApi, UseBoundStore } from "zustand"

export const fileToBase64 = (file: File): Promise<string> => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
         // The result is a base64 string prefixed with data URL metadata
         const base64String = reader.result as string
         // Remove the prefix to get the pure base64 string
         const base64Data = base64String.split(",")[1]
         resolve(base64Data ?? "")
      }

      reader.onerror = () => {
         reject(new Error("Error reading file"))
      }

      // Read the file as a data URL (base64 string)
      reader.readAsDataURL(file)
   })
}

type WithSelectors<S> = S extends { getState: () => infer T }
   ? S & { use: { [K in keyof T]: () => T[K] } }
   : never

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
   _store: S,
) => {
   const store = _store as WithSelectors<typeof _store>
   store.use = {}
   for (const k of Object.keys(store.getState())) {
      // biome-ignore lint/suspicious/noExplicitAny: ...
      ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
   }

   return store
}
