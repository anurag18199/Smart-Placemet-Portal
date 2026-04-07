export interface User {
    id: string;
    name: string;
    email: string;
    role: "STUDENT" | "COMPANY" | "ADMIN";
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    role: "STUDENT" | "COMPANY" | "ADMIN";
  }