import { create } from "zustand"
import { Comment } from "@/entities/comment/model/types"
import { fetchComments, likeComment, deleteComment, addComment, updateComment } from "@/entities/comment/api/commentApi"

interface CommentState {
  commentsMap: Record<number, Comment[]>
  fetchByPostId: (postId: number) => Promise<void>
  like: (commentId: number) => Promise<void>
  remove: (commentId: number, postId: number) => Promise<void>
  add: (comment: Comment) => Promise<void>
  edit: (comment: Comment) => Promise<void>
}

export const useCommentStore = create<CommentState>((set, get) => ({
  commentsMap: {},

  fetchByPostId: async (postId) => {
    const { commentsMap } = get()
    if (commentsMap[postId]) return

    const data = await fetchComments(postId)
    set((state) => ({
      commentsMap: { ...state.commentsMap, [postId]: data },
    }))
  },

  like: async (commentId) => {
    const { commentsMap } = get()
    const postId = Object.keys(commentsMap).find((pid) => commentsMap[+pid]?.some((c) => c.id === commentId))
    if (!postId) return

    const updated = await likeComment(commentId)
    set((state) => ({
      commentsMap: {
        ...state.commentsMap,
        [+postId]: state.commentsMap[+postId].map((c) => (c.id === commentId ? updated : c)),
      },
    }))
  },

  remove: async (commentId, postId) => {
    await deleteComment(commentId)
    set((state) => ({
      commentsMap: {
        ...state.commentsMap,
        [postId]: state.commentsMap[postId]?.filter((c) => c.id !== commentId),
      },
    }))
  },

  add: async (comment) => {
    const added = await addComment(comment)
    const postId = added.postId
    set((state) => ({
      commentsMap: {
        ...state.commentsMap,
        [postId]: [...(state.commentsMap[postId] || []), added],
      },
    }))
  },

  edit: async (comment) => {
    const updated = await updateComment({ id: comment.id, body: comment.body, postId: comment.postId })
    const postId = updated.postId
    set((state) => ({
      commentsMap: {
        ...state.commentsMap,
        [postId]: state.commentsMap[postId]?.map((c) => (c.id === updated.id ? updated : c)),
      },
    }))
  },
}))
