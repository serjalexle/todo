import { IAdmin } from "./admin";

export interface IRole {
  _id: string;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  created_by: IAdmin
}
