import { TableCell } from "@/shared/ui"
import { Post } from "@/entities/post/model/types"
import { ThumbsUp, ThumbsDown, MessageSquare, Edit2, Trash2 } from "lucide-react"

interface PostRowProps {
  post: Post
  highlight?: string
  onClickDetail?: (post: Post) => void
  onClickEdit?: (post: Post) => void
  onClickDelete?: (postId: number) => void
  onClickAuthor?: (author: Post["author"]) => void
  onClickTag?: (tag: string) => void
}

// Post의 ui 표현에만 집중
// 상태, api 호출, 이벤트 로직 X
export const PostRow = ({
  post,
  highlight = "",
  onClickDetail,
  onClickEdit,
  onClickDelete,
  onClickAuthor,
  onClickTag,
}: PostRowProps) => {
  const highlightText = (text: string) => {
    if (!highlight) return text
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))
  }

  return (
    <>
      <TableCell>{post.id}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <div>{highlightText(post.title)}</div>
          <div className="flex flex-wrap gap-1">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                  highlight === tag
                    ? "text-white bg-blue-500 hover:bg-blue-600"
                    : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                }`}
                onClick={() => onClickTag?.(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onClickAuthor?.(post.author)}>
          <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
          <span>{post.author?.username}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4" />
          <span>{post.reactions?.likes ?? 0}</span>
          <ThumbsDown className="w-4 h-4" />
          <span>{post.reactions?.dislikes ?? 0}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <button onClick={() => onClickDetail?.(post)}>
            <MessageSquare className="w-4 h-4" />
          </button>
          <button onClick={() => onClickEdit?.(post)}>
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onClickDelete?.(post.id)}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </TableCell>
    </>
  )
}
