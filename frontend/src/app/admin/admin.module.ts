import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../shared/shared.module';
import {UserManagementComponent} from './user-management/user-management.component';
import {AuthGuard} from '../app-guards/auth.guard';
import {RealtyObjectsManagementComponent} from './realty-objects-management/realty-objects-management.component';

const routes: Routes = [
    {
        path: 'users',
        component: UserManagementComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'realty-objects',
        component: RealtyObjectsManagementComponent,
        canActivate: [AuthGuard],
    }
];

@NgModule({
    declarations: [
        UserManagementComponent,
        RealtyObjectsManagementComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        NgbPagination,
        RouterModule.forChild(routes),
    ]
})
export class AdminModule {
}
