import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RealtyObjEditComponent} from './realty-obj-edit/realty-obj-edit.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {SelectLocationComponent} from './select-location/select-location.component';
import {ArchwizardModule} from '@achimha/angular-archwizard';

export const routes: Routes = [
  {
    path: '',
    component: RealtyObjEditComponent
  }
];

@NgModule({
  declarations: [RealtyObjEditComponent, SelectLocationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ArchwizardModule,
    LeafletModule
  ]
})
export class RealtyEditorModule { }
