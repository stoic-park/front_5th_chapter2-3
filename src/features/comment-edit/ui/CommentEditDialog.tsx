import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { Textarea, Button } from "@/shared/ui"
import { useState, useEffect } from "react"
import { Comment } from "@/entities/comment/model/types"
import { useCommentStore } from "@/features/comment-manage/model/useCommentStore"

interface CommentEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: Comment | null
}

// 역할: 댓글 내용 수정 UI + API 호출
// props: comment 객체, onOpenChange, onCommentUpdated
// 상태: body, loading (내부 useState)
// 의존: updateComment from entities/comment/api
// 제어: 열림/닫힘과 결과 갱신은 모두 외부에서 처리
export const CommentEditDialog = ({ open, onOpenChange, comment }: CommentEditDialogProps) => {
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const { edit } = useCommentStore()

  useEffect(() => {
    if (comment) {
      setBody(comment.body)
    }
  }, [comment])

  const handleUpdate = async () => {
    if (!comment) return
    setLoading(true)
    try {
      await edit({ ...comment, body })
      onOpenChange(false)
    } catch (e) {
      console.error("댓글 수정 오류", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "수정 중..." : "댓글 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
