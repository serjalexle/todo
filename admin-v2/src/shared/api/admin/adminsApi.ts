import { IAdminCreateDto, IAdminUpdateDto } from "@/shared/types/admin";
import axiosInstance from "../axiosInstance";

// ✅ Отримати всіх адміністраторів
export const getAllAdmins = async (params?: {
  page?: number;
  count?: number;
  sort_field?: string;
  sort_type?: "asc" | "desc";
  filter_email?: string;
}) => {
  const response = await axiosInstance.get("/admin/admins", {
    params,
  });
  return response.data;
};

// ✅ Створити нового адміністратора
export const createAdmin = async (data: IAdminCreateDto) => {
  const response = await axiosInstance.post("/admin/admins", data);
  return response.data;
};

// ✅ Отримати одного адміністратора по ID
export const getAdminById = async (adminId: string) => {
  const response = await axiosInstance.get(`/admin/admins/${adminId}`);
  return response.data;
};

// ✅ Оновити адміністратора
export const updateAdmin = async (adminId: string, data: IAdminUpdateDto) => {
  const response = await axiosInstance.patch(`/admin/admins/${adminId}`, data);
  return response.data;
};

// ✅ Видалити адміністратора
export const deleteAdmin = async (adminId: string) => {
  const response = await axiosInstance.delete(`/admin/admins/${adminId}`);
  return response.data;
};
