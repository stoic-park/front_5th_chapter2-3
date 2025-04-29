import { axiosInstance } from "../../../shared/api/axiosInstance"
import { User } from "../model/types"

// 모든 사용자 가져오기
export const fetchUsers = async () => {
  const response = await axiosInstance.get("/users", {
    params: { limit: 0, select: "username,image" },
  })
  return response.data.users as User[]
}

// 특정 사용자 가져오기
export const fetchUserById = async (userId: number) => {
  const response = await axiosInstance.get(`/users/${userId}`)
  return response.data as User
}
