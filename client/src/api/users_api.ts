import apiClient from "api";
import { AxiosResponse } from "axios";

const prefix = "/api/auth";

export const users_api = {
  refresh: async (): Promise<AxiosResponse> => {
    return await apiClient.get(`${prefix}/refresh`);
  },
};
