import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {RealtyObjsGalleryComponent} from './realty-objs-gallery/realty-objs-gallery.component';
import {RealtyObjDetailsComponent} from './realty-obj-details/realty-obj-details.component';
import {RealtyObjEditComponent} from './realty-obj-edit/realty-obj-edit.component';
import {RealtorsGalleryComponent} from './realtor/realtors-gallery/realtors-gallery.component';
import {AddUpdateRealtorComponent} from './realtor/add-update-realtor/add-update-realtor.component';
import {AuthGuard} from './guargs/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: RealtyObjsGalleryComponent,
    pathMatch: 'full'
  },
  {
    path: 'home/buy',
    component: RealtyObjsGalleryComponent,
  },
  {
    path: 'home/rent',
    component: RealtyObjsGalleryComponent,
  },
  {
    path: 'home/view-obj/:realterId',
    component: RealtyObjDetailsComponent
  },
  {
    path: 'sell',
    component: RealtyObjEditComponent
  },
  {
    path: 'sell/:realterId',
    canActivate: [AuthGuard],
    component: RealtyObjEditComponent
  },
  {
    path: 'realtors',
    component: RealtorsGalleryComponent
  },
  {
    path: 'realtor',
    component: AddUpdateRealtorComponent
  },
  {
    path: 'realtor/:realterId',
    component: AddUpdateRealtorComponent
  },
  {
    path: 'login/oauth2/code/google',
    redirectTo: 'home/buy',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(
      appRoutes
    ),
    CommonModule
  ]
})
export class HomeModule {
}
