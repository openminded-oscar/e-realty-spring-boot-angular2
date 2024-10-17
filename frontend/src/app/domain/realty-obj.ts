import {Photo, RealtyPhoto, RealtyPhotoType} from './photo';
import {Address} from './address';
import {Realtor} from './realtor';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

export class AddressForm {
  city: FormControl<string>;
  street: FormControl<string>;
  numberOfStreet: FormControl<string>;
  apartmentNumber: FormControl<number>;
}

export interface BasicInfoForm {
  address: FormGroup<AddressForm>; // Address should be a FormGroup
  dwellingType: FormControl<string>;
  buildingType: FormControl<string>;
  floor: FormControl<number | null>;
  totalFloors: FormControl<number | null>;
  totalArea: FormControl<number | null>;
  livingArea: FormControl<number | null>;
  roomsAmount: FormControl<number | null>;
}

export interface ImportantInfoForm {
  description: FormControl<string>;
  otherInfo: FormControl<string>;
  foundationYear: FormControl<number>;
  hasRepairing: FormControl<boolean>;
  hasGarage: FormControl<boolean>;
  hasCellar: FormControl<boolean>;
  hasLoft: FormControl<boolean>;
  targetOperations: FormArray<FormGroup<OperationFormGroup>>;
  price: FormControl<number>;
  priceForRent: FormControl<number>;
  realtor: FormControl<number|Realtor>;
}

export interface OperationFormGroup {
  name: FormControl<string>;
  checked: FormControl<boolean>;
}

export interface PhotosForm {
  confirmationDocPhoto: FormControl<RealtyPhoto | null>;
  photos: FormArray<FormControl<RealtyPhoto | null>>;
}

export interface RealtyForm {
  basicInfoFormGroup: FormGroup<BasicInfoForm>;
  importantInfoFormGroup: FormGroup<ImportantInfoForm>;
  photosFormGroup: FormGroup<PhotosForm>;
}


export class RealtyObj {
  public id?: number;
  public roomsAmount: number;
  public floor: number;
  public totalFloors: number;
  public price: number;
  public priceForRent: number;
  public totalArea: number;
  public livingArea: number;
  public description: string;
  public hasGarage: boolean;
  public hasCellar: boolean;
  public hasLoft: boolean;
  public hasRepairing: boolean;
  public foundationYear: number;
  public otherInfo: string;
  public buildingType: string;
  public targetOperations: string[];
  public confirmed: boolean;
  public realtorAware: boolean;
  public dwellingType: string;
  public photos: RealtyPhoto[];
  public confirmationDocPhoto: Photo;
  public address: Partial<Address>;
  public realtor: Realtor;
  public owner: string;
  public mainPhotoPath: string;


  constructor() {
    this.targetOperations = [];
    this.photos = [];
    this.address = new Address();
  }

  public static checkIfOperationSupported(realty: RealtyObj, operation: string) {
    return realty.targetOperations.includes(operation);
  }

  public static getMainPhoto(realty: RealtyObj) {
    const mainPhotos = realty.photos?.filter(value => value.type == RealtyPhotoType.REALTY_MAIN);

    if (mainPhotos && mainPhotos.length > 0) {
      return Photo.getLinkByFilename(mainPhotos[0].filename);
    }
  }
}

