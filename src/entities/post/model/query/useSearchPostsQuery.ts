import { useQuery } from "@tanstack/react-query"
import { searchPosts } from "@/entities/post/api/postApi"
import { Post } from "@/entities/post/model/types"

export const useSearchPostsQuery = (query: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["search-posts", query],
    queryFn: () => searchPosts(query),
    enabled: enabled && !!query.trim(),
    staleTime: 1000 * 60,
    select: (data: { posts: Post[]; total: number }) => ({
      posts: data.posts,
      total: data.total,
    }),
  })
}
