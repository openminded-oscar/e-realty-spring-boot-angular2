import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {HomeRoutingModule} from './home-routing.module';
import {ArchwizardModule} from 'angular-archwizard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RealtyObjsGalleryComponent} from './realty-objs-gallery/realty-objs-gallery.component';
import {SharedModule} from '../shared/shared.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {RealtyObjDetailsComponent} from './realty-obj-details/realty-obj-details.component';
import {ReviewsService} from '../app-services/reviews.service';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {DisplayLocationComponent} from './display-location/display-location.component';
import {LocationFilterComponent} from './realty-objs-gallery/location-filter/location-filter.component';

@NgModule({
  declarations: [
    LocationFilterComponent,
    RealtyObjsGalleryComponent,
    RealtyObjDetailsComponent,
    DisplayLocationComponent,
  ],
    imports: [
        HomeRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule,
        LeafletModule,
        InfiniteScrollModule,
        ReactiveFormsModule,
        ArchwizardModule,
        NgOptimizedImage,
    ],
  providers: [ReviewsService]
})
export class HomeModule {
}
