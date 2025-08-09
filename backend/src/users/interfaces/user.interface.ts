export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: string;
}
