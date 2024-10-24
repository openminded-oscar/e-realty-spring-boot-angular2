import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {
  UserProfileViewEditComponent
} from './user-cabinet-container/user-profile-view-edit/user-profile-view-edit.component';
import {UserObjectsComponent} from './user-objects/user-objects.component';
import {UserReviewsComponent} from './user-reviews/user-reviews.component';
import {UserCabinetContainerComponent} from './user-cabinet-container/user-cabinet-container.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {UserFavoritesComponent} from './user-favorites/user-favorites.component';
import {UserCabinetRoutingModule} from './user-cabinet.routing/user-cabinet.routing.module';
import {RealtorObjectsComponent} from './realtor-objects/realtor-objects.component';
import {RealtorReviewsComponent} from './realtor-reviews/realtor-reviews.component';
import {ReviewsService} from '../app-services/reviews.service';


@NgModule({
  declarations: [
    UserProfileViewEditComponent,
    UserObjectsComponent,
    UserReviewsComponent,
    UserCabinetContainerComponent,
    UserFavoritesComponent,
    RealtorObjectsComponent,
    RealtorReviewsComponent
  ],
  imports: [
    UserCabinetRoutingModule,
    CommonModule,
    NgbNavModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgbTooltipModule
  ],
  providers: [ReviewsService]
})
export class UserCabinetModule {
}
