
export interface User {
  id: string;
  username: string;
  email: string;
  fullname: string;
  phone?: string;

  bio?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  created_at: string;
  updated_at: string;
}
