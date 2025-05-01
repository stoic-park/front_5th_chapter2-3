import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Plus } from "lucide-react"

// widgets
import { PostTable } from "@/widgets/post-table/ui/PostTable"
import { PostDetailDialog } from "@/widgets/post-detail-dialog/ui/PostDetailDialog"
import { PostFilterPanel } from "@/widgets/post-filters/ui/PostFilterPanel"
import { PaginationPanel } from "@/widgets/pagination/ui/PaginationPanel"
import { UserInfoDialog } from "@/widgets/user-info-dialog/ui/UserInfoDialog"

// features
import { PostAddDialog } from "@/features/post-add/ui/PostAddDialog"
import { PostEditDialog } from "@/features/post-edit/ui/PostEditDialog"
import { CommentAddDialog } from "@/features/comment-add/ui/CommentAddDialog"
import { CommentEditDialog } from "@/features/comment-edit/ui/CommentEditDialog"
import { usePosts } from "@/features/post-load/model/usePosts"
import { useSearchPosts } from "@/features/post-load/model/useSearchPosts"
import { usePostsByTag } from "@/features/post-load/model/usePostsByTag"
import { useCommentLoad } from "@/features/comment-manage/model/useCommentLoad"
import { useCommentLike } from "@/features/comment-manage/model/useCommentLike"
import { useCommentDelete } from "@/features/comment-manage/model/useCommentDelete"

// shared
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import { highlightText } from "@/shared/lib/highlightText"

// entities
import { fetchTags, deletePost } from "@/entities/post/api/postApi"
import { fetchUserById } from "@/entities/user/api/userApi"

// types
import { Post, Tag } from "@/entities/post/model/types"
import { Comment } from "@/entities/comment/model/types"
import { User } from "@/entities/user/model/types"

const PostsManagerPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

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

  // ---------------------
  // Posts 관련 훅
  // ---------------------
  const { posts: defaultPosts, total: defaultTotal, loading: loadingDefault, loadPosts } = usePosts()

  const { posts: searchedPosts, total: searchedTotal, loading: loadingSearch, search } = useSearchPosts()

  const { posts: taggedPosts, total: taggedTotal, loading: loadingTag, loadByTag } = usePostsByTag()

  const isSearching = !!searchQuery
  const isTagFiltered = !!selectedTag && selectedTag !== "all"

  const posts = isSearching ? searchedPosts : isTagFiltered ? taggedPosts : defaultPosts

  const total = isSearching ? searchedTotal : isTagFiltered ? taggedTotal : defaultTotal

  const loading = loadingSearch || loadingTag || loadingDefault

  // ---------------------
  // Comments 관련 훅
  // ---------------------
  const { commentsMap, load: loadComments, setCommentsMap } = useCommentLoad()

  const { like: likeComment } = useCommentLike(commentsMap, setCommentsMap)
  const { remove: deleteComment } = useCommentDelete(setCommentsMap)

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

  useEffect(() => {
    fetchTags().then(setTags).catch(console.error)
  }, [])

  useEffect(() => {
    if (isSearching) {
      search(searchQuery)
    } else if (isTagFiltered) {
      loadByTag(selectedTag)
    } else {
      loadPosts(limit, skip)
    }
    updateURL()
  }, [skip, limit, searchQuery, selectedTag])

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

      {/* 테이블 */}
      <CardContent className="space-y-6">
        <PostFilterPanel
          searchQuery={searchQuery}
          selectedTag={selectedTag}
          sortBy={sortBy}
          sortOrder={sortOrder}
          tags={tags}
          onChangeSearch={setSearchQuery}
          onSearchSubmit={() => search(searchQuery)}
          onChangeTag={(tag) => {
            setSelectedTag(tag)
            loadByTag(tag)
          }}
          onChangeSortBy={setSortBy}
          onChangeSortOrder={setSortOrder}
        />

        {loading ? (
          <div className="flex justify-center p-4">로딩 중...</div>
        ) : (
          <PostTable
            posts={posts}
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            highlightText={highlightText}
            onClickUser={async (user?: User) => {
              if (!user) return
              const userData = await fetchUserById(user.id)
              setSelectedUser(userData)
              setShowUserModal(true)
            }}
            onClickTag={(tag) => {
              setSelectedTag(tag)
              loadByTag(tag)
            }}
            onClickEdit={(post) => {
              setSelectedPost(post)
              setShowEditDialog(true)
            }}
            onClickDelete={async (postId) => {
              await deletePost(postId)
              loadPosts(limit, skip)
            }}
            onClickDetail={(post) => {
              setSelectedPost(post)
              loadComments(post.id)
              setShowPostDetailDialog(true)
            }}
          />
        )}

        <PaginationPanel
          skip={skip}
          limit={limit}
          total={total}
          onChangeLimit={setLimit}
          onClickPrev={() => setSkip(Math.max(0, skip - limit))}
          onClickNext={() => setSkip(skip + limit)}
        />
      </CardContent>

      {/* 모달 */}
      <PostAddDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onPostAdded={() => {
          loadPosts(limit, skip)
        }}
      />

      <PostEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        post={selectedPost}
        onPostUpdated={() => {
          loadPosts(limit, skip)
        }}
      />

      <PostDetailDialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        comments={selectedPost?.id ? commentsMap[selectedPost.id] || [] : []}
        searchQuery={searchQuery}
        onClickAddComment={() => setShowAddCommentDialog(true)}
        onClickEditComment={(comment) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
        onClickDeleteComment={deleteComment}
        onClickLikeComment={likeComment}
        highlightText={highlightText}
      />

      <CommentAddDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        postId={selectedPost?.id || 0}
        userId={1}
        onCommentAdded={() => {
          if (selectedPost) loadComments(selectedPost.id)
        }}
      />

      <CommentEditDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        comment={selectedComment}
        onCommentUpdated={() => {
          if (selectedComment) loadComments(selectedComment.postId)
        }}
      />

      <UserInfoDialog open={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
    </Card>
  )
}

export default PostsManagerPage
