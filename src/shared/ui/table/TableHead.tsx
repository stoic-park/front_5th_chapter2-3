export const TableHead = ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => {
  return <th className={className} {...props} />
}
