import { useState } from "react"
import { fetchComments } from "@/entities/comment/api/commentApi"
import { Comment } from "@/entities/comment/model/types"

export const useCommentLoad = () => {
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({})

  const load = async (postId: number) => {
    if (commentsMap[postId]) return
    const data = await fetchComments(postId)
    setCommentsMap((prev) => ({ ...prev, [postId]: data }))
  }

  return {
    commentsMap,
    load,
    setCommentsMap,
  }
}
