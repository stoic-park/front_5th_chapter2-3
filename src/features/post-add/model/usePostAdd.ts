import { addPost } from "@/entities/post/api/postApi"
import { Post } from "@/entities/post/model/types"

export const usePostAdd = () => {
  const submit = async (post: Omit<Post, "id">) => {
    return await addPost(post)
  }

  return { submit }
}
