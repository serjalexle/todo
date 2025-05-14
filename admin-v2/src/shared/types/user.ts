export interface IUserCreateDto {
  email: string;
  password: string;
}

export interface IUserUpdateDto {
  email?: string;
}

export interface IUser {
  _id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}
