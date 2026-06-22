import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RealtorsGalleryComponent} from './realtors-gallery/realtors-gallery.component';

const routes: Routes = [
  {
    path: '',
    component: RealtorsGalleryComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RealtorRoutingModule {
}
