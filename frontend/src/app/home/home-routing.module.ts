import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {RealtyObjsGalleryComponent} from '../realty-objs-gallery/realty-objs-gallery.component';
import {RealtyObjDetailsComponent} from '../realty-obj-details/realty-obj-details.component';
import {RealtyObjEditComponent} from '../realty-obj-edit/realty-obj-edit.component';
import {AuthGuard} from '../guargs/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: RealtyObjsGalleryComponent,
    pathMatch: 'full'
  },
  {
    path: 'buy',
    component: RealtyObjsGalleryComponent,
  },
  {
    path: 'rent',
    component: RealtyObjsGalleryComponent,
  },
  {
    path: 'object-details/:objectId',
    component: RealtyObjDetailsComponent
  },
  {
    path: 'obj/editor',
    component: RealtyObjEditComponent
  },
  {
    path: 'obj/editor/:objectId',
    canActivate: [AuthGuard],
    component: RealtyObjEditComponent
  },
  {
    path: 'login/oauth2/code/google',
    redirectTo: 'buy',
    pathMatch: 'full'
  },
];


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes)
  ], exports: [RouterModule]
})
export class HomeRoutingModule { }
