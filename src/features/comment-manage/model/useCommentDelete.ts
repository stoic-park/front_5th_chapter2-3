import { deleteComment } from "@/entities/comment/api/commentApi"
import { Comment } from "@/entities/comment/model/types"

export const useCommentDelete = (
  //   commentsMap: Record<number, Comment[]>,
  setCommentsMap: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>,
) => {
  const remove = async (commentId: number, postId: number) => {
    await deleteComment(commentId)
    setCommentsMap((prev) => ({
      ...prev,
      [postId]: prev[postId].filter((c) => c.id !== commentId),
    }))
  }

  return { remove }
}
