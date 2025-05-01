import { useQuery } from "@tanstack/react-query"
import { fetchPostsByTag } from "@/entities/post/api/postApi"
import { Post } from "@/entities/post/model/types"

export const usePostsByTagQuery = (tag: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["posts-by-tag", tag],
    queryFn: () => fetchPostsByTag(tag),
    enabled: enabled && tag !== "all" && !!tag,
    staleTime: 1000 * 60,
    select: (data: { posts: Post[]; total: number }) => ({
      posts: data.posts,
      total: data.total,
    }),
  })
}
