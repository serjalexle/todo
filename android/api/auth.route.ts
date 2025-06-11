import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/user";
import { AxiosResponse } from "axios";
import { axiosInstance } from "./axios";

export const login = async (
  data: LoginRequest
): Promise<AxiosResponse<AuthResponse>> => {
  const response = await axiosInstance.post<AuthResponse>("/auth/login", data);
  return response;
};

export const register = async (
  data: RegisterRequest
): Promise<AxiosResponse<AuthResponse>> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/register",
    data
  );
  return response;
};

export const refreshToken = async (): Promise<AxiosResponse<AuthResponse>> => {
  const response = await axiosInstance.get<AuthResponse>("/auth/refresh");
  return response;
};
