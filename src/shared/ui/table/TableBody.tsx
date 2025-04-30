import React from "react"

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    return <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
  },
)
TableBody.displayName = "TableBody"
