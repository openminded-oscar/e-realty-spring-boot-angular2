import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {UserProfileViewEditComponent} from './user-cabinet-container/user-profile-view-edit/user-profile-view-edit.component';
import {UserObjectsComponent} from './user-objects/user-objects.component';
import {UserReviewsComponent} from './user-reviews/user-reviews.component';
import {UserCabinetContainerComponent} from './user-cabinet-container/user-cabinet-container.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserInfoComponent } from './user-info/user-info.component';

const routes: Routes = [
  {
    path: '',
    component: UserCabinetContainerComponent,
  }
];

@NgModule({
  declarations: [
    UserProfileViewEditComponent,
    UserObjectsComponent,
    UserReviewsComponent,
    UserCabinetContainerComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbNavModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UserCabinetModule {
}
