// entities + post + api 조합이라면, FSD 구조상 "post"라는 비즈니스 엔티티에 대해 API 통신을 담당하는 코드가 들어있어야 합니다.

// entities/post/api/postApi.ts
import { Post, Tag } from "../model/types"

// 게시글 목록 가져오기
export const fetchPosts = async (limit: number, skip: number) => {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  const data = await response.json()
  return data // { posts: Post[], total: number }
}

// 태그 가져오기
export const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch("/api/posts/tags")
  const data = await response.json()
  return data
}

// 게시글 검색
export const searchPosts = async (searchQuery: string) => {
  const response = await fetch(`/api/posts/search?q=${searchQuery}`)
  const data = await response.json()
  return data // { posts: Post[], total: number }
}

// 태그별 게시글 가져오기
export const fetchPostsByTag = async (tag: string) => {
  const response = await fetch(`/api/posts/tag/${tag}`)
  const data = await response.json()
  return data // { posts: Post[], total: number }
}

// 게시글 추가
export const addPost = async (newPost: Omit<Post, "id">) => {
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  })
  const data = await response.json()
  return data // Post
}

// 게시글 수정
export const updatePost = async (postId: number, updatedPost: Partial<Post>) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPost),
  })
  const data = await response.json()
  return data // Post
}

// 게시글 삭제
export const deletePost = async (postId: number) => {
  await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
  })
}
