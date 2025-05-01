import { useState } from "react"
import { Post } from "@/entities/post/model/types"
import { fetchUsers } from "@/entities/user/api/userApi"
import { searchPosts } from "@/entities/post/api/postApi"
// import { User } from "@/entities/user/model/types"

export const useSearchPosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const search = async (query: string) => {
    setLoading(true)
    try {
      const [res, users] = await Promise.all([searchPosts(query), fetchUsers()])
      const postsWithAuthors = res.posts.map((post: Post) => ({
        ...post,
        author: users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithAuthors)
      setTotal(res.total)
    } catch (err) {
      console.error("검색 실패:", err)
    } finally {
      setLoading(false)
    }
  }

  return {
    posts,
    total,
    loading,
    search,
  }
}
