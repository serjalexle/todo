import { IRole } from "./role";

export interface IAdminCreateDto {
  email: string;
  password: string;
  role_id: string;
  custom_permissions: string[];
}

export interface IAdminUpdateDto {
  email?: string;
  password?: string;
  role_id?: string;
  custom_permissions?: string[];
}


export interface IAdmin {
  _id: string;
  email: string;
  role: IRole;
  custom_permissions: string[];
  created_at: Date;
  updated_at: Date;
  created_by: IAdmin
}