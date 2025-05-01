import { User } from "../model/types"

interface UserAvatarProps {
  user: User
  onClick?: (user: User) => void
}

// 순수하게 props를 받아서 user에 대한 ui 를 담당하는 부분
export const UserAvatar = ({ user, onClick }: UserAvatarProps) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onClick?.(user)}>
      <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
      <span className="truncate">{user.username}</span>
    </div>
  )
}
