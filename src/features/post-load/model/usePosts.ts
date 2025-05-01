import { useState } from "react"
import { Post } from "@/entities/post/model/types"
// import { User } from "@/entities/user/model/types"
import { fetchPosts } from "@/entities/post/api/postApi"
import { fetchUsers } from "@/entities/user/api/userApi"

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const loadPosts = async (limit: number, skip: number) => {
    setLoading(true)
    try {
      const [postRes, users] = await Promise.all([fetchPosts(limit, skip), fetchUsers()])
      const postsWithAuthors = postRes.posts.map((post: Post) => ({
        ...post,
        author: users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithAuthors)
      setTotal(postRes.total)
    } catch (err) {
      console.error("게시물 로드 실패:", err)
    } finally {
      setLoading(false)
    }
  }

  return {
    posts,
    total,
    loading,
    loadPosts,
  }
}
