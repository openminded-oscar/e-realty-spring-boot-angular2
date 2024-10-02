import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {UserObjectsComponent} from './user-objects/user-objects.component';
import {UserReviewsComponent} from './user-reviews/user-reviews.component';
import {RouterModule, Routes} from '@angular/router';
import {UserCabinetContainerComponent} from './user-cabinet-container/user-cabinet-container.component';

const routes: Routes = [
  {
    path: '',
    component: UserCabinetContainerComponent,
    children: [{
      path: '',
      component: UserProfileComponent
    },
      {
        path: 'objects',
        component: UserObjectsComponent
      },
      {
        path: 'reviews',
        component: UserReviewsComponent
      },
      {
        path: 'favorites',
        component: UserReviewsComponent
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
    RouterModule.forChild(routes)
  ]
})
export class UserCabinetModule {
}
