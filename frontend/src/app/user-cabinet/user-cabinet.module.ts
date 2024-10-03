import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {UserObjectsComponent} from './user-objects/user-objects.component';
import {UserReviewsComponent} from './user-reviews/user-reviews.component';
import {UserCabinetContainerComponent} from './user-cabinet-container/user-cabinet-container.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: UserCabinetContainerComponent,
  }
];

@NgModule({
  declarations: [
    UserProfileComponent,
    UserObjectsComponent,
    UserReviewsComponent,
    UserCabinetContainerComponent
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
