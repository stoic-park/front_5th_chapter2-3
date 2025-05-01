import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@/shared/ui"
import { Comment } from "@/entities/comment/model/types"
import { useCommentAdd } from "@/features/comment-add/model/useCommentAdd"

interface CommentAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: number
  userId: number
  onCommentAdded?: (comment: Comment) => void
}

export const CommentAddDialog = ({ open, onOpenChange, postId, userId, onCommentAdded }: CommentAddDialogProps) => {
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)

  const { submit } = useCommentAdd()

  const handleAdd = async () => {
    if (!body.trim()) return
    setLoading(true)
    try {
      const newComment: Comment = await submit({
        body,
        postId,
        userId,
        likes: 0,
        user: {
          id: userId,
          username: "",
          image: "",
        },
        id: 0,
      })
      onCommentAdded?.(newComment)
      setBody("")
      onOpenChange(false)
    } catch (error) {
      console.error("댓글 추가 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={handleAdd} disabled={loading || !body.trim()}>
            {loading ? "추가 중..." : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
