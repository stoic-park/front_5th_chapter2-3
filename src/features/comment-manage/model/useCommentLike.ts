import { Comment } from "@/entities/comment/model/types"
import { likeComment } from "@/entities/comment/api/commentApi"

export const useCommentLike = (
  commentsMap: Record<number, Comment[]>,
  setCommentsMap: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>,
) => {
  const like = async (commentId: number, postId: number) => {
    const target = commentsMap[postId]?.find((c) => c.id === commentId)
    if (!target) return

    const updated = await likeComment(commentId)
    setCommentsMap((prev) => ({
      ...prev,
      [postId]: prev[postId].map((c) => (c.id === commentId ? updated : c)),
    }))
  }

  return { like }
}
