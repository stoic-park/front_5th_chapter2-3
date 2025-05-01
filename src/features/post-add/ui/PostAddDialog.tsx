import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { Input, Textarea, Button } from "@/shared/ui"
import { useState } from "react"
import { Post } from "@/entities/post/model/types"
import { usePostAdd } from "@/features/post-add/model/usePostAdd"

interface PostAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPostAdded?: (post: Post) => void
}

export const PostAddDialog = ({ open, onOpenChange, onPostAdded }: PostAddDialogProps) => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [userId, setUserId] = useState(1)

  const { submit } = usePostAdd()
  const handleSubmit = async () => {
    const newPost = await submit({ title, body, userId })
    onPostAdded?.(newPost)
    setTitle("")
    setBody("")
    setUserId(1)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea rows={30} placeholder="내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
          />
          <Button onClick={handleSubmit}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
