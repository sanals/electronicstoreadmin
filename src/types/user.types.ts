export interface User {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE";
  lastLogin: string;
}

export interface UserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

export interface UserUpdateData {
  id: number;
  status: "ACTIVE" | "INACTIVE";
} 