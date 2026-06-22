import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../shared/shared.module';
import {UserManagementComponent} from './user-management/user-management.component';
import {RealtyObjectsManagementComponent} from './realty-objects-management/realty-objects-management.component';
import {AdminRoutingModule} from './admin-routing.module';

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
        AdminRoutingModule,
    ]
})
export class AdminModule {
}
