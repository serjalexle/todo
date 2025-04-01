import axiosInstance from "../axiosInstance";

export const fetchPermissions = async () => {
  const response = await axiosInstance.get("/admin/permissions/");
  return response.data;
};
