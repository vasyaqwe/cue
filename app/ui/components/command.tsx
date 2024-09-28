import { Icons } from "@/ui/components/icons"
import { useIsMobile } from "@/ui/hooks/use-is-mobile"
import { cn } from "@/ui/utils"
import { Command } from "cmdk"
import type { ComponentProps } from "react"

export function CommandItem({
   children,
   onSelect,
   className,
   destructive = false,
   inset = false,
   isSelected = false,
   value,
   ...props
}: {
   destructive?: boolean
   inset?: boolean
   isSelected?: boolean | undefined
   value?: string
} & ComponentProps<typeof Command.Item>) {
   const { isMobile } = useIsMobile()

   return (
      <Command.Item
         onSelect={() => {
            // if (isMobile) {
            document.dispatchEvent(
               new KeyboardEvent("keydown", {
                  key: "Escape",
               }),
            )
            // }
            onSelect?.(value ?? "")
         }}
         value={value}
         className={cn(
            "relative flex cursor-pointer select-none items-center gap-2.5 rounded-xl px-4 py-1.5 outline-none md:[&_svg]:size-5 max-md:h-12 max-md:active:scale-95 data-[disabled=true]:cursor-not-allowed md:gap-1.5 md:rounded-[8px] max-md:active:bg-border/75 md:data-[selected=true]:bg-border/50 md:px-2 max-md:text-[1.05rem] data-[disabled=true]:opacity-75 max-md:duration-300",
            inset && "pl-8",
            destructive
               ? "max-md:active:bg-destructive/95 md:data-[selected=true]:bg-destructive max-md:active:text-destructive-foreground md:data-[selected=true]:text-destructive-foreground"
               : "",
            className,
         )}
         {...props}
      >
         {children}
         <Icons.check
            strokeWidth={isMobile ? 4 : 2}
            className={cn(
               `ml-auto size-6 md:size-5`,
               isSelected ? "opacity-100" : "opacity-0",
            )}
         />
      </Command.Item>
   )
}
