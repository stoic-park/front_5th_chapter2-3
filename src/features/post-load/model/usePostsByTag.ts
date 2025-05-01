import { useState } from "react"
import { fetchPostsByTag } from "@/entities/post/api/postApi"
import { fetchUsers } from "@/entities/user/api/userApi"
import { Post } from "@/entities/post/model/types"
// import { User } from "@/entities/user/model/types"

export const usePostsByTag = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const loadByTag = async (tag: string) => {
    setLoading(true)
    try {
      const [res, users] = await Promise.all([fetchPostsByTag(tag), fetchUsers()])
      const postsWithAuthors = res.posts.map((post: Post) => ({
        ...post,
        author: users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithAuthors)
      setTotal(res.total)
    } catch (err) {
      console.error("태그별 게시물 불러오기 실패:", err)
    } finally {
      setLoading(false)
    }
  }

  return {
    posts,
    total,
    loading,
    loadByTag,
  }
}
