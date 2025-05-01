import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/shared/ui"
import { Post } from "@/entities/post/model/types"
import { PostRow } from "@/entities/post/ui/PostRow"

interface PostTableProps {
  posts: Post[]
  searchQuery: string
  selectedTag: string
  onClickTag: (tag: string) => void
  onClickEdit: (post: Post) => void
  onClickDelete: (postId: number) => void
  onClickDetail: (post: Post) => void
  onClickUser: (user: Post["author"]) => void
  highlightText: (text: string, highlight: string) => React.ReactNode
}

export const PostTable = ({
  posts,
  searchQuery,
  selectedTag,
  onClickTag,
  onClickEdit,
  onClickDelete,
  onClickDetail,
  onClickUser,
  highlightText,
}: PostTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <PostRow
              post={post}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              highlightText={highlightText}
              onClickTag={onClickTag}
              onClickEdit={onClickEdit}
              onClickDelete={onClickDelete}
              onClickDetail={onClickDetail}
              onClickUser={onClickUser}
            />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
