import { Comment } from "@/entities/comment/model/types"
import { Button } from "@/shared/ui"

interface CommentItemProps {
  comment: Comment
  postId: number
  highlight?: string
  onLike?: (commentId: number, postId: number) => void
  onEdit?: (comment: Comment) => void
  onDelete?: (commentId: number, postId: number) => void
}

// 순수하게 props를 받아서 comment에 대한 ui 를 담당하는 부분
export const CommentItem = ({ comment, postId, highlight = "", onLike, onEdit, onDelete }: CommentItemProps) => {
  const highlightText = (text: string) => {
    if (!highlight) return text
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))
  }

  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button onClick={() => onLike?.(comment.id, postId)}>👍 {comment.likes}</Button>
        <Button onClick={() => onEdit?.(comment)}>✏️</Button>
        <Button onClick={() => onDelete?.(comment.id, postId)}>🗑️</Button>
      </div>
    </div>
  )
}
