import { create } from "zustand"
import { Comment } from "./types"
import { fetchComments, addComment, updateComment, deleteComment, likeComment } from "../api/commentApi"

interface CommentStore {
  comments: Record<number, Comment[]> // postId 별 댓글 배열
  loading: boolean

  fetchComments: (postId: number) => Promise<void>
  addComment: (newComment: Omit<Comment, "id">) => Promise<void>
  updateComment: (updatedComment: Pick<Comment, "id" | "body" | "postId">) => Promise<void>
  deleteComment: (commentId: number, postId: number) => Promise<void>
  likeComment: (commentId: number, postId: number) => Promise<void>
}

export const useCommentStore = create<CommentStore>((set, get) => ({
  comments: {}, // 초기값: 비어있음
  loading: false,

  fetchComments: async (postId) => {
    if (get().comments[postId]) return // 이미 로드된 댓글은 다시 안 불러옴
    set({ loading: true })
    try {
      const data = await fetchComments(postId)
      set((state) => ({
        comments: { ...state.comments, [postId]: data.comments },
      }))
    } catch (error) {
      console.error("댓글 불러오기 실패:", error)
    } finally {
      set({ loading: false })
    }
  },

  addComment: async (newComment) => {
    try {
      const created = await addComment(newComment)
      set((state) => ({
        comments: {
          ...state.comments,
          [created.postId]: [...(state.comments[created.postId] || []), created],
        },
      }))
    } catch (error) {
      console.error("댓글 추가 실패:", error)
    }
  },

  updateComment: async (updatedComment) => {
    try {
      const updated = await updateComment(updatedComment)
      set((state) => ({
        comments: {
          ...state.comments,
          [updated.postId]: state.comments[updated.postId].map((c) =>
            c.id === updated.id ? { ...c, body: updated.body } : c,
          ),
        },
      }))
    } catch (error) {
      console.error("댓글 수정 실패:", error)
    }
  },

  deleteComment: async (commentId, postId) => {
    try {
      await deleteComment(commentId)
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: state.comments[postId].filter((c) => c.id !== commentId),
        },
      }))
    } catch (error) {
      console.error("댓글 삭제 실패:", error)
    }
  },

  likeComment: async (commentId, postId) => {
    try {
      const updated = await likeComment(commentId)
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: state.comments[postId].map((c) => (c.id === updated.id ? { ...c, likes: c.likes + 1 } : c)),
        },
      }))
    } catch (error) {
      console.error("댓글 좋아요 실패:", error)
    }
  },
}))
