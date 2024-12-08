import apiClient from "api";
import { AxiosResponse } from "axios";
import { LoginDTO, RegisterDTO } from "dto/auth";

const prefix = "/api/auth";

export const users_api = {
  refresh: async (): Promise<AxiosResponse> => {
    return await apiClient.post(`${prefix}/refresh`);
  },
  login: async (data: LoginDTO): Promise<AxiosResponse> => {
    return await apiClient.post(`${prefix}/login`, data);
  },
  register: async (data: RegisterDTO): Promise<AxiosResponse> => {
    return await apiClient.post(`${prefix}/register`, data);
  },
  logout: async (): Promise<AxiosResponse> => {
    return await apiClient.post(`${prefix}/logout`);
  },
};
