import {Photo, RealtyPhoto, RealtyPhotoType} from './photo';
import {Address} from './address';
import {Realtor} from './realtor';

export class RealtyObj {
  public id?: number;
  public roomsAmount: number;
  public floor: number;
  public totalFloors: number;
  public price: number;
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
  public address: Address;
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

