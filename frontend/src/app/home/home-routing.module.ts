import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {RealtyObjsGalleryComponent} from './realty-objs-gallery/realty-objs-gallery.component';
import {RealtyObjDetailsComponent} from './realty-obj-details/realty-obj-details.component';
import {AuthGuard} from '../app-guards/auth.guard';
import {RealtyObjDetailsContainerComponent} from './realty-obj-details/realty-obj-details-container.component';
import {ReviewAction} from '../app-models/review';

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
    loadChildren: () =>
      import('../realty-editor/realty-editor.module').then(m => m.RealtyEditorModule),
  },
  {
    path: 'realty-object/:objectId',
    component: RealtyObjDetailsContainerComponent
  },
  {
    path: 'realty-object/:objectId/cancel-review/:reviewId',
    component: RealtyObjDetailsContainerComponent,
    data: { reviewActionType: ReviewAction.CANCEL }
  },
  {
    path: 'realty-object/:objectId/confirm-review/:reviewId',
    component: RealtyObjDetailsContainerComponent,
    data: { reviewActionType: ReviewAction.CONFIRM }
  },
  {
    path: 'realty-object/:objectId/editor',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../realty-editor/realty-editor.module').then(m => m.RealtyEditorModule),
  },
  {
    path: 'rent',
    component: RealtyObjsGalleryComponent,
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
