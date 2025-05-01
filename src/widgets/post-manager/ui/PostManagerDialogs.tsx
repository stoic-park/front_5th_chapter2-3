import { PostAddDialog } from "@/features/post-add/ui/PostAddDialog"
import { PostEditDialog } from "@/features/post-edit/ui/PostEditDialog"
import { CommentAddDialog } from "@/features/comment-add/ui/CommentAddDialog"
import { CommentEditDialog } from "@/features/comment-edit/ui/CommentEditDialog"
import { PostDetailDialog } from "@/widgets/post-detail-dialog/ui/PostDetailDialog"
import { UserInfoDialog } from "@/widgets/user-info-dialog/ui/UserInfoDialog"

import { Post } from "@/entities/post/model/types"
import { Comment } from "@/entities/comment/model/types"
import { useUserQuery } from "@/entities/user/model/query"
interface PostManagerDialogsProps {
  showAddDialog: boolean
  showEditDialog: boolean
  showDetailDialog: boolean
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
  showUserModal: boolean
  selectedPost: Post | null
  selectedComment: Comment | null
  selectedUserId: number | null
  searchQuery: string
  onCloseAddDialog: () => void
  onCloseEditDialog: () => void
  onCloseDetailDialog: () => void
  onCloseAddCommentDialog: () => void
  onCloseEditCommentDialog: () => void
  onCloseUserModal: () => void
  onPostUpdated: () => void
}

export const PostManagerDialogs = ({
  showAddDialog,
  showEditDialog,
  showDetailDialog,
  showAddCommentDialog,
  showEditCommentDialog,
  showUserModal,
  selectedPost,
  selectedComment,
  selectedUserId,
  searchQuery,
  onCloseAddDialog,
  onCloseEditDialog,
  onCloseDetailDialog,
  onCloseAddCommentDialog,
  onCloseEditCommentDialog,
  onCloseUserModal,
}: PostManagerDialogsProps) => {
  const { data: selectedUser } = useUserQuery(selectedUserId || 0, !!selectedUserId)

  return (
    <>
      <PostAddDialog open={showAddDialog} onOpenChange={onCloseAddDialog} />
      <PostEditDialog open={showEditDialog} onOpenChange={onCloseEditDialog} post={selectedPost} />
      <PostDetailDialog
        open={showDetailDialog}
        onOpenChange={onCloseDetailDialog}
        post={selectedPost}
        searchQuery={searchQuery}
        highlightText={(text) => text}
      />
      <CommentAddDialog
        open={showAddCommentDialog}
        onOpenChange={onCloseAddCommentDialog}
        postId={selectedPost?.id || 0}
        userId={1}
      />
      <CommentEditDialog
        open={showEditCommentDialog}
        onOpenChange={onCloseEditCommentDialog}
        comment={selectedComment}
      />
      <UserInfoDialog open={showUserModal} onOpenChange={onCloseUserModal} user={selectedUser || null} />
    </>
  )
}
