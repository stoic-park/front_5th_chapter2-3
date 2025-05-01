// useUserQuery.ts
import { useQuery } from "@tanstack/react-query"
import { fetchUserById } from "../api/userApi"

export const useUserQuery = (userId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled,
  })
}
