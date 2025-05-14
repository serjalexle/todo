import { IAdminCreateDto, IAdminUpdateDto } from "@/shared/types/admin";
import axiosInstance from "../axiosInstance";

// ✅ Отримати всіх користувачів
export const getAllUsers = async (params?: {
  page?: number;
  count?: number;
  sort_field?: string;
  sort_type?: "asc" | "desc";
  filter_email?: string;
}) => {
  const response = await axiosInstance.get("/admin/users", {
    params,
  });
  return response.data;
};

// ✅ Створити нового користувача
export const createUser = async (data: IAdminCreateDto) => {
  const response = await axiosInstance.post("/admin/users", data);
  return response.data;
};

// ✅ Отримати одного користувача по ID
export const getUserById = async (adminId: string) => {
  const response = await axiosInstance.get(`/admin/users/${adminId}`);
  return response.data;
};

// ✅ Оновити користувача
export const updateUser = async (adminId: string, data: IAdminUpdateDto) => {
  const response = await axiosInstance.patch(`/admin/users/${adminId}`, data);
  return response.data;
};

// ✅ Видалити користувача
export const deleteUser = async (adminId: string) => {
  const response = await axiosInstance.delete(`/admin/users/${adminId}`);
  return response.data;
};
