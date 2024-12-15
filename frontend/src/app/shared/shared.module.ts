import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbToastModule,
    NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RealtyObjsListComponent} from './realty-objs-list/realty-objs-list.component';
import {DeleteRealtyModalComponent} from './delete-realty-modal/delete-realty-modal.component';
import {ScheduleFormModalComponent} from './schedule-form-modal/schedule-form-modal.component';
import {ConfirmModalComponent} from './confirm-modal/confirm-modal.component';
import {
    RealtyObjCardDetailsComponent
} from './realty-obj-card/realty-obj-card-details/realty-obj-card-details.component';
import {RealtorContactComponent} from './realtor-contact/realtor-contact.component';
import {RealtyStatusComponent} from './realty-status/realty-status.component';
import {MessageModalComponent} from './message-modal/message-modal.component';
import {ReviewsListComponent} from '../user-cabinet/reviews/app-reviews-list/reviews-list.component';
import {ReviewsFilterComponent} from '../user-cabinet/reviews/app-reviews-filter/reviews-filter.component';
import {RealtyObjCardComponent} from './realty-obj-card/realty-obj-card.component';
import {RealtyObjReviewCardComponent} from './realty-obj-card/realty-obj-review-card.component';
import {CancelReviewModalComponent} from './cancel-review-modal/cancel-review-modal.component';
import {
    ObjectsInProfileFilterComponent
} from '../user-cabinet/user-objects/objects-in-profile-filter/objects-in-profile-filter.component';
import {ApproveReviewModalComponent} from './approve-review-modal/approve-review-modal.component';

const components = [
    ObjectsInProfileFilterComponent,
    RealtorContactComponent,
    ReviewsListComponent,
    ReviewsFilterComponent,
    RealtyObjsListComponent,
    RealtyObjCardDetailsComponent,
    RealtyObjCardComponent,
    RealtyObjReviewCardComponent,
    DeleteRealtyModalComponent,
    ScheduleFormModalComponent,
    ConfirmModalComponent,
    ApproveReviewModalComponent,
    CancelReviewModalComponent,
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
