import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@/shared/ui"
import { useState } from "react"
import { useAddCommentMutation } from "@/entities/comment/model/mutation"

interface CommentAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: number
  userId: number
}

export const CommentAddDialog = ({ open, onOpenChange, postId, userId }: CommentAddDialogProps) => {
  const [body, setBody] = useState("")

  const { mutate: addComment, isPending } = useAddCommentMutation()

  const handleAdd = async () => {
    if (!body.trim()) return

    addComment(
      {
        body,
        postId,
        userId,
        likes: 0,
        user: {
          id: userId,
          username: "",
          image: "",
        },
      },
      {
        onSuccess: () => {
          setBody("")
          onOpenChange(false)
        },
        onError: (error) => {
          console.error("댓글 추가 실패:", error)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={handleAdd} disabled={isPending}>
            {isPending ? "추가 중..." : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
