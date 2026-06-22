import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RealtorsGalleryComponent} from './realtors-gallery/realtors-gallery.component';
import {RealtorRoutingModule} from './realtor-routing.module';

@NgModule({
  declarations: [RealtorsGalleryComponent],
  imports: [
    CommonModule,
    RealtorRoutingModule,
  ]
})
export class RealtorModule { }
