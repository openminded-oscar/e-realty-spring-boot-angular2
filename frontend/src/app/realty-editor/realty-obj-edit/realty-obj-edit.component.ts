import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Event} from '@angular/router';
import {BUILDING_TYPES, ConfigService, DWELLING_TYPES, OPERATION_TYPES} from '../../app-services/config.service';
import {FileUploadService} from '../../app-services/file-upload.service';
import {RealtyObjService} from '../../app-services/realty-obj.service';
import {RealtorService} from '../../app-services/realtor.service';
import {GlobalNotificationService} from '../../app-services/global-notification.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
  BasicInfoForm,
  ImportantInfoForm,
  OperationFormGroup,
  PhotosForm,
  RealtyForm,
  RealtyObj
} from '../../app-models/realty-obj';
import {Photo, RealtyPhoto, RealtyPhotoType} from '../../app-models/photo';
import {Realtor} from '../../app-models/realtor';
import {apiBase} from '../../commons';
import {operationPricesValidator, valueGteThanTotal} from './validation.utils';

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
  public operationsInputValues: SupportedOperation[];
  public realtors: Realtor[];
  public dwellingTypes: string[];
  public buildingTypes: string[];
  public photoType = RealtyPhotoType;

  private destroy$ = new Subject<boolean>();

  public realtyForm: FormGroup<RealtyForm>;
  public basicInfoFormGroup: FormGroup<BasicInfoForm>;
  public importantInfoFormGroup: FormGroup<ImportantInfoForm>;
  public photosFormGroup: FormGroup<PhotosForm>;
  public objectId: number;

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
    this.basicInfoFormGroup = this.fb.group<BasicInfoForm>({
      address: this.fb.group({
        city: this.fb.control('Lviv', Validators.required),
        street: this.fb.control('', Validators.required),
        numberOfStreet: this.fb.control('', [Validators.required, Validators.minLength(1)]),
        apartmentNumber: this.fb.control(null, Validators.required),
      }),
      dwellingType: this.fb.control(DWELLING_TYPES.APARTMENT, Validators.required),
      buildingType: this.fb.control(BUILDING_TYPES.BRICK, Validators.required),
      floor: this.fb.control(null, Validators.required),
      totalFloors: this.fb.control(null, Validators.required),
      totalArea: this.fb.control(null, Validators.required),
      livingArea: this.fb.control(null, Validators.required),
      roomsAmount: this.fb.control(null, Validators.required)
    }, {
      validators: [
        valueGteThanTotal('floor', 'totalFloors'),
        valueGteThanTotal('livingArea', 'totalArea')
      ]
    });

    const operationsFormArray: FormArray<FormGroup<OperationFormGroup>> = new FormArray([]);
    this.operationsInputValues.forEach(operation => {
      const operationControlGroup = this.fb.group<OperationFormGroup>({
        name: this.fb.control(operation.name, Validators.required),
        checked: this.fb.control(operation.checked)
      });
      operationsFormArray.push(operationControlGroup);
    });

    this.importantInfoFormGroup = this.fb.group<ImportantInfoForm>({
      description: this.fb.control('', [Validators.required, Validators.maxLength(255)]),
      otherInfo: this.fb.control('', Validators.maxLength(64)),
      foundationYear: this.fb.control(null, [Validators.required, Validators.min(1500)]),
      hasRepairing: this.fb.control(false),
      hasGarage: this.fb.control(false),
      hasCellar: this.fb.control(false),
      hasLoft: this.fb.control(false),
      targetOperations: operationsFormArray,
      price: this.fb.control(null),
      priceForRent: this.fb.control(null),
      realtor: this.fb.control(null, Validators.required)
    }, {
      validators: [
        operationPricesValidator()
      ]
    });

    this.photosFormGroup = this.fb.group<PhotosForm>({
      confirmationDocPhoto: this.fb.control<RealtyPhoto>(null, Validators.required), // Type for confirmationDocPhoto
      photos: this.fb.array<FormControl<RealtyPhoto>>([]) // Type for photos FormArray
    });

    this.realtyForm = this.fb.group<RealtyForm>({
      basicInfoFormGroup: this.basicInfoFormGroup,
      importantInfoFormGroup: this.importantInfoFormGroup,
      photosFormGroup: this.photosFormGroup,
    });
    this.realtyForm.get('basicInfoFormGroup.dwellingType').valueChanges.subscribe(value => {
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
        priceForRent: realtyObj.priceForRent,
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
    this.operationsInputValues.forEach((op, index) => {
      const operationName = op.value;
      (this.importantInfoFormGroup.controls.targetOperations as FormArray).at(index).setValue({
        name: operationName,
        checked: realtyObj.targetOperations.includes(operationName)
      });
    });
  }

  public saveRealtyObject(): void {
    if (this.realtyForm.valid) {
      const realtyObjFormData = {
        ...this.objectId ? {id: this.objectId} : {},
        ...this.realtyForm.controls.basicInfoFormGroup.value,
        ...this.realtyForm.controls.importantInfoFormGroup.value,
        ...this.realtyForm.controls.photosFormGroup.value
      };
      const includedOperationsNames: string[] = [];
      if (realtyObjFormData.targetOperations) {
        (realtyObjFormData.targetOperations).forEach((allowedAtIndex: {
            checked: boolean,
            name: string
          }, index: number) => {
            if (allowedAtIndex.checked) {
              includedOperationsNames.push(this.operationsInputValues[index].name);
            }
          }
        );
      }
      if (realtyObjFormData.realtor) {
        const realtorId = Number(realtyObjFormData.realtor);
        realtyObjFormData.realtor = this.realtors.find(r => {
          return r.id === realtorId;
        });
      }

      this.realtyObjService.save({
        ...realtyObjFormData,
        targetOperations: includedOperationsNames as string[],
        realtor: realtyObjFormData.realtor as Realtor
      }).pipe(takeUntil(this.destroy$))
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
