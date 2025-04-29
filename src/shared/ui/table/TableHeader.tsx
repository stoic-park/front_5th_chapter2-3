export const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return <thead className={className} {...props} />
}
