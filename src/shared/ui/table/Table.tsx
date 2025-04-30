import React from "react"

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => {
    return <table ref={ref} className={`table-fixed w-full caption-bottom text-sm ${className}`} {...props} />
  },
)
Table.displayName = "Table"
