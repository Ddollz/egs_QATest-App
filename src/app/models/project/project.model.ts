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
export interface testCase {
  Case_ID: number;
  Case_Title: string;
  Case_Status: number;
  Case_Desc: string;
  Suite_ID: number;
  Case_Severity: number;
  Case_Priority: number;
  Case_Type: number;
  Case_Layer: number;
  Case_Flaky: number;
  Case_isLock: number;
  User_ID: number;
  Case_Milestone: number;
  Case_Behavior: number;
  Case_AutoStat: number;
  Case_PreCondition: string;
  Case_PostCondition: string;
  Case_Tag: string;
}

export interface step {
  Case_StepID: number;
  Step_number: number;
  Step_Type: string;
  Case_ID: number;
  Step_Action: string;
  Step_InputData: string;
  Step_ExpectedResult: string;
  Step_Status: number;
}

