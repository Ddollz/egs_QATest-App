
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
  Role_ID: string;
  Role_Name: string;
  Role_Description: string;
  Role_Code: string;
  Users: string;
}
