import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RealtyObjEditComponent} from './realty-obj-edit/realty-obj-edit.component';
import {ArchwizardModule} from 'angular-archwizard';
import {SharedModule} from '../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: RealtyObjEditComponent
  }
];

@NgModule({
  declarations: [RealtyObjEditComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ArchwizardModule
  ]
})
export class RealtyEditorModule { }
