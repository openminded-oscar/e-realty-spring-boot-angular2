import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LeafletModule} from '@bluehalo/ngx-leaflet';
import {ArchwizardModule} from '@rg-software/angular-archwizard';
import {RealtyObjEditComponent} from './realty-obj-edit/realty-obj-edit.component';
import {SharedModule} from '../shared/shared.module';
import {SelectObjectLocationComponent} from './select-object-location/select-object-location.component';

export const routes: Routes = [
  {
    path: '',
    component: RealtyObjEditComponent
  }
];

@NgModule({
  declarations: [RealtyObjEditComponent, SelectObjectLocationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ArchwizardModule,
    LeafletModule
  ]
})
export class RealtyEditorModule { }
