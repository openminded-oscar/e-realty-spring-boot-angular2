import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {UserManagementComponent} from './user-management/user-management.component';
import {AuthGuard} from '../app-guards/auth.guard';
import {FormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  declarations: [
    UserManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class AdminModule { }
