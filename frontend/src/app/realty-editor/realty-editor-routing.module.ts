import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RealtyObjEditComponent} from './realty-obj-edit/realty-obj-edit.component';

const routes: Routes = [
  {
    path: '',
    component: RealtyObjEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RealtyEditorRoutingModule {
}
