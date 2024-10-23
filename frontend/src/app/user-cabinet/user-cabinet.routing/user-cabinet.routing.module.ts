import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UserCabinetContainerComponent} from '../user-cabinet-container/user-cabinet-container.component';
import {UserObjectsComponent} from '../user-objects/user-objects.component';
import {UserReviewsComponent} from '../user-reviews/user-reviews.component';
import {UserFavoritesComponent} from '../user-favorites/user-favorites.component';
import {
  MyFavoritesTabPath,
  MyObjectsTabPath,
  MyReviewsTabPath,
  RealtorObjectsTabPath,
  RealtorReviewsTabPath
} from '../utils';
import {RealtorObjectsComponent} from '../realtor-objects/realtor-objects.component';
import {RealtorReviewsComponent} from '../realtor-reviews/realtor-reviews.component';

const routes: Routes = [
  {
    path: '', component: UserCabinetContainerComponent,
    children: [
      {
        path: '',
        redirectTo: MyObjectsTabPath,
        pathMatch: 'full',
      },
      {
        path: MyObjectsTabPath,
        component: UserObjectsComponent,
      },
      {
        path: MyReviewsTabPath,
        component: UserReviewsComponent,
      },
      {
        path: MyFavoritesTabPath,
        component: UserFavoritesComponent,
      },
      {
        path: RealtorObjectsTabPath,
        component: RealtorObjectsComponent,
      },
      {
        path: RealtorReviewsTabPath,
        component: RealtorReviewsComponent,
      },
    ]
  },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class UserCabinetRoutingModule { }
