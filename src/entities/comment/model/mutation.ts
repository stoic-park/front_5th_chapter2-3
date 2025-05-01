import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment, updateComment, deleteComment, likeComment } from "@/entities/comment/api/commentApi"
import { Comment } from "@/entities/comment/model/types"

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addComment,
    onSuccess: (newComment) => {
      queryClient.invalidateQueries({ queryKey: ["comments", newComment.postId] })
    },
  })
}

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: string }) => updateComment({ id, body, postId: 0 }),
    onSuccess: (updatedComment: Comment) => {
      queryClient.invalidateQueries({ queryKey: ["comments", updatedComment.postId] })
    },
  })
}

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId }: { commentId: number; postId: number }) => deleteComment(commentId),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })
}

export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => likeComment(id),
    onSuccess: (updatedComment: Comment) => {
      queryClient.invalidateQueries({ queryKey: ["comments", updatedComment.postId] })
    },
  })
}
