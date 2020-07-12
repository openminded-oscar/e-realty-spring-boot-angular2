import { Component, OnInit } from '@angular/core';
import {RealterService} from "../services/realter.service";
import {Realter} from "../domain/realter";
import {NotificationsService} from "angular2-notifications";
import {RealtyObjService} from "../services/realty-obj.service";
import {ActivatedRoute} from "@angular/router";
import {RealtyObj} from "../domain/realty-obj";

@Component({
  selector: 'app-add-update-realter',
  templateUrl: './add-update-realtor.component.html',
  styleUrls: ['./add-update-realtor.component.css']
})
export class AddUpdateRealtorComponent implements OnInit {
  realter: Realter;

  constructor(private realterService: RealterService,
              private route: ActivatedRoute,
              private _notification: NotificationsService) {
  }

  ngOnInit() {
    this.realter = {
      name: '',
      surname: '',
      photoFilename: ''
    };

    this.route.params.subscribe(params => {
      const id  = params['id'];
      if (id) {
        this.realterService.findById(id)
          .subscribe((realter: Realter) => {
            this.realter = realter;
          })
      }
    });
  }

  add() {
    this.realterService.addRealter(this.realter)
      .subscribe(realter => {
        this._notification.success('Realter was added');
      });
  }
}
