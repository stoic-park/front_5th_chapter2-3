import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { Post } from "@/entities/post/model/types"
import { Comment } from "@/entities/comment/model/types"
import { CommentSection } from "@/widgets/comment-section/ui/CommentSection"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  post: Post | null
  comments: Comment[]
  searchQuery: string

  onClickAddComment: (postId: number) => void
  onClickEditComment: (comment: Comment) => void
  onClickDeleteComment: (commentId: number, postId: number) => void
  onClickLikeComment: (commentId: number, postId: number) => void

  highlightText: (text: string, highlight: string) => React.ReactNode
}

export const PostDetailDialog = ({
  open,
  onOpenChange,
  post,
  comments,
  searchQuery,
  onClickAddComment,
  onClickEditComment,
  onClickDeleteComment,
  onClickLikeComment,
  highlightText,
}: PostDetailDialogProps) => {
  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post.body, searchQuery)}</p>
          <CommentSection
            comments={comments}
            postId={post.id}
            searchQuery={searchQuery}
            highlightText={highlightText}
            onClickAdd={onClickAddComment}
            onClickEdit={onClickEditComment}
            onClickDelete={onClickDeleteComment}
            onClickLike={onClickLikeComment}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
