import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { Textarea, Button } from "@/shared/ui"
import { useState } from "react"
import { addComment } from "@/entities/comment/api/commentApi"
import { Comment } from "@/entities/comment/model/types"

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

  const handleAdd = async () => {
    if (!body.trim()) return
    setLoading(true)
    try {
      const newComment = await addComment({
        body,
        postId,
        userId,
        likes: 0,
        user: {
          id: userId,
          username: "", // 서버에서 채워줄 것으로 예상
          image: "",
        },
      })
      onCommentAdded?.(newComment)
      setBody("")
      onOpenChange(false)
    } catch (e) {
      console.error("댓글 추가 오류", e)
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
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? "추가 중..." : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
