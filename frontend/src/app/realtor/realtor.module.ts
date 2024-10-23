import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RealtorsGalleryComponent} from './realtors-gallery/realtors-gallery.component';
import {RouterModule, Routes} from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    component: RealtorsGalleryComponent,
    pathMatch: 'full'
  }
  ];

@NgModule({
  declarations: [RealtorsGalleryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(
      appRoutes
    ),
  ]
})
export class RealtorModule { }
