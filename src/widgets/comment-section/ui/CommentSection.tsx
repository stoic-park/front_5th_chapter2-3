import { Button } from "@/shared/ui"
import { Plus, ThumbsUp, Edit2, Trash2 } from "lucide-react"
import { Comment } from "@/entities/comment/model/types"

import {
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useAddCommentMutation,
  useUpdateCommentMutation,
} from "@/entities/comment/model/mutation"

interface CommentSectionProps {
  comments: Comment[]
  postId: number
  searchQuery: string
  highlightText: (text: string, highlight: string) => React.ReactNode
}

export const CommentSection = ({ comments, postId, searchQuery, highlightText }: CommentSectionProps) => {
  const { mutate: deleteComment } = useDeleteCommentMutation()
  const { mutate: likeComment } = useLikeCommentMutation()
  const { mutate: addComment } = useAddCommentMutation()
  const { mutate: updateComment } = useUpdateCommentMutation()

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() =>
            addComment({
              body: "",
              postId,
              userId: 1,
              likes: 0,
              user: {
                id: 1,
                username: "",
                image: "",
              },
            })
          }
        >
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
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => updateComment({ id: comment.id, body: comment.body })}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment({ commentId: comment.id, postId })}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
