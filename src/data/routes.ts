export const ROUTES = {
  BASEURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  HOME: '/',
  CHAT: '/chat',
  CHAT_CONVERSATION: (id: string) => `/chat/${id}`,
  LOGIN: '/login',
  REGISTER: '/register',
  POST_DETAIL: (id: string) => `/post/${id}`,
  PROFILE: '/profile',
}; 