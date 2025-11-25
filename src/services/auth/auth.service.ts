import { api } from "../api";
import type { LoginData } from "./types";


export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  const currentUser = await api.get("/auth/me");
  localStorage.setItem("currentUser", JSON.stringify(currentUser.data));
  
  return response.data;
};

export const logout = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};