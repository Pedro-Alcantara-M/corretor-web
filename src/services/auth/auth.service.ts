import { api } from "../api";
import type { LoginData } from "./types";


export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};