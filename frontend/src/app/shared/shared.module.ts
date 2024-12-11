import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbToastModule, NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RealtyObjsListComponent} from './realty-objs-list/realty-objs-list.component';
import {DeleteRealtyModalComponent} from './delete-realty-modal/delete-realty-modal.component';
import {ScheduleFormModalComponent} from './schedule-form-modal/schedule-form-modal.component';
import {ConfirmModalComponent} from './confirm-modal/confirm-modal.component';
import {RealtyObjCardComponent} from './realty-obj-card/realty-obj-card.component';
import {RealtorContactComponent} from './realtor-contact/realtor-contact.component';
import { RealtyStatusComponent } from './realty-status/realty-status.component';
import { MessageModalComponent } from './message-modal/message-modal.component';
import {ReviewsListComponent} from '../user-cabinet/reviews/app-reviews-list/reviews-list.component';
import {ReviewsFilterComponent} from '../user-cabinet/reviews/app-reviews-filter/reviews-filter.component';

const components = [
  RealtorContactComponent,
  ReviewsListComponent,
  ReviewsFilterComponent,
  RealtyObjsListComponent,
  RealtyObjCardComponent,
  DeleteRealtyModalComponent,
  ScheduleFormModalComponent,
  ConfirmModalComponent,
  MessageModalComponent,
  RealtyStatusComponent
];

@NgModule({
  declarations: [...components],
  exports: [
    ...components,
    NgbModalModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbToastModule,
    NgbCollapseModule,
    FormsModule,
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbToastModule,
    NgbTooltipModule,
    NgbCollapseModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
}
