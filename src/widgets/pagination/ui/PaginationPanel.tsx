import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Button } from "@/shared/ui"

interface PaginationPanelProps {
  skip: number
  limit: number
  total: number
  onChangeLimit: (limit: number) => void
  onClickPrev: () => void
  onClickNext: () => void
}

export const PaginationPanel = ({
  skip,
  limit,
  total,
  onChangeLimit,
  onClickPrev,
  onClickNext,
}: PaginationPanelProps) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => onChangeLimit(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={onClickPrev}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={onClickNext}>
          다음
        </Button>
      </div>
    </div>
  )
}
