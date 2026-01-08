import { api } from "../api";
import type { LoginData } from "./types";


export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
   localStorage.setItem("token", JSON.stringify(response.data.access_token));
  const currentUser = await api.get("/auth/me");
  localStorage.setItem("currentUser", JSON.stringify(currentUser.data));
  
  return response.data;
};

export const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  window.location.href = "/sign-in";
  return;
};