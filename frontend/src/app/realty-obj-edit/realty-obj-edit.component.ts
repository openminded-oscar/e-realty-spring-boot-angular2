import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ConfigService} from '../services/config.service';
import {FileUploadService} from '../services/file-upload.service';
import {apiBase} from '../commons';
import {RealtyObj} from '../domain/realty-obj';
import {RealtyObjService} from '../services/realty-obj.service';
import {Photo, RealtyPhoto, RealtyPhotoType} from '../domain/photo';
import {RealterService} from '../services/realter.service';
import {Realter} from '../domain/realter';
import {GlobalNotificationService} from '../services/global-notification.service';

export interface SupportedOperation {
  name: string;
  value: string;
  checked: boolean;
}

@Component({
  selector: 'new-object',
  templateUrl: './realty-obj-edit.component.html',
  styleUrls: ['./realty-obj-edit.scss']
})
export class RealtyObjEditComponent implements OnInit, OnChanges {
  private _realtyObj: RealtyObj;

  public get realtyObj(): RealtyObj {
    return this._realtyObj;
  }

  @Input()
  public set realtyObj(object: RealtyObj) {
    this._realtyObj = object;
  }

  public realters: Realter[];
  public dwellingTypes: string[];
  public buildingTypes: string[];
  public supportedOperations: SupportedOperation[];
  public photoType = RealtyPhotoType;

  public get targetOperations() {
    return this.supportedOperations
      .filter(opt => opt.checked)
      .map(opt => opt.value);
  }

  public set targetOperations(operations: string[]) {
    operations.forEach(value => {
      this.supportedOperations.forEach((supportedOperation) => {
        if (supportedOperation.value === value) {
          supportedOperation.checked = true;
        }
      });
    });
  }

  public constructor(public config: ConfigService,
                     public fileUploadService: FileUploadService,
                     public realtyObjService: RealtyObjService,
                     public realtersService: RealterService,
                     public notificationService: GlobalNotificationService,
                     public route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.supportedOperations = this.config
      .supportedOperations.map(value => ({value, name: value, checked: value === 'SELLING'}));
    this.dwellingTypes = this.config.supportedDwellingTypes;
    this.buildingTypes = this.config.supportedBuildingTypes;
    this.realtersService.getRealters().subscribe((gotRealters: Realter[]) => {
      this.realters = gotRealters;
    });

    this.realtyObj = new RealtyObj();
    // if passed object realterId in parameter then retrieve that object
    this.route.params.subscribe(params => {
      if (params['realterId']) {
        this.realtyObjService.findById(params['realterId']).subscribe(realtyObj => {
          this.realtyObj = realtyObj;
          this.realtyObj.photos.forEach(photo => {
            photo.link = Photo.getLinkByFilename(photo.filename);
          });
          this.targetOperations = realtyObj.targetOperations;
        });
      }
    });
  }

  saveRealtyObject() {
    this.realtyObj.targetOperations = this.targetOperations;
    this.realtyObjService.save(this.realtyObj).subscribe((data: RealtyObj) => {
      this.notificationService.showNotification('Success! The object was saved!');
      this.realtyObj = data;
    }, error => {
      this.notificationService.showNotification('Failure! The object adding failed!');
    });
  }

  onVerificationPictureSelecting(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.fileUploadService.upload(file, apiBase + '/upload-photo/object')
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

    }
  }

  onRealtyObjPictureSelecting(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.fileUploadService.upload(file, apiBase + '/upload-photo/object')
        .subscribe(
          (data: RealtyPhoto) => {
            data.type = (this.realtyObj.photos.length === 0) ? RealtyPhotoType.REALTY_MAIN : RealtyPhotoType.REALTY_PLAIN;
            data.link = Photo.getLinkByFilename(data.filename);
            this.realtyObj.photos.push(data);
          },
          error => console.log(error)
        );
    }
  }

  public makeMain(picture: RealtyPhoto) {
    this.realtyObj.photos.forEach(objectPicture => {
      objectPicture.type = RealtyPhotoType.REALTY_PLAIN;
    });

    picture.type = RealtyPhotoType.REALTY_MAIN;
  }

  public deletePhoto(index: number) {
    this.realtyObj.photos.splice(index, 1);
    if (this.realtyObj.photos.length > 0) {
      this.makeMain(this.realtyObj.photos[0]);
    }

    this.saveRealtyObject();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.supportedOperations = this.config.supportedOperations.map((value, index, array) => <any>{
      value,
      name: value,
      checked: RealtyObj.checkIfOperationSupported(this.realtyObj, value)
    });
  }
}
