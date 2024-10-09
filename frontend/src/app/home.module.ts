import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {RealtyObjsGalleryComponent} from './realty-objs-gallery/realty-objs-gallery.component';
import {RealtyObjDetailsComponent} from './realty-obj-details/realty-obj-details.component';
import {RealtyObjEditComponent} from './realty-obj-edit/realty-obj-edit.component';
import {RealtorsGalleryComponent} from './realtor/realtors-gallery/realtors-gallery.component';
import {AuthGuard} from './guargs/auth.guard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from './shared/shared.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {AddressInputComponent} from './address-input/address-input.component';
import {UserRegionInputComponent} from './commons/user-region-input/user-region-input.component';
import {RealtorContactComponent} from './realtor/realtor-contact/realtor-contact.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ArchwizardModule} from 'angular-archwizard';

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
  declarations: [
    RealtyObjEditComponent,
    AddressInputComponent,
    UserRegionInputComponent,
    RealtyObjsGalleryComponent,
    RealtyObjDetailsComponent,
    RealtorsGalleryComponent,
    RealtorContactComponent,
  ],
  imports: [
    ArchwizardModule,
    SharedModule,
    NgbModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(
      appRoutes
    ),
    CommonModule
  ]
})
export class HomeModule {
}
