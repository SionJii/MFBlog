export interface UserProfile {
  uid: string;
  email: string;
  nickname: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AuthError {
  code: string;
  message: string;
} 