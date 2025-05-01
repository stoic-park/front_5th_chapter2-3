import { TableCell } from "@/shared/ui"
import { Button } from "@/shared/ui"
import { MessageSquare, Edit2, Trash2, ThumbsUp, ThumbsDown } from "lucide-react"
import { Post } from "@/entities/post/model/types"
import { UserAvatar } from "@/entities/user/ui/UserAvatar"

interface PostRowProps {
  post: Post
  searchQuery: string
  selectedTag: string
  highlightText: (text: string, highlight: string) => React.ReactNode

  onClickTag: (tag: string) => void
  onClickEdit: (post: Post) => void
  onClickDelete: (postId: number) => void
  onClickDetail: (post: Post) => void
  onClickUser: (user: Post["author"]) => void
}

export const PostRow = ({
  post,
  searchQuery,
  selectedTag,
  highlightText,
  onClickTag,
  onClickEdit,
  onClickDelete,
  onClickDetail,
  onClickUser,
}: PostRowProps) => {
  return (
    <>
      <TableCell>{post.id}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <div>{highlightText(post.title, searchQuery)}</div>
          <div className="flex flex-wrap gap-1">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                  selectedTag === tag
                    ? "text-white bg-blue-500 hover:bg-blue-600"
                    : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                }`}
                onClick={() => onClickTag(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell>{post.author && <UserAvatar user={post.author} onClick={() => onClickUser(post.author)} />}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4" />
          <span>{post.reactions?.likes || 0}</span>
          <ThumbsDown className="w-4 h-4" />
          <span>{post.reactions?.dislikes || 0}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onClickDetail(post)}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onClickEdit(post)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onClickDelete(post.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </>
  )
}
