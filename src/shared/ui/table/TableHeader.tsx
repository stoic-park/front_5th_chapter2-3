import React from "react"

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    return <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
  },
)
TableHeader.displayName = "TableHeader"
