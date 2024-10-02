import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserObjectsComponent} from './user-objects/user-objects.component';
import {UserReviewsComponent} from './user-reviews/user-reviews.component';
import {RouterModule, Routes} from '@angular/router';
import {UserCabinetContainerComponent} from './user-cabinet-container/user-cabinet-container.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: UserCabinetContainerComponent,
    children: [{
      path: '',
      component: UserProfileComponent
    }]
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
    NgbNavModule
  ]
})
export class UserCabinetModule {
}
