// entities/post/model/types.ts

// 게시글(Post) 타입
export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: {
    id: number
    username: string
    image: string
  }
}

// 태그(Tag) 타입
export interface Tag {
  slug: string
  url: string
}
