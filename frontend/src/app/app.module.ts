import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NewObjectComponent } from './new-object/new-object.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AddressService} from "./services/address.service";
import {HttpClientModule} from "@angular/common/http";
import { AddressInputComponent } from './address-input/address-input.component';
import {ArchwizardModule} from "angular-archwizard";
import { UserRegionInputComponent } from './user-region-input/user-region-input.component';
import {ConfigService} from "./services/config.service";
import {FileUploadService} from "./services/file-upload.service";
import {RealtyObjService} from "./services/realty-obj.service";


@NgModule({
  declarations: [
    AppComponent,
    NewObjectComponent,
    AddressInputComponent,
    UserRegionInputComponent
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule, NgbModule.forRoot(), ArchwizardModule
  ],
  providers: [AddressService, ConfigService, FileUploadService, RealtyObjService],
  bootstrap: [AppComponent]
})
export class AppModule { }
