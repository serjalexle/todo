import { LoginAdminDto } from "@/shared/types/auth";
import axiosInstance from "@/shared/api/axiosInstance";

export const loginAdmin = async (data: LoginAdminDto) => {
  const response = await axiosInstance.post("/admin/auth/login", data);
  return response.data;
};

export const logoutAdmin = async () => {
  const response = await axiosInstance.get("/admin/auth/logout");
  return response.data;
};

export const refreshAdmin = async () => {
  const response = await axiosInstance.get("/admin/auth/refresh");
  return response.data;
};
