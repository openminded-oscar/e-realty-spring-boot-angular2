import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LeafletModule} from '@bluehalo/ngx-leaflet';
import {ArchwizardModule} from '@rg-software/angular-archwizard';
import {InfiniteScrollDirective} from 'ngx-infinite-scroll';
import {HomeRoutingModule} from './home-routing.module';

import {RealtyObjsGalleryComponent} from './realty-objs-gallery/realty-objs-gallery.component';
import {SharedModule} from '../shared/shared.module';
import {RealtyObjDetailsComponent} from './realty-obj-details/realty-obj-details.component';
import {ReviewsService} from '../app-services/reviews.service';
import {DisplayLocationComponent} from './display-location/display-location.component';
import {GeolocationWidgetComponent} from './realty-objs-gallery/geolocation-widget/geolocation-widget.component';
import {
  GeolocationWidgetModalComponent
} from './realty-objs-gallery/geolocation-widget-modal/geolocation-widget-modal.component';
import {RealtyObjDetailsContainerComponent} from './realty-obj-details/realty-obj-details-container.component';

@NgModule({
  declarations: [
    GeolocationWidgetComponent,
    GeolocationWidgetModalComponent,
    RealtyObjsGalleryComponent,
    RealtyObjDetailsComponent,
    RealtyObjDetailsContainerComponent,
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
