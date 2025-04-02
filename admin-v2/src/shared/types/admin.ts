import { IRole } from "./role";

export interface IAdmin {
  _id: string;
  email: string;
  role: IRole;
  custom_permissions: string[];
  created_at: string;
  updated_at: string;
}
