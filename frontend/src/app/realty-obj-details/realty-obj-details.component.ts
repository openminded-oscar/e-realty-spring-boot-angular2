import { Component, OnInit } from '@angular/core';
import {RealtyObj} from "../domain/realty-obj";
import {RealtyObjService} from "../services/realty-obj.service";
import {ActivatedRoute} from "@angular/router";
import {Photo, RealtyPhoto} from "../domain/photo";

@Component({
  selector: 'app-realty-obj-details',
  templateUrl: './realty-obj-details.component.html',
  styleUrls: ['./realty-obj-details.component.css']
})
export class RealtyObjDetailsComponent implements OnInit {
  currentObject: RealtyObj;
  mainPhoto: RealtyPhoto;

  constructor(private realtyObjService: RealtyObjService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id  = params['realterId'];
      if (id) {
        this.realtyObjService.findById(id)
          .subscribe(realtyObj => {
            this.mainPhoto = RealtyObj.getMainPhoto(realtyObj);
            this.currentObject = realtyObj;
          })
      }
    });
  }
}
