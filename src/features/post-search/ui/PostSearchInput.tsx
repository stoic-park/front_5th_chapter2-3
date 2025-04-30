// src/features/post-search/ui/PostSearchInput.tsx

import { Input } from "@/shared/ui"
import { Search } from "lucide-react"

interface PostSearchInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

// 독립적인 기능을 담당, 이벤트 트리거, 이 기능에 해당하는 시각적 입력 UI
export const PostSearchInput = ({ value, onChange, onSubmit }: PostSearchInputProps) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-8"
        placeholder="게시물 검색..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit()
        }}
      />
    </div>
  )
}
