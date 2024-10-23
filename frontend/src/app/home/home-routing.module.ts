import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {RealtyObjsGalleryComponent} from '../realty-objs-gallery/realty-objs-gallery.component';
import {RealtyObjDetailsComponent} from '../realty-obj-details/realty-obj-details.component';
import {RealtyObjEditComponent} from '../realty-obj-edit/realty-obj-edit.component';
import {AuthGuard} from '../guargs/auth.guard';
import {RealtorsGalleryComponent} from '../realtor/realtors-gallery/realtors-gallery.component';

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
    path: 'realty-object/new',
    component: RealtyObjEditComponent
  },
  {
    path: 'realty-object/:objectId',
    component: RealtyObjDetailsComponent
  },
  {
    path: 'realty-object/:objectId/editor',
    canActivate: [AuthGuard],
    component: RealtyObjEditComponent
  },
  {
    path: 'rent',
    component: RealtyObjsGalleryComponent,
  },
  {
    path: 'realtors',
    component: RealtorsGalleryComponent
  },
  {
    path: 'login/oauth2/code/google',
    redirectTo: 'buy',
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
  ], exports: [RouterModule]
})
export class HomeRoutingModule { }
