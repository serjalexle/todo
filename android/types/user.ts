export interface UserDTO {
  _id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: UserDTO;
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}
