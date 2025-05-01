import { create } from "zustand"
import { fetchPosts, fetchPostsByTag, searchPosts } from "@/entities/post/api/postApi"
import { fetchUsers } from "@/entities/user/api/userApi"
import { Post } from "@/entities/post/model/types"
// import { User } from "@/entities/user/model/types"

interface PostStore {
  posts: Post[]
  total: number
  loading: boolean
  loadDefault: (limit: number, skip: number) => Promise<void>
  loadBySearch: (query: string) => Promise<void>
  loadByTag: (tag: string) => Promise<void>
  setPosts: (posts: Post[]) => void
  removePost: (id: number) => void
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  total: 0,
  loading: false,

  loadDefault: async (limit, skip) => {
    set({ loading: true })
    try {
      const [res, users] = await Promise.all([fetchPosts(limit, skip), fetchUsers()])
      const postsWithAuthors = res.posts.map((post: Post) => ({
        ...post,
        author: users.find((user) => user.id === post.userId),
      }))
      set({ posts: postsWithAuthors, total: res.total })
    } catch (e) {
      console.error("게시물 로딩 실패:", e)
    } finally {
      set({ loading: false })
    }
  },

  loadBySearch: async (query) => {
    set({ loading: true })
    try {
      const [res, users] = await Promise.all([searchPosts(query), fetchUsers()])
      const postsWithAuthors = res.posts.map((post: Post) => ({
        ...post,
        author: users.find((user) => user.id === post.userId),
      }))
      set({ posts: postsWithAuthors, total: res.total })
    } catch (e) {
      console.error("검색 실패:", e)
    } finally {
      set({ loading: false })
    }
  },

  loadByTag: async (tag) => {
    if (!tag || tag === "all") return
    set({ loading: true })
    try {
      const [res, users] = await Promise.all([fetchPostsByTag(tag), fetchUsers()])
      const postsWithAuthors = res.posts.map((post: Post) => ({
        ...post,
        author: users.find((user) => user.id === post.userId),
      }))
      set({ posts: postsWithAuthors, total: res.total })
    } catch (e) {
      console.error("태그 로딩 실패:", e)
    } finally {
      set({ loading: false })
    }
  },

  setPosts: (posts) => set({ posts }),

  removePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    })),
}))
