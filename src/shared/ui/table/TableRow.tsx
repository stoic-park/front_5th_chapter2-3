// interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => {
  return <tr className={className} {...props} />
}
