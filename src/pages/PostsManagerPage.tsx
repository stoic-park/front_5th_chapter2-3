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

// shared
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import { highlightText } from "@/shared/lib/highlightText"

// entities
import { fetchPosts, fetchPostsByTag, searchPosts, fetchTags, deletePost } from "@/entities/post/api/postApi"
import { fetchComments, deleteComment, likeComment } from "@/entities/comment/api/commentApi"
import { fetchUsers, fetchUserById } from "@/entities/user/api/userApi"

//types
import { Post, Tag } from "@/entities/post/model/types"
import { Comment } from "@/entities/comment/model/types"
import { User } from "@/entities/user/model/types"

const PostsManagerPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [tags, setTags] = useState<Tag[]>([])

  const [loading, setLoading] = useState(false)

  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)

  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  // URL 업데이트
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

  // 게시글 + 유저 가져오기
  const handleFetchPosts = async () => {
    try {
      setLoading(true)
      const [postRes, users] = await Promise.all([fetchPosts(limit, skip), fetchUsers()])
      const postsWithUsers = postRes.posts.map((post: Post) => ({
        ...post,
        author: users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postRes.total)
    } catch (err) {
      console.error("게시물 로드 실패:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchPosts = async () => {
    if (!searchQuery) {
      handleFetchPosts()
      return
    }
    try {
      setLoading(true)
      const [res, users] = await Promise.all([searchPosts(searchQuery), fetchUsers()])
      const postsWithUsers = res.posts.map((post: Post) => ({
        ...post,
        author: users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(res.total)
    } catch (err) {
      console.error("검색 실패:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      handleFetchPosts()
      return
    }
    try {
      setLoading(true)
      const [res, users] = await Promise.all([fetchPostsByTag(tag), fetchUsers()])
      const postsWithUsers = res.posts.map((post: Post) => ({
        ...post,
        author: users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(res.total)
    } catch (err) {
      console.error("태그 필터 실패:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFetchTags = async () => {
    try {
      const data = await fetchTags()
      setTags(data)
    } catch (err) {
      console.error("태그 로드 실패:", err)
    }
  }

  const handleFetchComments = async (postId: number) => {
    if (comments[postId]) return
    const data = await fetchComments(postId)
    setComments((prev) => ({ ...prev, [postId]: data }))
  }

  const handleLikeComment = async (commentId: number, postId: number) => {
    const target = comments[postId]?.find((c: Comment) => c.id === commentId)
    if (!target) return
    const updated = await likeComment(commentId)
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId]?.map((c: Comment) => (c.id === commentId ? updated : c)) || [],
    }))
  }

  const handleDeleteComment = async (id: number, postId: number) => {
    await deleteComment(id)
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId]?.filter((c: Comment) => c.id !== id) || [],
    }))
  }

  useEffect(() => {
    handleFetchTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      handleFetchPostsByTag(selectedTag)
    } else {
      handleFetchPosts()
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

      <CardContent className="space-y-6">
        <PostFilterPanel
          searchQuery={searchQuery}
          selectedTag={selectedTag}
          sortBy={sortBy}
          sortOrder={sortOrder}
          tags={tags}
          onChangeSearch={setSearchQuery}
          onSearchSubmit={handleSearchPosts}
          onChangeTag={(tag) => {
            setSelectedTag(tag)
            handleFetchPostsByTag(tag)
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
              handleFetchPostsByTag(tag)
            }}
            onClickEdit={(post) => {
              setSelectedPost(post)
              setShowEditDialog(true)
            }}
            onClickDelete={async (postId) => {
              await deletePost(postId)
              setPosts((prev) => prev.filter((p) => p.id !== postId))
            }}
            onClickDetail={(post) => {
              setSelectedPost(post)
              handleFetchComments(post.id)
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

      <PostAddDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onPostAdded={(post) => {
          setPosts((prev) => [post, ...prev])
          setShowAddDialog(false)
        }}
      />

      <PostEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        post={selectedPost}
        onPostUpdated={() => {
          handleFetchPosts()
        }}
      />

      <PostDetailDialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        comments={selectedPost?.id ? comments[selectedPost.id] || [] : []}
        searchQuery={searchQuery}
        onClickAddComment={() => {
          setShowAddCommentDialog(true)
        }}
        onClickEditComment={(comment) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
        onClickDeleteComment={handleDeleteComment}
        onClickLikeComment={handleLikeComment}
        highlightText={highlightText}
      />

      <CommentAddDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        postId={selectedPost?.id || 0}
        userId={1}
        onCommentAdded={() => {
          if (selectedPost) {
            handleFetchComments(selectedPost.id)
          }
        }}
      />

      <CommentEditDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        comment={selectedComment}
        onCommentUpdated={() => {
          if (selectedComment) {
            handleFetchComments(selectedComment.postId)
          }
        }}
      />

      <UserInfoDialog open={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
    </Card>
  )
}

export default PostsManagerPage
