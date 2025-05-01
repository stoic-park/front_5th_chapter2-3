import { useQuery } from "@tanstack/react-query"
import { fetchPosts } from "@/entities/post/api/postApi"
import { Post } from "@/entities/post/model/types"

interface UsePostsQueryOptions {
  limit: number
  skip: number
}

export const usePostsQuery = ({ limit, skip }: UsePostsQueryOptions) => {
  return useQuery({
    queryKey: ["posts", { limit, skip }],
    queryFn: () => fetchPosts(limit, skip),
    staleTime: 1000 * 60, // 1분 동안 fresh 상태 유지
    // keepPreviousData: true, // 페이지네이션 시 이전 데이터 유지
    select: (data: { posts: Post[]; total: number }) => ({
      posts: data.posts,
      total: data.total,
    }),
  })
}
