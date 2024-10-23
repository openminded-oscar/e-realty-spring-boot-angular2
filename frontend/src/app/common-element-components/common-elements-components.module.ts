import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../shared/shared.module';
import {UserRegionInputComponent} from './user-region-input/user-region-input.component';
import {AddressInputComponent} from './address-input/address-input.component';


@NgModule({
  declarations: [UserRegionInputComponent, AddressInputComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbTypeaheadModule
  ]
})
export class CommonElementsComponentsModule { }
