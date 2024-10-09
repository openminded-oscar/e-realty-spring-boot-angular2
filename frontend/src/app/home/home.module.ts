import {NgModule} from '@angular/core';
import {HomeRoutingModule} from './home-routing.module';
import {SharedModule} from '../shared/shared.module';
import {ArchwizardModule} from 'angular-archwizard';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {RealtyObjEditComponent} from '../realty-obj-edit/realty-obj-edit.component';
import {AddressInputComponent} from '../address-input/address-input.component';
import {UserRegionInputComponent} from '../commons/user-region-input/user-region-input.component';
import {RealtyObjsGalleryComponent} from '../realty-objs-gallery/realty-objs-gallery.component';
import {RealtyObjDetailsComponent} from '../realty-obj-details/realty-obj-details.component';
import {RealtorContactComponent} from '../realtor/realtor-contact/realtor-contact.component';

@NgModule({
  declarations: [
    RealtyObjEditComponent,
    AddressInputComponent,
    UserRegionInputComponent,
    RealtyObjsGalleryComponent,
    RealtyObjDetailsComponent,
    RealtorContactComponent,
  ],
  imports: [
    ArchwizardModule,
    SharedModule,
    NgbModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    FormsModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule {
}
