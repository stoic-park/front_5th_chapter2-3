import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePost } from "@/entities/post/api/postApi"
import { Post } from "@/entities/post/model/types"

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updatedPost: Post) => updatePost(updatedPost.id, updatedPost),

    onSuccess: (data) => {
      queryClient.setQueryData(["posts"], (oldData: { posts: Post[]; total: number }) => {
        if (!oldData) return
        return {
          ...oldData,
          posts: oldData.posts.map((post) => (post.id === data.id ? data : post)),
        }
      })
    },

    onError: (error) => {
      console.error("게시물 수정 실패:", error)
    },
  })
}
