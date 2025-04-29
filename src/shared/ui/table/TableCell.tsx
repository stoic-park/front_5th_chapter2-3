export const TableCell = ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => {
  return <td className={className} {...props} />
}
