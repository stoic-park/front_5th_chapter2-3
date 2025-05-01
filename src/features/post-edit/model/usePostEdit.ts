import { updatePost } from "@/entities/post/api/postApi"
import { Post } from "@/entities/post/model/types"

export const usePostEdit = () => {
  const submit = async (postId: number, data: Partial<Post>) => {
    return await updatePost(postId, data)
  }

  return { submit }
}
