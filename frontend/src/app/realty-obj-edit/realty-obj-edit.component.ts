import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Event} from '@angular/router';
import {ConfigService, OPERATION_TYPES} from '../services/config.service';
import {FileUploadService} from '../services/file-upload.service';
import {RealtyObjService} from '../services/realty-obj.service';
import {RealtorService} from '../services/realtor.service';
import {GlobalNotificationService} from '../services/global-notification.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {RealtyObj} from '../domain/realty-obj';
import {Photo, RealtyPhoto, RealtyPhotoType} from '../domain/photo';
import {Realtor} from '../domain/realtor';
import {apiBase} from '../commons';
import {valueGteThanTotal} from './validation.utils';

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
  public realtyForm: FormGroup;
  public operationsInputValues: SupportedOperation[];
  public realtors: Realtor[];
  public dwellingTypes: string[];
  public buildingTypes: string[];
  public photoType = RealtyPhotoType;

  private destroy$ = new Subject<boolean>();
  public importantInfoFormGroup: FormGroup;
  public basicInfoFormGroup: FormGroup;
  public photosFormGroup: FormGroup;
  public objectId: string;

  constructor(
    private fb: FormBuilder,
    public config: ConfigService,
    public fileUploadService: FileUploadService,
    public realtyObjService: RealtyObjService,
    public realtorsService: RealtorService,
    public notificationService: GlobalNotificationService,
    public route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.operationsInputValues = this.config.supportedOperations.map(value => ({
      value, name: value, checked: value === OPERATION_TYPES.SELLING
    }));
    this.dwellingTypes = this.config.supportedDwellingTypes;
    this.buildingTypes = this.config.supportedBuildingTypes;

    this.initFormControls();

    this.realtorsService.getRealtors()
      .pipe(takeUntil(this.destroy$))
      .subscribe(realtors => this.realtors = realtors);

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['objectId']) {
        this.objectId = params['objectId'];
        this.realtyObjService.findById(params['objectId'])
          .pipe(takeUntil(this.destroy$))
          .subscribe(realtyObj => this.populateRealtyForm(realtyObj));
      }
    });
  }

  private initFormControls() {
    this.basicInfoFormGroup = this.fb.group({
      address: this.fb.group({
        city: ['Lviv', Validators.required],
        street: ['', Validators.required],
        numberOfStreet: ['', [Validators.required, Validators.minLength(1)]],
        apartmentNumber: ['', [Validators.required]],
      }),
      dwellingType: ['', Validators.required],
      buildingType: ['', Validators.required],
      floor: [null, Validators.required],
      totalFloors: [null, Validators.required],
      totalArea: [null, Validators.required],
      livingArea: [null, Validators.required],
      roomsAmount: [null, Validators.required]
    }, {
      validators: [
        valueGteThanTotal('floor', 'totalFloors'),
        valueGteThanTotal('livingArea', 'totalArea')
      ]
    });

    const operationsFormArray = new FormArray([]);
    this.operationsInputValues.forEach(operation => {
      const control = this.fb.control(operation.checked);
      operationsFormArray.push(control);
    });
    this.importantInfoFormGroup = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(255)]],
      otherInfo: ['', Validators.maxLength(64)],
      foundationYear: ['', [Validators.required, Validators.min(1500)]],
      hasRepairing: [false],
      hasGarage: [false],
      hasCellar: [false],
      hasLoft: [false],
      targetOperations: operationsFormArray,
      price: ['', Validators.required],
      realtor: ['', Validators.required]
    });
    this.photosFormGroup = this.fb.group({
      confirmationDocPhoto: [null, Validators.required],
      photos: this.fb.array([]),
    });
    this.realtyForm = this.fb.group({
      basicInfoFormGroup: this.basicInfoFormGroup,
      importantInfoFormGroup: this.importantInfoFormGroup,
      photosFormGroup: this.photosFormGroup,
    });
    this.realtyForm.get('basicInfoFormGroup').get('dwellingType').valueChanges.subscribe(value => {
      const aptControl = this.basicInfoFormGroup.get('address.apartmentNumber');
      if (value !== 'APARTMENT') {
        aptControl.disable();
      } else {
        aptControl.enable();
      }
    });
  }

  private populateRealtyForm(realtyObj: RealtyObj): void {
    this.realtyForm.patchValue({
      basicInfoFormGroup: {
        address: realtyObj.address,
        dwellingType: realtyObj.dwellingType,
        buildingType: realtyObj.buildingType,
        floor: realtyObj.floor,
        totalFloors: realtyObj.totalFloors,
        roomsAmount: realtyObj.roomsAmount,
        totalArea: realtyObj.totalArea,
        livingArea: realtyObj.livingArea,
      },
      importantInfoFormGroup: {
        description: realtyObj.description,
        otherInfo: realtyObj.otherInfo,
        foundationYear: realtyObj.foundationYear,
        hasRepairing: realtyObj.hasRepairing,
        hasGarage: realtyObj.hasGarage,
        hasCellar: realtyObj.hasCellar,
        hasLoft: realtyObj.hasLoft,
        price: realtyObj.price,
        realtor: realtyObj.realtor?.id,
      },
      photosFormGroup: {
        confirmationDocPhoto: realtyObj.confirmationDocPhoto
      },
    });
    realtyObj.photos.forEach(photo => {
      const control = this.fb.group({
        id: [photo.id],
        fullUrl: [photo.fullUrl],
        type: [photo.type || this.photoType.REALTY_PLAIN]
      });
      (this.photosFormGroup.controls.photos as FormArray).push(control);
    });
    // Update the supported operations
    this.operationsInputValues.forEach((op, index) => {
      const operationName = op.value;
      (this.importantInfoFormGroup.controls.targetOperations as FormArray).at(index).setValue(
        realtyObj.targetOperations.includes(operationName)
      );
    });
  }

  public saveRealtyObject(): void {
    if (this.realtyForm.valid) {
      const realtyObjData = {
        ...this.objectId ? {id: this.objectId} : {},
        ...this.realtyForm.controls.basicInfoFormGroup.value,
        ...this.realtyForm.controls.importantInfoFormGroup.value,
        ...this.realtyForm.controls.photosFormGroup.value
      };
      const includedOperations = [];
      if (realtyObjData.targetOperations) {
        realtyObjData.targetOperations.forEach((allowedAtIndex: boolean, index: number) => {
            if (allowedAtIndex) {
              includedOperations.push(this.operationsInputValues[index].name);
            }
          }
        );
      }
      realtyObjData.targetOperations = includedOperations;
      if (realtyObjData.realtor) {
        const realtorId = Number(realtyObjData.realtor as string);
        realtyObjData.realtor = this.realtors.find(r => {
          return r.id === realtorId;
        });
      }

      this.realtyObjService.save(realtyObjData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (savedRealtyObj: RealtyObj) => {
            this.notificationService.showNotification('Success! The object was saved!');
          },
          error => this.notificationService.showNotification('Failure! The object adding failed!')
        );
    }
  }

  public onVerificationPictureSelecting(event: Event): void {
    const fileList = (event as any).target.files;
    if (fileList.length > 0) {
      this.uploadFile(fileList[0], '/upload-photo/confirm-object')
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: RealtyPhoto) => {
            this.photosFormGroup.patchValue({confirmationDocPhoto: data});
          },
          error => console.log('File upload error:', error)
        );
    }
  }

  public onRealtyObjPictureSelecting(event: Event): void {
    const fileList = (event as any).target.files;
    if (fileList.length > 0) {
      this.uploadFile(fileList[0], '/upload-photo/object')
        .pipe(takeUntil(this.destroy$))
        .subscribe((photo: RealtyPhoto) => {
          const photosArray = this.photosFormGroup.get('photos') as FormArray;
          const type = (photosArray.length === 0) ? RealtyPhotoType.REALTY_MAIN : RealtyPhotoType.REALTY_PLAIN;
          photosArray.push(this.fb.group({
            id: [photo.id],
            fullUrl: [photo.fullUrl],
            type: type
          }));
        });
    }
  }

  private uploadFile(file: File, endpoint: string): Observable<Photo> {
    return this.fileUploadService.upload(file, `${apiBase}${endpoint}`)
      .pipe(takeUntil(this.destroy$));
  }

  public makeMain(index: number): void {
    const photoControlArray = this.realtyForm.get('photosFormGroup.photos') as FormArray;
    for (let i = 0; i < photoControlArray.length; ++i) {
      const control = photoControlArray.at(i) as FormControl;
      control.setValue({
        ...control.value,
        type: i === index ? RealtyPhotoType.REALTY_MAIN : RealtyPhotoType.REALTY_PLAIN
      });
    }
  }

  public deletePhoto(index: number): void {
    const photosArray = this.realtyForm.get('photosFormGroup.photos') as FormArray;
    photosArray.removeAt(index);
    if (photosArray.length > 0) {
      const currentValue = photosArray.at(0).value;
      photosArray.at(0).setValue({
        ...currentValue,
        type: RealtyPhotoType.REALTY_MAIN
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
