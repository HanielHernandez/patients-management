export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface Patient {
  firstName: string;
  lastName: string;
  id: string;
  email: string;
  phoneNumber: string;
  dob: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientsResponse {
  data: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
