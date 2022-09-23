import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
// import { defect } from '../../../../models/project/project.model';

export interface testCase {
  result: number;
  title: string;
  time: string;
}

export interface defect {
  id: number;
  title: string;
  status: number;
}

export interface stat {
  user: string;
  role: string;
  time: string;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  invalid: number;
}

const caseData: testCase[] = [
  { result: 1, title: 'Login user for the first time', time: "00:00:00"},
  { result: 0, title: 'Login user', time: "00:00:04"},
  { result: 0, title: 'Login user without verifying email', time: "00:00:12"}
];

const defectData: defect[] = [
  { id: 1, title: 'Login user', status: 1},
  { id: 2, title: 'Login user without verifying email', status: 2}
];

const statData: stat[] = [
  { user: 'User 1', role: "Administrator", time: "00:00:12", passed: 1, failed: 1, blocked: 1, skipped: 1, invalid: 1 },
  { user: 'User 2', role: "Administrator", time: "00:00:12", passed: 1, failed: 1, blocked: 1, skipped: 1, invalid: 1 },
  { user: 'User 3', role: "Administrator", time: "00:00:12", passed: 1, failed: 1, blocked: 1, skipped: 1, invalid: 1 }
];

@Component({
  selector: 'app-run-dashboard',
  templateUrl: './run-dashboard.component.html',
  styleUrls: ['./run-dashboard.component.css']
})
export class RunDashboardComponent implements OnInit {

  caseColumns: string[] = ['Checkbox', 'Result', 'Title', 'Assignee', 'TimeSpent', 'ThreeDots'];
  caseDataSource = new MatTableDataSource<testCase>(caseData);

  defectColumns: string[] = ['ID', 'Title', 'ReportedBy', 'DefectAssignee', 'External', 'Status', 'ThreeDots'];
  defectDataSource = new MatTableDataSource<defect>(defectData);

  statColumns: string[] = ['Image', 'User', 'StatTimeSpent', 'Passed', 'Failed', 'Blocked', 'Skipped', 'Invalid'];
  statDataSource = new MatTableDataSource<stat>(statData);

  @ViewChild('casePanel') casePanel!: ElementRef;
  @ViewChild('caseRunPanel') caseRunPanel!: ElementRef;

  constructor() { }

  ngOnInit(): void { }

  openCasePanel() {
    this.casePanel.nativeElement.style.display = "flex";
    this.closeCaseRunPanel();
  }

  closeCasePanel() {
    this.casePanel.nativeElement.style.display = "none";
  }

  openCaseRunPanel() {
    this.caseRunPanel.nativeElement.style.display = "flex";
    this.closeCasePanel();
  }

  closeCaseRunPanel() {
    this.caseRunPanel.nativeElement.style.display = "none";
  }

}
