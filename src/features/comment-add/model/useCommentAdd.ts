import { addComment } from "@/entities/comment/api/commentApi"
import { Comment } from "@/entities/comment/model/types"

export const useCommentAdd = () => {
  const submit = async (comment: Comment) => {
    return await addComment(comment)
  }

  return { submit }
}
