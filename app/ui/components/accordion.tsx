import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import * as React from "react"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
   React.ElementRef<typeof AccordionPrimitive.Item>,
   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ ...props }, ref) => (
   <AccordionPrimitive.Item
      ref={ref}
      {...props}
   />
))

const AccordionTrigger = React.forwardRef<
   React.ElementRef<typeof AccordionPrimitive.Trigger>,
   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
   <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
         ref={ref}
         className={cn(
            "flex items-center gap-1.5 [&[data-state=open]>svg]:rotate-0",
            className,
         )}
         {...props}
      >
         {children}
         <Icons.chevronDown className="-rotate-90 mt-px size-2 shrink-0 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
   </AccordionPrimitive.Header>
))

const AccordionContent = React.forwardRef<
   React.ElementRef<typeof AccordionPrimitive.Content>,
   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
   <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
   >
      <div className={cn("", className)}>{children}</div>
   </AccordionPrimitive.Content>
))

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
