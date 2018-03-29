import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NewObjectComponent } from './new-object/new-object.component';
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AddressService} from "./address.service";


@NgModule({
  declarations: [
    AppComponent,
    NewObjectComponent
  ],
  imports: [
    BrowserModule, FormsModule, NgbModule.forRoot()
  ],
  providers: [AddressService],
  bootstrap: [AppComponent]
})
export class AppModule { }
