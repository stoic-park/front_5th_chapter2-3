import { CardContent } from "@/shared/ui"
import { PostFilterPanel } from "@/widgets/post-filters/ui/PostFilterPanel"
import { PostTable } from "@/widgets/post-table/ui/PostTable"
import { PaginationPanel } from "@/widgets/pagination/ui/PaginationPanel"
import { highlightText } from "@/shared/lib/highlightText"

import { Post } from "@/entities/post/model/types"
import { Tag } from "@/entities/post/model/types"
import { User } from "@/entities/user/model/types"

interface PostManagerPanelProps {
  loading: boolean
  posts: Post[]
  searchQuery: string
  selectedTag: string
  tags: Tag[]
  skip: number
  limit: number
  total: number
  sortBy: string
  sortOrder: string
  onChangeSearch: (value: string) => void
  onSearchSubmit: () => void
  onChangeTag: (tag: string) => void
  onChangeSortBy: (value: string) => void
  onChangeSortOrder: (value: string) => void
  onClickUser: (user?: User) => void
  onClickTag: (tag: string) => void
  onClickEdit: (post: Post) => void
  onClickDelete: (postId: number) => void
  onClickDetail: (post: Post) => void
  onChangeLimit: (value: number) => void
  onClickPrev: () => void
  onClickNext: () => void
}

export const PostManagerPanel = ({
  loading,
  posts,
  searchQuery,
  selectedTag,
  tags,
  skip,
  limit,
  total,
  sortBy,
  sortOrder,
  onChangeSearch,
  onSearchSubmit,
  onChangeTag,
  onChangeSortBy,
  onChangeSortOrder,
  onClickUser,
  onClickTag,
  onClickEdit,
  onClickDelete,
  onClickDetail,
  onChangeLimit,
  onClickPrev,
  onClickNext,
}: PostManagerPanelProps) => {
  return (
    <CardContent className="space-y-6">
      <PostFilterPanel
        searchQuery={searchQuery}
        selectedTag={selectedTag}
        sortBy={sortBy}
        sortOrder={sortOrder}
        tags={tags}
        onChangeSearch={onChangeSearch}
        onSearchSubmit={onSearchSubmit}
        onChangeTag={onChangeTag}
        onChangeSortBy={onChangeSortBy}
        onChangeSortOrder={onChangeSortOrder}
      />

      {loading ? (
        <div className="flex justify-center p-4">로딩 중...</div>
      ) : (
        <PostTable
          posts={posts}
          searchQuery={searchQuery}
          selectedTag={selectedTag}
          highlightText={highlightText}
          onClickUser={onClickUser}
          onClickTag={onClickTag}
          onClickEdit={onClickEdit}
          onClickDelete={onClickDelete}
          onClickDetail={onClickDetail}
        />
      )}

      <PaginationPanel
        skip={skip}
        limit={limit}
        total={total}
        onChangeLimit={onChangeLimit}
        onClickPrev={onClickPrev}
        onClickNext={onClickNext}
      />
    </CardContent>
  )
}
