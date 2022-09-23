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
  carretOpen: boolean;
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
  Case_Param: string;
  Attachments_ID?: string;
  LastModifiedUser: number;
  Project_ID: number;
}

export interface testCaseComment {
  Comment_ID: number;
  Comment_Content: string;
  Comment_Date: string;
  User_id: number;
  Case_ID: number;
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
  SharedStep_ID: number;
  Attachments_ID?: string;
  LastModifiedUser: number;
  // attachments_IDS?: Array<string>;
}

export interface sharedStep {
  SharedStep_ID: number;
  SharedStep_Title: string;
}

export interface defect {
  Defect_ID: number;
  Defect_Title: string;
  Defect_ActualResult: string;
  Defect_Milestone: number;
  Defect_Severity: number;
  Defect_Assignee: number;
  Defect_Author: number;
  Defect_Status: number;
  Defect_DateCreated: string;
}

export interface defectComment {
  Comment_ID: number;
  Comment_Content: string;
  Comment_Date: string;
  User_ID: number;
  Case_ID: number;
  Defect_ID: number;
}

export interface milestone {
  Milestone_ID: number;
  Milestone_Title: string;
  Milestone_Description: string;
  Milestone_Status: number;
  Milestone_DueDate: string;
}

export interface testplan {
  TestPlan_ID: number;
  TestPlan_Title: string;
  TestPlan_Description: string;
  TestPlan_CaseCount: number;
  TestPlan_RunTime: string;
  Case_ID: number;
}

export interface testrun {
  TestRun_ID: number;
  TestRun_Title: string;
  TestRun_Desc: number;
  TestPlan_ID: number;
  TestRun_Environment: number;
  TestRun_Milestone: number;
  User_ID: number;
  TestRun_Tags: string;
  TestRun_CompletionRange: number;
  TestRun_DateCreated: number;
}
