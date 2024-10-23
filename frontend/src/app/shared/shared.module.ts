import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RealtyObjsListComponent} from './realty-objs-list/realty-objs-list.component';
import {RouterModule} from '@angular/router';
import {DeleteRealtyModalComponent} from './delete-realty-modal/delete-realty-modal.component';
import {ScheduleFormModalComponent} from './schedule-form-modal/schedule-form-modal.component';
import {NgbDatepickerModule, NgbModalModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmModalComponent} from './confirm-modal/confirm-modal.component';
import {RealtyObjCardComponent} from './realty-obj-card/realty-obj-card.component';
import {RealtorContactComponent} from './realtor-contact/realtor-contact.component';

const components = [
  RealtorContactComponent,
  RealtyObjsListComponent,
  RealtyObjCardComponent,
  DeleteRealtyModalComponent,
  ScheduleFormModalComponent,
  ConfirmModalComponent,
];

@NgModule({
  declarations: [...components],
  exports: [
    ...components,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
}
