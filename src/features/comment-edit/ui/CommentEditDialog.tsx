import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@/shared/ui"
import { useState, useEffect } from "react"
import { Comment } from "@/entities/comment/model/types"
import { useUpdateCommentMutation } from "@/entities/comment/model/mutation"

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

  const { mutate: updateComment, isPending } = useUpdateCommentMutation()

  useEffect(() => {
    if (comment) {
      setBody(comment.body)
    }
  }, [comment])

  const handleUpdate = async () => {
    if (!comment || !body.trim()) return

    updateComment(
      { ...comment, body },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (error) => {
          console.error("댓글 수정 오류", error)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={handleUpdate} disabled={isPending}>
            {isPending ? "수정 중..." : "댓글 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
