import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { Post } from "@/entities/post/model/types"
import { CommentSection } from "@/widgets/comment-section/ui/CommentSection"
import { useCommentsByPostId } from "@/entities/comment/model/query"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  searchQuery: string
  highlightText: (text: string, highlight: string) => React.ReactNode
}

export const PostDetailDialog = ({ open, onOpenChange, post, searchQuery, highlightText }: PostDetailDialogProps) => {
  const { data: comments } = useCommentsByPostId(post?.id || 0, !!post)
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
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
