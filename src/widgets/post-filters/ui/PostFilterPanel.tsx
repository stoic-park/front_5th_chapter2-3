import { Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shared/ui"
import { Search } from "lucide-react"

interface PostFilterPanelProps {
  searchQuery: string
  selectedTag: string
  sortBy: string
  sortOrder: string
  tags: { slug: string; url?: string }[]

  onChangeSearch: (value: string) => void
  onSearchSubmit: () => void
  onChangeTag: (value: string) => void
  onChangeSortBy: (value: string) => void
  onChangeSortOrder: (value: string) => void
}

export const PostFilterPanel = ({
  searchQuery,
  selectedTag,
  sortBy,
  sortOrder,
  tags,
  onChangeSearch,
  onSearchSubmit,
  onChangeTag,
  onChangeSortBy,
  onChangeSortOrder,
}: PostFilterPanelProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onChangeSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSearchSubmit()}
        />
      </div>

      <Select value={selectedTag} onValueChange={onChangeTag}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.slug} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onChangeSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={onChangeSortOrder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
