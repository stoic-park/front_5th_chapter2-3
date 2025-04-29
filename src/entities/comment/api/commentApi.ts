import { axiosInstance } from "../../../shared/api/axiosInstance"
import { Comment } from "../model/types"

// 댓글 가져오기 (특정 게시물)
export const fetchComments = async (postId: number) => {
  const response = await axiosInstance.get(`/comments/post/${postId}`)
  return response.data.comments as Comment[]
}

// 댓글 추가
export const addComment = async (newComment: Omit<Comment, "id" | "likes" | "user">) => {
  const response = await axiosInstance.post("/comments/add", newComment)
  return response.data as Comment
}

// 댓글 수정
export const updateComment = async (commentId: number, body: string) => {
  const response = await axiosInstance.put(`/comments/${commentId}`, { body })
  return response.data as Comment
}

// 댓글 삭제
export const deleteComment = async (commentId: number) => {
  await axiosInstance.delete(`/comments/${commentId}`)
}

// 댓글 좋아요
export const likeComment = async (commentId: number, currentLikes: number) => {
  const response = await axiosInstance.patch(`/comments/${commentId}`, { likes: currentLikes + 1 })
  return response.data as Comment
}
