import { Component, OnInit } from '@angular/core';
import {RealterService} from "../../services/realter.service";
import {Realter} from "../../domain/realter";
import {NotificationsService} from "angular2-notifications";
import {ActivatedRoute} from "@angular/router";
import {apiBase} from "../../commons";
import {Photo} from "../../domain/photo";
import {FileUploadService} from "../../services/file-upload.service";

@Component({
  selector: 'app-add-update-realter',
  templateUrl: './add-update-realtor.component.html',
  styleUrls: ['./add-update-realtor.component.scss']
})
export class AddUpdateRealtorComponent implements OnInit {
  realter: Realter;
  realterId: string;

  constructor(private realterService: RealterService,
              private fileUploadService: FileUploadService,
              private route: ActivatedRoute,
              private _notification: NotificationsService) {
  }

  ngOnInit() {
    this.realter = {
      name: '',
      surname: '',
      photo: null
    };

    this.route.params.subscribe(params => {
      this.realterId  = params['realterId'];
      if (this.realterId) {
        this.realterService.findById(this.realterId)
          .subscribe((realter: Realter) => {
            this.realter = realter;
          })
      }
    });
  }

  save() {
    if(this.realterId){
      this.realterService.updateRealter(this.realter, this.realterId)
        .subscribe(realter => {
          this._notification.success('Realter was added');
        });
    } else {
      this.realterService.saveRealter(this.realter)
        .subscribe(realter => {
          this._notification.success('Realter was added');
        });
    }
  }

  onRealterPhotoSelecting(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.fileUploadService.upload(file, apiBase + "/upload-photo/profile")
        .subscribe(
          data => {
            this.realter.photo = data;
            this.realter.photo.photoFullUrl = Photo.getLinkByFilename(data.filename);
          },
          error => console.log(error)
        );
    }
  }

  deletePhoto() {
    alert('not yet implemented')
  }
}
