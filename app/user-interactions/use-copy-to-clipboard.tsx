import { toast } from "@/ui/components/toast"
import { useCallback, useState } from "react"

type CopiedValue = string | null

type CopyFn = (text: string) => Promise<boolean>

export function useCopyToClipboard(): {
   copy: CopyFn
   copiedText: CopiedValue
   isSuccess: boolean
} {
   const [copiedText, setCopiedText] = useState<CopiedValue>(null)
   const [isSuccess, setIsSuccess] = useState(false)

   const copy: CopyFn = useCallback(
      async (text) => {
         if (isSuccess) return false
         if (!navigator?.clipboard) {
            toast.warning("Clipboard not supported")
            return false
         }

         // Try to save to clipboard then save it in the state if worked
         try {
            await navigator.clipboard.writeText(text)
            setCopiedText(text)
            setIsSuccess(true)
            setTimeout(() => {
               setIsSuccess(false)
            }, 2000)
            return true
         } catch (error) {
            console.error("Failed to copy text: ", error)
            toast.error("Copy failed")
            setIsSuccess(false)
            setCopiedText(null)
            return false
         }
      },
      [isSuccess],
   )

   return {
      copy,
      copiedText,
      isSuccess,
   }
}
