import * as React from "react"
import { Portal, Content, Viewport } from "@radix-ui/react-select"

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithoutRef<typeof Content>
>(({ className = "", children, position = "popper", ...props }, ref) => (
  <Portal>
    <Content
      ref={ref}
      position={position}
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md ${className}`}
      {...props}
    >
      <Viewport className="p-1">{children}</Viewport>
    </Content>
  </Portal>
))

SelectContent.displayName = Content.displayName
