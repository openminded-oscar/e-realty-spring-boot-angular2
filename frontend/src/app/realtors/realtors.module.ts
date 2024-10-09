import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {RealtorsGalleryComponent} from '../realtor/realtors-gallery/realtors-gallery.component';


@NgModule({
  declarations: [
    RealtorsGalleryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: RealtorsGalleryComponent,
    }]),
  ]
})
export class RealtorsModule {
}
