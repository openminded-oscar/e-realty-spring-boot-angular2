import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LeafletModule} from '@bluehalo/ngx-leaflet';
import {ArchwizardModule} from '@rg-software/angular-archwizard';
import {RealtyObjEditComponent} from './realty-obj-edit/realty-obj-edit.component';
import {SharedModule} from '../shared/shared.module';
import {SelectObjectLocationComponent} from './select-object-location/select-object-location.component';
import {RealtyEditorRoutingModule} from './realty-editor-routing.module';

@NgModule({
  declarations: [RealtyObjEditComponent, SelectObjectLocationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RealtyEditorRoutingModule,
    ArchwizardModule,
    LeafletModule
  ]
})
export class RealtyEditorModule { }
