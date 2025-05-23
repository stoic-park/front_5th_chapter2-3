// entities + post + api 조합이라면, FSD 구조상 "post"라는 비즈니스 엔티티에 대해 API 통신을 담당하는 코드가 들어있어야 합니다.
import { Post, Tag } from "../model/types"
import { axiosInstance } from "../../../shared/api/axiosInstance"

// 게시글 목록 가져오기
export const fetchPosts = async (limit: number, skip: number) => {
  const response = await axiosInstance.get(`/posts?limit=${limit}&skip=${skip}`)
  return response.data
}

// 태그 가져오기
export const fetchTags = async (): Promise<Tag[]> => {
  const response = await axiosInstance.get("/posts/tags")
  return response.data
}

// 게시글 검색
export const searchPosts = async (searchQuery: string) => {
  const response = await axiosInstance.get(`/posts/search?q=${searchQuery}`)
  return response.data
}

// 태그별 게시글 가져오기
export const fetchPostsByTag = async (tag: string) => {
  const response = await axiosInstance.get(`/posts/tag/${tag}`)
  return response.data
}

// 게시글 추가
export const addPost = async (newPost: Omit<Post, "id">) => {
  const response = await axiosInstance.post("/posts/add", newPost)
  return response.data
}

// 게시글 수정
export const updatePost = async (postId: number, updatedPost: Partial<Post>) => {
  const response = await axiosInstance.put(`/posts/${postId}`, updatedPost)
  return response.data
}

// 게시글 삭제
export const deletePost = async (postId: number) => {
  await axiosInstance.delete(`/posts/${postId}`)
}
