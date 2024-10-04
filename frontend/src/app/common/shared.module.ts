import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RealtyObjsListComponent} from './realty-objs-list/realty-objs-list.component';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [RealtyObjsListComponent],
  exports: [
    RealtyObjsListComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule {
}
