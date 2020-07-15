import { Component, OnInit } from '@angular/core';
import {RealtyObj} from "../domain/realty-obj";
import {RealtyObjService} from "../services/realty-obj.service";
import {ActivatedRoute} from "@angular/router";
import {Photo, RealtyPhoto} from "../domain/photo";
import {UserService} from "../services/user.service";
import {InterestService} from "../services/interest.service";
import {Interest} from "../domain/interest";

@Component({
  selector: 'app-realty-obj-details',
  templateUrl: './realty-obj-details.component.html',
  styleUrls: ['./realty-obj-details.component.scss']
})
export class RealtyObjDetailsComponent implements OnInit {
  currentObject: RealtyObj;
  enlargedPhoto: RealtyPhoto;

  isInterested: boolean = false;

  constructor(private realtyObjService: RealtyObjService,
              private userService: UserService,
              private interestService: InterestService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id  = params['realterId'];
      if (id) {
        this.realtyObjService.findById(id)
          .subscribe(realtyObj => {
            this.enlargedPhoto = RealtyObj.getMainPhoto(realtyObj);
            this.currentObject = realtyObj;

            this.initObjectRelatedData();
          })
      }
    });
  }

  setEnlargedPhoto(photo: RealtyPhoto) {
    this.enlargedPhoto = Photo.getLinkByFilename(photo.filename);
  }

  saveInterested() {
    const interest: Interest = {
      userId: this.userService.user.id,
      realtyObjId: this.currentObject.id
    };

    this.interestService.save(interest)
      .subscribe(interest => {
        this.isInterested = true;
      });
  }

  removeInterested() {
    this.interestService.remove(this.userService.user.id, this.currentObject.id)
      .subscribe(interest => {
        this.isInterested = false;
      });
  }

  private initObjectRelatedData() {
    this.interestService.get(this.userService.user.id, this.currentObject.id)
      .subscribe(interestResponse => {
        if(interestResponse.body) {
          this.isInterested = true;
        }
      });
  }
}
