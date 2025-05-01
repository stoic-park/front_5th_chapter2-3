import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { Textarea, Button } from "@/shared/ui"
import { useState } from "react"
import { useCommentStore } from "@/features/comment-manage/model/useCommentStore"

interface CommentAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: number
  userId: number
}

export const CommentAddDialog = ({ open, onOpenChange, postId, userId }: CommentAddDialogProps) => {
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const { add } = useCommentStore()

  const handleAdd = async () => {
    if (!body.trim()) return
    setLoading(true)
    try {
      await add({
        id: 0,
        body,
        postId,
        userId,
        likes: 0,
        user: {
          id: userId,
          username: "",
          image: "",
        },
      })
      setBody("")
      onOpenChange(false)
    } catch (e) {
      console.error("댓글 추가 실패:", e)
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
