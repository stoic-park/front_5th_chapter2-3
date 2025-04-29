import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: "/api", // 기본 API URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 요청 제한 시간
})

// 요청 인터셉터 (필요시)
axiosInstance.interceptors.request.use(
  (config) => {
    // 여기서 토큰 삽입 가능 (예: config.headers.Authorization = `Bearer ${token}`)
    return config
  },
  (error) => Promise.reject(error),
)

// 응답 인터셉터 (필요시)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error)
    return Promise.reject(error)
  },
)
