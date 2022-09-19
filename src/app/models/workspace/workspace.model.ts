
export interface user {
  User_ID: number;
  User_Email: string;
  User_Firstname: string;
  User_Lastname: string;
  User_isAdmin: string;
  User_Status: string;
  Role_ID: number;
  RoleTitle: string;
  Role: string;
}

export interface role {
  Role_ID: string;
  Role_Name: string;
  Role_Description: string;
  Role_Code: string;
  Users: string;
}
