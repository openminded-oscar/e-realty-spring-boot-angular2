import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {ConfigService} from "../services/config.service";
import {FileUploadService} from "../services/file-upload.service";
import {endpoints, apiBase} from "../commons";
import {RealtyObj} from "../domain/realty-obj";
import {RealtyObjService} from "../services/realty-obj.service";
import {NotificationsService} from "angular2-notifications";
import {RealtyPhotoType} from "../domain/photo";


@Component({
  selector: 'new-object',
  templateUrl: './realty-obj-edit.component.html',
  styleUrls: ['./realty-obj-edit.css']
})
export class RealtyObjEditComponent implements OnInit, OnChanges {
  @Input()
  public realtyObj: RealtyObj;

  public realters: string[];
  public dwellingTypes: string[];
  public buildingTypes: string[];
  public supportedOperations: any[];
  public photoType = RealtyPhotoType;

  public get targetOperations() {
    return this.supportedOperations
      .filter(opt => opt.checked)
      .map(opt => opt.value)
  }

  public constructor(public config: ConfigService,
                     public fileUploadService: FileUploadService,
                     public realtyObjService: RealtyObjService,
                     private _notification: NotificationsService) {
  }

  public ngOnInit() {
    this.realtyObj = new RealtyObj();
    this.realters = ["Petro Petrenko", "Pavlo Pavlenko", "Andriy Andriyenko", "Ivan Ivanenko"];
    this.supportedOperations = this.config.supportedOperations
      .map((value, index, array) => <any> {value: value, name: value, checked: false});
    this.dwellingTypes = this.config.supportedDwellingTypes;
    this.buildingTypes = this.config.supportedBuildingTypes;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.supportedOperations = this.config.supportedOperations.map((value, index, array) => <any>{
      value: value,
      name: value,
      checked: this.realtyObj.checkIfOperationSupported(value)
    });
  }

  saveRealtyObject() {
    this.realtyObjService.save(this.realtyObj).subscribe((data: RealtyObj) => {
      this._notification.success('Success!', 'the object was added!');
      this.realtyObj = data;
    }, error => {
      this._notification.error('Failure!', 'the object adding failed!');
    });
  }

  onVerificationPictureSelecting(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.fileUploadService.upload(file, apiBase + "/upload-photo")
        .subscribe(
          data => {
            this.realtyObj.verificationPhoto = {
              link: (endpoints.pictures + data.filename),
              filename: data.filename,
              id: data.id
            };
          },
          error => console.log(error)
        );
      ;
    }
  }

  onRealtyObjPictureSelecting(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.fileUploadService.upload(file, apiBase + "/upload-photo")
        .subscribe(
          data => {
            let type = (this.realtyObj.photos.length == 0) ? RealtyPhotoType.REALTY_MAIN : RealtyPhotoType.REALTY_PLAIN;
            this.realtyObj.photos.push({
              link: (endpoints.pictures + data.filename),
              filename: data.filename,
              id: data.id,
              type: type
            })
          },
          error => console.log(error)
        );
      ;
    }
  }

  makeMain(picture) {
    this.realtyObj.photos.forEach(picture => {
      picture.type = RealtyPhotoType.REALTY_PLAIN;
    });

    picture.type = RealtyPhotoType.REALTY_MAIN;
  }
}
