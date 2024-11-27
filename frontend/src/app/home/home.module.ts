import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {HomeRoutingModule} from './home-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RealtyObjsGalleryComponent} from './realty-objs-gallery/realty-objs-gallery.component';
import {SharedModule} from '../shared/shared.module';
import {RealtyObjDetailsComponent} from './realty-obj-details/realty-obj-details.component';
import {ReviewsService} from '../app-services/reviews.service';
import {LeafletModule} from '@bluehalo/ngx-leaflet';
import {DisplayLocationComponent} from './display-location/display-location.component';
import {GeolocationWidgetComponent} from './realty-objs-gallery/geolocation-widget/geolocation-widget.component';
import {
  GeolocationWidgetModalComponent
} from './realty-objs-gallery/geolocation-widget-modal/geolocation-widget-modal.component';
import {ArchwizardModule} from '@rg-software/angular-archwizard';
import {InfiniteScrollDirective} from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    GeolocationWidgetComponent,
    GeolocationWidgetModalComponent,
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
    ReactiveFormsModule,
    ArchwizardModule,
    NgOptimizedImage,
    InfiniteScrollDirective
  ],
  providers: [ReviewsService]
})
export class HomeModule {
}
