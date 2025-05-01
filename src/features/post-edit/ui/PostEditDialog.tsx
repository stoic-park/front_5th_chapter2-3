import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { Input, Textarea, Button } from "@/shared/ui"
import { useState, useEffect } from "react"
import { Post } from "@/entities/post/model/types"
import { usePostEdit } from "@/features/post-edit/model/usePostEdit"
interface PostEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  onPostUpdated?: (updated: Post) => void
}

// 역할: 게시물 수정 다이얼로그 + update API 호출
// props: 수정할 post, 완료 시 콜백
// 상태: title, body, loading (내부 useState)
// 외부 의존: entities/post/api/updatePost, shared/ui
export const PostEditDialog = ({ open, onOpenChange, post, onPostUpdated }: PostEditDialogProps) => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)

  const { submit } = usePostEdit()

  // 초기값 세팅
  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setBody(post.body)
    }
  }, [post])

  const handleSubmit = async () => {
    if (!post) return
    setLoading(true)
    try {
      const updated = await submit(post.id, { title, body })
      onPostUpdated?.(updated)
      onOpenChange(false)
    } catch (e) {
      console.error("게시물 수정 오류", e)
    } finally {
      setLoading(false)
    }
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
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "수정 중..." : "게시물 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
