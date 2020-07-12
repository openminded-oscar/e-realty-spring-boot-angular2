import { Component, OnInit } from '@angular/core';
import {RealterService} from "../services/realter.service";
import {Realter} from "../domain/realter";
import {NotificationsService} from "angular2-notifications";

@Component({
  selector: 'app-add-update-realter',
  templateUrl: './add-update-realtor.component.html',
  styleUrls: ['./add-update-realtor.component.css']
})
export class AddUpdateRealtorComponent implements OnInit {
  realter: Realter;
  constructor(private realterService: RealterService,
              private _notification: NotificationsService,) { }

  ngOnInit() {
    this.realter = {
      name: '',
      surname: '',
      photoFilename: ''
    }
  }

  add(){
    this.realterService.addRealter(this.realter)
      .subscribe(realter => {
        this._notification.success('Realter was added');
      });
  }
}
