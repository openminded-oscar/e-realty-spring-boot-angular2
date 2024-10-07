import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
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


export const MyObjectsTabPath = 'my-objects';
export const MyReviewsTabPath = 'reviews';
export const MyFavoritesTabPath = 'favorites';

const routes: Routes = [
  {
    path: '', component: UserCabinetContainerComponent,
    children: [
      {
        path: '',
        redirectTo: MyObjectsTabPath,
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
      }
    ]
  },

];

@NgModule({
  declarations: [
    UserProfileViewEditComponent,
    UserObjectsComponent,
    UserReviewsComponent,
    UserCabinetContainerComponent,
    UserFavoritesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbNavModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class UserCabinetModule {
}
