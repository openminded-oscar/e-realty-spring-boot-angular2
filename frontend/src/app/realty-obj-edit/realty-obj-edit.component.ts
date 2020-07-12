import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {ActivatedRoute} from '@angular/router';
import {ConfigService} from "../services/config.service";
import {FileUploadService} from "../services/file-upload.service";
import {endpoints, apiBase} from "../commons";
import {RealtyObj} from "../domain/realty-obj";
import {RealtyObjService} from "../services/realty-obj.service";
import {NotificationsService} from "angular2-notifications";
import {Photo, RealtyPhoto, RealtyPhotoType} from "../domain/photo";
import {RealterService} from "../services/realter.service";


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
      .map(opt => opt.value);
  }

  public set targetOperations(operations: string[]) {
    operations.forEach(value => {
      this.supportedOperations.forEach((supportedOperation, index) => {
        if (supportedOperation.value === value && index == 0) {
          supportedOperation.checked = true;
        }
      });
    });
  }

  public constructor(public config: ConfigService,
                     public fileUploadService: FileUploadService,
                     public realtyObjService: RealtyObjService,
                     public realtersService: RealterService,
                     public _notification: NotificationsService,
                     public route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.supportedOperations = this.config.supportedOperations
      .map((value, index, array) => <any> {value: value, name: value, checked: false});
    this.dwellingTypes = this.config.supportedDwellingTypes;
    this.buildingTypes = this.config.supportedBuildingTypes;
    this.realtersService.getRealters().subscribe((gotRealters: any) => {
      this.realters = ['Andriy Andriyenko'];
      // ToDo add ui for realters adding
      // this.realters = gotRealters.map(realtor => realtor.user.name+" "+ realtor.user.surname);
    });

    this.realtyObj = new RealtyObj();
    // if passed object id in parameter then retrieve that object
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.realtyObjService.findById(+params['id']).subscribe(realtyObj => {
          this.realtyObj = <RealtyObj>realtyObj;
          this.realtyObj.photos.forEach(photo => {
            photo.link = Photo.getLinkByFilename(photo.filename);
          });
          this.targetOperations = (<RealtyObj>realtyObj).targetOperations;
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.supportedOperations = this.config.supportedOperations.map((value, index, array) => <any>{
      value,
      name: value,
      checked: RealtyObj.checkIfOperationSupported(this.realtyObj, value)
    });
  }

  saveRealtyObject() {
    this.realtyObj.targetOperations = this.targetOperations;
    this.realtyObjService.save(this.realtyObj).subscribe((data: RealtyObj) => {
      this._notification.success('Success!', 'the object was saved!');
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
              link: Photo.getLinkByFilename(data.filename),
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
            data.type = type;
            data.link = Photo.getLinkByFilename(data.filename);
            this.realtyObj.photos.push(data);
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

  deletePhoto(index: number) {
    this.realtyObj.photos.splice(index, 1);
    if (this.realtyObj.photos.length > 0) {
      this.makeMain(this.realtyObj.photos[0]);
    }

    this.saveRealtyObject();
  }
}
