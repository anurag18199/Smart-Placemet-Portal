import API from "./api";
import type { LoginInput, RegisterInput } from "../types/user";

export const registerUser = (data: RegisterInput) => {
  return API.post("/auth/register", data);
};

export const loginUser = (data: LoginInput) => {
  return API.post("/auth/login", data);
};

export const getCurrentUser = () => {
  return API.get("/auth/me");
};