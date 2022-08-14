
export interface user {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  roleTitle: string;
  status: number;
}

export interface role {
  value: string;
  description: string;
  checked: boolean;
  users: number;
}
