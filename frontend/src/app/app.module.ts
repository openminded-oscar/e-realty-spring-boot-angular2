import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { RealtyObjEditComponent } from './realty-obj-edit/realty-obj-edit.component';
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
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SimpleNotificationsModule} from "angular2-notifications";
import { RealtyObjsGalleryComponent } from './realty-objs-gallery/realty-objs-gallery.component';
import {RouterModule, Routes} from "@angular/router";


const appRoutes: Routes = [
  { path: 'sell', component: RealtyObjEditComponent },
  { path: 'buy', component: RealtyObjsGalleryComponent },
  { path: '',
    redirectTo: '/buy',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    RealtyObjEditComponent,
    AddressInputComponent,
    UserRegionInputComponent,
    RealtyObjsGalleryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    NgbModule.forRoot(),
    ArchwizardModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot()
  ],
  providers: [AddressService, ConfigService, FileUploadService, RealtyObjService],
  bootstrap: [AppComponent]
})
export class AppModule { }
