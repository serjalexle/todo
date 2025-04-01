// 📄 shared/admin/rolesApi.ts

import axiosInstance from "../axiosInstance";

export interface GetAllRolesParams {
  page?: number;
  count?: number;
  sort_field?: string;
  sort_type?: "asc" | "desc";
  filter_name?: string;
}

export const getAllRoles = async (
  params: GetAllRolesParams = {
    page: 1,
    count: 10,
    sort_field: "createdAt",
    sort_type: "desc",
    filter_name: "",
  }
) => {
  const res = await axiosInstance.get("/admin/roles/", { params });
  return res.data;
};

export const getRoleById = async (id: string) => {
  const res = await axiosInstance.get(`/admin/roles/${id}`);
  return res.data;
};

export const createRole = async (payload: {
  name: string;
  permissions: string[];
}) => {
  const res = await axiosInstance.post("/admin/roles/", payload);
  return res.data;
};

export const updateRole = async (
  id: string,
  payload: { name?: string; permissions?: string[] }
) => {
  const res = await axiosInstance.patch(`/admin/roles/${id}`, payload);
  return res.data;
};

export const deleteRole = async (id: string) => {
  const res = await axiosInstance.delete(`/admin/roles/${id}`);
  return res.data;
};
