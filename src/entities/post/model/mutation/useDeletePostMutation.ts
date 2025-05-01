import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost } from "@/entities/post/api/postApi"
import { Post } from "@/entities/post/model/types"

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),

    onSuccess: (_, deletedId) => {
      // 캐시에서 해당 post 제거
      queryClient.setQueryData(["posts"], (old: { posts: Post[]; total: number }) => {
        if (!old) return
        return {
          ...old,
          posts: old.posts.filter((post: Post) => post.id !== deletedId),
        }
      })
    },

    onError: (error) => {
      console.error("게시물 삭제 실패:", error)
    },
  })
}
