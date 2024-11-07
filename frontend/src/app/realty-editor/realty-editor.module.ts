import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RealtyObjEditComponent} from './realty-obj-edit/realty-obj-edit.component';
import {ArchwizardModule} from 'angular-archwizard';
import {SharedModule} from '../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import { SelectLocationDialogComponent } from './realty-obj-edit/select-location-dialog/select-location-dialog.component';

export const routes: Routes = [
  {
    path: '',
    component: RealtyObjEditComponent
  }
];

@NgModule({
  declarations: [RealtyObjEditComponent, SelectLocationDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ArchwizardModule,
    LeafletModule
  ]
})
export class RealtyEditorModule { }
