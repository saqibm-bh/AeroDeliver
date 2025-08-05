export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface UploadProfilePictureResponse {
  success: boolean;
  message: string;
  profilePictureUrl?: string;
}
