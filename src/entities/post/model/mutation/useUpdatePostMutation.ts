import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addPost } from "@/entities/post/api/postApi"
import { Post } from "@/entities/post/model/types"

export const useAddPostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newPost: Omit<Post, "id">) => addPost(newPost),

    onSuccess: (data) => {
      // 1. 기존 캐시를 업데이트 하거나
      queryClient.setQueryData(["posts"], (oldData: { posts: Post[]; total: number }) => {
        if (!oldData) return
        return {
          ...oldData,
          posts: [data, ...oldData.posts],
        }
      })

      // 2. 또는 refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },

    onError: (error) => {
      console.error("게시물 추가 실패:", error)
    },
  })
}
