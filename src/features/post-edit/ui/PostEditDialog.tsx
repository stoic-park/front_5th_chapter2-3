import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "@/shared/ui"
import { useState, useEffect } from "react"
import { Post } from "@/entities/post/model/types"
import { useUpdatePostMutation } from "@/entities/post/model/mutation"

interface PostEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
}

// 역할: 게시물 수정 다이얼로그 + update API 호출
// props: 수정할 post, 완료 시 콜백
// 상태: title, body, loading (내부 useState)
// 외부 의존: entities/post/api/updatePost, shared/ui
export const PostEditDialog = ({ open, onOpenChange, post }: PostEditDialogProps) => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const { mutate: updatePost, isPending } = useUpdatePostMutation()

  // 초기값 세팅
  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setBody(post.body)
    }
  }, [post])

  const handleSubmit = async () => {
    if (!post) return
    updatePost(
      {
        id: post.id,
        title,
        body,
        userId: post.userId,
        tags: post.tags,
        reactions: post.reactions,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea rows={15} placeholder="내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "게시물 업데이트 중..." : "게시물 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
