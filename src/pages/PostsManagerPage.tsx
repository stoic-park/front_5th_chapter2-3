import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Plus } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

// widgets
import { PostManagerPanel } from "@/widgets/post-manager/ui/PostManagerPanel"
import { PostManagerDialogs } from "@/widgets/post-manager/ui/PostManagerDialogs"

// shared
import { Button, Card, CardHeader, CardTitle } from "@/shared/ui"

// entities
import { fetchTags } from "@/entities/post/api/postApi"
import { usePostsQuery, useSearchPostsQuery, usePostsByTagQuery } from "@/entities/post/model/query"
import { useDeletePostMutation } from "@/entities/post/model/mutation"
import { fetchComments, deleteComment, likeComment } from "@/entities/comment/api/commentApi"
import { fetchUserById } from "@/entities/user/api/userApi"

// types
import { Post, Tag } from "@/entities/post/model/types"
import { Comment } from "@/entities/comment/model/types"
import { User } from "@/entities/user/model/types"

const PostsManagerPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const queryParams = new URLSearchParams(location.search)

  const [skip, setSkip] = useState(Number(queryParams.get("skip")) || 0)
  const [limit, setLimit] = useState(Number(queryParams.get("limit")) || 10)
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")

  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  const [tags, setTags] = useState<Tag[]>([])
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({})

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  const isSearching = !!searchQuery.trim()
  const isFilteringByTag = !!selectedTag && selectedTag !== "all"

  // Query
  const { data: defaultData, isLoading: isLoadingDefault } = usePostsQuery({ limit, skip })
  const { data: searchData } = useSearchPostsQuery(searchQuery, isSearching)
  const { data: tagData } = usePostsByTagQuery(selectedTag, isFilteringByTag)

  const posts = isSearching
    ? (searchData?.posts ?? [])
    : isFilteringByTag
      ? (tagData?.posts ?? [])
      : (defaultData?.posts ?? [])

  const total = isSearching
    ? (searchData?.total ?? 0)
    : isFilteringByTag
      ? (tagData?.total ?? 0)
      : (defaultData?.total ?? 0)

  // Mutations
  const { mutate: deletePost } = useDeletePostMutation()

  // Tags
  useEffect(() => {
    fetchTags().then(setTags)
  }, [])

  // URL 동기화
  useEffect(() => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(Number(params.get("skip")) || 0)
    setLimit(Number(params.get("limit")) || 10)
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  // 댓글 핸들러
  const fetchByPostId = async (postId: number) => {
    if (commentsMap[postId]) return
    const data = await fetchComments(postId)
    setCommentsMap((prev) => ({ ...prev, [postId]: data }))
  }

  const handleLikeComment = async (commentId: number, postId: number) => {
    const target = commentsMap[postId]?.find((c) => c.id === commentId)
    if (!target) return
    const updated = await likeComment(commentId)
    setCommentsMap((prev) => ({
      ...prev,
      [postId]: prev[postId].map((c) => (c.id === commentId ? updated : c)),
    }))
  }

  const handleDeleteComment = async (id: number, postId: number) => {
    await deleteComment(id)
    setCommentsMap((prev) => ({
      ...prev,
      [postId]: prev[postId].filter((c) => c.id !== id),
    }))
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>

      <PostManagerPanel
        loading={isLoadingDefault}
        posts={posts}
        searchQuery={searchQuery}
        selectedTag={selectedTag}
        tags={tags}
        skip={skip}
        limit={limit}
        total={total}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onChangeSearch={setSearchQuery}
        onSearchSubmit={() => {}}
        onChangeTag={setSelectedTag}
        onChangeSortBy={setSortBy}
        onChangeSortOrder={setSortOrder}
        onClickUser={async (user) => {
          if (!user) return
          const data = await fetchUserById(user.id)
          setSelectedUser(data)
          setShowUserModal(true)
        }}
        onClickTag={setSelectedTag}
        onClickEdit={(post) => {
          setSelectedPost(post)
          setShowEditDialog(true)
        }}
        onClickDelete={(postId) => {
          deletePost(postId, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["posts"] })
            },
          })
        }}
        onClickDetail={(post) => {
          setSelectedPost(post)
          fetchByPostId(post.id)
          setShowPostDetailDialog(true)
        }}
        onChangeLimit={setLimit}
        onClickPrev={() => setSkip(Math.max(0, skip - limit))}
        onClickNext={() => setSkip(skip + limit)}
      />

      <PostManagerDialogs
        showAddDialog={showAddDialog}
        showEditDialog={showEditDialog}
        showDetailDialog={showPostDetailDialog}
        showAddCommentDialog={showAddCommentDialog}
        showEditCommentDialog={showEditCommentDialog}
        showUserModal={showUserModal}
        selectedPost={selectedPost}
        selectedComment={selectedComment}
        selectedUser={selectedUser}
        commentsMap={commentsMap}
        searchQuery={searchQuery}
        onCloseAddDialog={() => setShowAddDialog(false)}
        onCloseEditDialog={() => setShowEditDialog(false)}
        onCloseDetailDialog={() => setShowPostDetailDialog(false)}
        onCloseAddCommentDialog={() => setShowAddCommentDialog(false)}
        onCloseEditCommentDialog={() => setShowEditCommentDialog(false)}
        onCloseUserModal={() => setShowUserModal(false)}
        onClickAddComment={() => setShowAddCommentDialog(true)}
        onClickEditComment={(comment) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
        onClickDeleteComment={handleDeleteComment}
        onClickLikeComment={handleLikeComment}
        onPostUpdated={() => {
          queryClient.invalidateQueries({ queryKey: ["posts"] })
        }}
      />
    </Card>
  )
}

export default PostsManagerPage
