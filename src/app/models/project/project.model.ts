export interface project {
  Project_ID: number;
  User_ID: number;
  Project_Name: string;
  Project_Code: string;
  Project_Description: string;
  Project_AccessType: number;
  Project_MemberAccess: number;
  Project_Status: number;
}

export interface suite {
  Suite_ID: number;
  Suite_Name: string;
  Suite_Desc: string;
  Suite_PreCondition: string;
  Suite_isLock: number;
  User_ID: number;
  Project_ID: number;
  Parent_SuiteID: number;
  Case_Count: number;
  SuiteChild_Count: number;
}
