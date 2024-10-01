import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';

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
export class RealtyObjEditComponent implements OnInit, OnDestroy {
  public operationsInputs: SupportedOperation[];

  private _realtyObj: RealtyObj;
  public get realtyObj(): RealtyObj {
    return this._realtyObj;
  }
  public set realtyObj(object: RealtyObj) {
    this._realtyObj = object;
    this.operationsInputs = this.config.supportedOperations.map((value, index, array) => ({
      value,
      name: value,
      checked: RealtyObj.checkIfOperationSupported(this._realtyObj, value)
    }));
  }

  public get selectedOperations(): string[] {
    return this.operationsInputs
      .filter(opt => opt.checked)
      .map(opt => opt.value);
  }

  public realters: Realter[];
  public dwellingTypes: string[];
  public buildingTypes: string[];
  public photoType = RealtyPhotoType;

  private destroy$ = new Subject<boolean>();

  public constructor(public config: ConfigService,
                     public fileUploadService: FileUploadService,
                     public realtyObjService: RealtyObjService,
                     public realtersService: RealterService,
                     public notificationService: GlobalNotificationService,
                     public route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.operationsInputs = this.config
      .supportedOperations.map(value => ({value, name: value, checked: value === 'SELLING'}));
    this.dwellingTypes = this.config.supportedDwellingTypes;
    this.buildingTypes = this.config.supportedBuildingTypes;
    this.realtersService.getRealters().pipe(takeUntil(this.destroy$))
      .subscribe((gotRealters: Realter[]) => {
        this.realters = gotRealters;
      });

    this.realtyObj = new RealtyObj();
    // if passed object realterId in parameter then retrieve that object
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['realterId']) {
        this.realtyObjService.findById(params['realterId']).pipe(
          takeUntil(this.destroy$)
        ).subscribe(realtyObj => {
          this.realtyObj = realtyObj;
          this.realtyObj.photos?.forEach(photo => {
            photo.link = Photo.getLinkByFilename(photo.filename);
          });
        });
      }
    });
  }

  public saveRealtyObject() {
    this.realtyObj.targetOperations = this.selectedOperations;

    this.realtyObjService.save(this.realtyObj).pipe(
      takeUntil(this.destroy$)
    ).subscribe((data: RealtyObj) => {
      this.notificationService.showNotification('Success! The object was saved!');
      this.realtyObj = data;
    }, error => {
      this.notificationService.showNotification('Failure! The object adding failed!');
    });
  }

  public onVerificationPictureSelecting(event: InputEvent) {
    const fileList: FileList = (event.target as HTMLInputElement).files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.fileUploadService.upload(file, apiBase + '/upload-photo/object')
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: Photo) => {
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
        .pipe(takeUntil(this.destroy$))
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
