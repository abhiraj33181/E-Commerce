import { getToken } from "@/utils/secureStore";
import { LoginData, RegisterData, LoginResponse } from "../types/auth";
import api from "@/constants/api";

export const registerUser = async (data: RegisterData) => {
  return api.post("/auth/register", data);
};

export const loginUser = async (
  data: LoginData
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/auth/me", {
    headers : {
      Authorization: `Bearer ${await getToken()}`,
    }
  });
  return response.data;
};