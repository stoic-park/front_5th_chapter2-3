import { updateComment } from "@/entities/comment/api/commentApi"

export const useCommentEdit = () => {
  const submit = async (commentId: number, data: { body: string }) => {
    return await updateComment({ id: commentId, body: data.body, postId: 0 })
  }

  return { submit }
}
