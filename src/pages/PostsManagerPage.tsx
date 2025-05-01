import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Plus } from "lucide-react"

// widgets
import { PostManagerPanel } from "@/widgets/post-manager/ui/PostManagerPanel"
import { PostManagerDialogs } from "@/widgets/post-manager/ui/PostManagerDialogs"

// shared
import { Button, Card, CardHeader, CardTitle } from "@/shared/ui"

// api
import { fetchTags, deletePost } from "@/entities/post/api/postApi"
import { fetchUserById } from "@/entities/user/api/userApi"

// types
import { Post, Tag } from "@/entities/post/model/types"
import { Comment } from "@/entities/comment/model/types"
import { User } from "@/entities/user/model/types"

// zustand store
import { usePostStore } from "@/features/post-load/model/usePostStore"
import { useCommentStore } from "@/features/comment-manage/model/useCommentStore"

const PostsManagerPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 로컬 상태
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [tags, setTags] = useState<Tag[]>([])

  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  // zustand store
  const { posts, total, loading, loadDefault, loadBySearch, loadByTag, removePost } = usePostStore()
  const { commentsMap, fetchByPostId, like, remove } = useCommentStore()

  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  const handleSearchPosts = () => {
    if (!searchQuery) {
      loadDefault(limit, skip)
    } else {
      loadBySearch(searchQuery)
    }
  }

  const handleFetchPostsByTag = (tag: string) => {
    if (!tag || tag === "all") {
      loadDefault(limit, skip)
    } else {
      loadByTag(tag)
    }
  }

  const handleDeleteComment = async (id: number, postId: number) => {
    await remove(id, postId)
  }

  const handleLikeComment = async (id: number) => {
    await like(id)
  }

  useEffect(() => {
    fetchTags().then(setTags)
  }, [])

  useEffect(() => {
    if (selectedTag) {
      handleFetchPostsByTag(selectedTag)
    } else {
      loadDefault(limit, skip)
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

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

      {/* 게시물 관리 패널 */}
      <PostManagerPanel
        loading={loading}
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
        onSearchSubmit={handleSearchPosts}
        onChangeTag={setSelectedTag}
        onChangeSortBy={setSortBy}
        onChangeSortOrder={setSortOrder}
        onClickUser={async (user) => {
          if (!user) return
          const userData = await fetchUserById(user.id)
          setSelectedUser(userData)
          setShowUserModal(true)
        }}
        onClickTag={(tag) => {
          setSelectedTag(tag)
          handleFetchPostsByTag(tag)
        }}
        onClickEdit={(post) => {
          setSelectedPost(post)
          setShowEditDialog(true)
        }}
        onClickDelete={async (postId) => {
          await deletePost(postId)
          removePost(postId)
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

      {/* 모달 영역 */}
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
          loadDefault(limit, skip)
        }}
      />
    </Card>
  )
}

export default PostsManagerPage
