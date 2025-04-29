import { axiosInstance } from "../../../shared/api/axiosInstance"
import { Comment } from "../model/types"

// 특정 게시글(postId) 댓글 목록 가져오기
export const fetchComments = async (postId: number) => {
  const response = await axiosInstance.get(`/api/comments/post/${postId}`)
  return response.data // { comments: Comment[] }
}

// 댓글 추가
export const addComment = async (newComment: Omit<Comment, "id">) => {
  const response = await axiosInstance.post("/api/comments/add", newComment)
  return response.data // Comment
}

// 댓글 수정
export const updateComment = async (updatedComment: Pick<Comment, "id" | "body" | "postId">) => {
  const response = await axiosInstance.put(`/api/comments/${updatedComment.id}`, {
    body: updatedComment.body,
  })
  return response.data // Comment
}

// 댓글 삭제
export const deleteComment = async (commentId: number) => {
  await axiosInstance.delete(`/api/comments/${commentId}`)
}

// 댓글 좋아요 (like 1 증가)
export const likeComment = async (commentId: number) => {
  const response = await axiosInstance.patch(`/api/comments/${commentId}`, {
    likes: 1, // 서버가 현재 likes + 1 처리한다고 가정
  })
  return response.data // Comment
}
