import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
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
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}
