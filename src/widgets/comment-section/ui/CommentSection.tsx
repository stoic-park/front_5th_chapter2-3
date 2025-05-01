import { Button } from "@/shared/ui"
import { Plus, ThumbsUp, Edit2, Trash2 } from "lucide-react"
import { Comment } from "@/entities/comment/model/types"

interface CommentSectionProps {
  comments: Comment[]
  postId: number
  searchQuery: string
  onClickEdit: (comment: Comment) => void
  onClickDelete: (commentId: number, postId: number) => void
  onClickLike: (commentId: number, postId: number) => void
  onClickAdd: (postId: number) => void
  highlightText: (text: string, highlight: string) => React.ReactNode
}

export const CommentSection = ({
  comments,
  postId,
  searchQuery,
  onClickEdit,
  onClickDelete,
  onClickLike,
  onClickAdd,
  highlightText,
}: CommentSectionProps) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => onClickAdd(postId)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onClickLike(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onClickEdit(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onClickDelete(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
