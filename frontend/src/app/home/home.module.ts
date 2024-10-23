import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRoutingModule} from './home-routing.module';
import {ArchwizardModule} from 'angular-archwizard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RealtyObjsGalleryComponent} from './realty-objs-gallery/realty-objs-gallery.component';
import {SharedModule} from '../shared/shared.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {RealtyObjDetailsComponent} from './realty-obj-details/realty-obj-details.component';
import {ReviewsService} from '../app-services/reviews.service';

@NgModule({
  declarations: [
    RealtyObjsGalleryComponent,
    RealtyObjDetailsComponent,
  ],
  imports: [
    HomeRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    ArchwizardModule,
  ],
  providers: [ReviewsService]
})
export class HomeModule {
}
