import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "@/shared/ui"
import { useAddPostMutation } from "@/entities/post/model/mutation"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const PostAddDialog = ({ open, onOpenChange }: Props) => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [userId, setUserId] = useState(1)

  const { mutate: addPost, isPending } = useAddPostMutation()

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return

    addPost(
      { title, body, userId },
      {
        onSuccess: () => {
          setTitle("")
          setBody("")
          setUserId(1)
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="내용" value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
          />
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "게시물 추가 중..." : "게시물 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
