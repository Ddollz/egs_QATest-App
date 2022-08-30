import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EgsLoginComponent } from './egs-login/egs-login.component';
import { EgsRegistrationComponent } from './egs-registration/egs-registration.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './egs-project/projects/projects.component';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { UserComponent } from './egs-workspace/user/user.component';
import { RolesComponent } from './egs-workspace/roles/roles.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestRunComponent } from './egs-project/projects/test-run/test-run.component';
import { CreateComponent } from './egs-project/projects/create/create.component';
import { TestPlanComponent } from './egs-project/projects/test-plan/test-plan.component';
import { CreatePlanComponent } from './egs-project/projects/test-plan/create-plan/create-plan.component';
import { RouteGuardService } from './services/route-guard.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { RepositoriesComponent } from './egs-project/projects/repositories/repositories.component';
import { SuiteComponent } from './egs-project/projects/repositories/suite/suite.component';
import { CaseComponent } from './egs-project/projects/repositories/case/case.component';
import { CaseCreateComponent } from './egs-project/projects/repositories/case-create/case-create.component';


//Link Routes
const appRoute: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: "full" },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/create', component: CreateComponent },
  { path: 'projects/repository/:id', component: RepositoriesComponent },
  { path: 'projects/repository/create/:id', component: CaseCreateComponent },
  { path: 'projects/run', component: TestRunComponent },
  { path: 'projects/plan', component: TestPlanComponent },
  { path: 'projects/plan/createplan', component: CreatePlanComponent },
  { path: 'workspace/user', component: UserComponent },
  { path: 'workspace/roles', component: RolesComponent },
  { path: 'login', component: EgsLoginComponent },
  { path: 'register', component: EgsRegistrationComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    EgsLoginComponent,
    EgsRegistrationComponent,
    ProjectsComponent,
    HeaderComponent,
    SideBarComponent,
    UserComponent,
    RolesComponent,
    TestRunComponent,
    CreateComponent,
    TestPlanComponent,
    CreatePlanComponent,
    RepositoriesComponent,
    SuiteComponent,
    CaseComponent,
    CaseCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    RouterModule.forRoot(appRoute),
    BrowserAnimationsModule
  ],
  providers: [RouteGuardService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
