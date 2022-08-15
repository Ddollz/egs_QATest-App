import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EgsLoginComponent } from './egs-login/egs-login.component';
import { EgsRegistrationComponent } from './egs-registration/egs-registration.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './egs-project/projects/projects.component';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { EgsWorkspaceComponent } from './egs-workspace/egs-workspace.component';
import { UserComponent } from './egs-workspace/user/user.component';
import { RolesComponent } from './egs-workspace/roles/roles.component';
import { RepositoryComponent } from './egs-project/projects/repository/repository.component';

//Link Routes
const appRoute: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: "full" },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/repository', component: RepositoryComponent },
  { path: 'workspace', component: EgsWorkspaceComponent },
  { path: 'workspace/user', component: UserComponent },
  { path: 'workspace/user/:id:test', component: UserComponent },
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
    EgsWorkspaceComponent,
    UserComponent,
    RolesComponent,
    RepositoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoute)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
