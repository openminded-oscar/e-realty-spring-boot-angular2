import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RealtyObjsListComponent} from './realty-objs-list/realty-objs-list.component';
import {RouterModule} from '@angular/router';
import {DeleteRealtyModalComponent} from './delete-realty-modal/delete-realty-modal.component';
import {ScheduleFormModalComponent} from './schedule-form-modal/schedule-form-modal.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {ConfirmModalComponent} from './confirm-modal/confirm-modal.component';
import {RealtyObjCardComponent} from './realty-obj-card/realty-obj-card.component';

const components = [
  RealtyObjsListComponent,
  DeleteRealtyModalComponent,
  ScheduleFormModalComponent,
  ConfirmModalComponent,
  RealtyObjCardComponent
];

@NgModule({
  declarations: [...components],
  exports: [
    ...components
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
}
