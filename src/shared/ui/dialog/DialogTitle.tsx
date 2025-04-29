import * as React from "react"
import { Title } from "@radix-ui/react-dialog"

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof Title>,
  React.ComponentPropsWithoutRef<typeof Title>
>(({ className = "", ...props }, ref) => (
  <Title ref={ref} className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
))

DialogTitle.displayName = Title.displayName
