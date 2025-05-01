import { useQuery } from "@tanstack/react-query"
import { fetchComments } from "@/entities/comment/api/commentApi"

export const useCommentsByPostId = (postId: number, enabled = true) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled,
    staleTime: 1000 * 60, // 1분
  })
}
