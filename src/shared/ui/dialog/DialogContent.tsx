import * as React from "react"
import { Portal, Overlay, Content, Close } from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithoutRef<typeof Content>
>(({ className = "", children, ...props }, ref) => (
  <Portal>
    <Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out" />
    <Content
      ref={ref}
      className={`fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg sm:rounded-lg md:w-full ${className}`}
      {...props}
    >
      {children}
      <Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
        <X className="h-4 w-4" />
        <span className="sr-only">닫기</span>
      </Close>
    </Content>
  </Portal>
))

DialogContent.displayName = Content.displayName
