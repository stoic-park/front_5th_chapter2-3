import { create } from "zustand"
import { Post } from "./types"
import { fetchPosts } from "../api/postApi"

interface PostStore {
  posts: Post[]
  loading: boolean
  fetchPosts: () => Promise<void>
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  loading: false,

  fetchPosts: async () => {
    set({ loading: true })
    try {
      const data = await fetchPosts(10, 0)
      set({ posts: data.posts })
    } catch (error) {
      console.error("게시물 가져오기 실패", error)
    } finally {
      set({ loading: false })
    }
  },
}))
