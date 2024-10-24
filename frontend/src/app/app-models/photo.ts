import {endpoints} from '../commons';

export class Photo {
  public filename: string;
  public fullUrl?: string;
  public id: number;

  public static getLinkByFilename(filename: string): string {
    return endpoints.pictures + filename;
  }
}

export class RealtyPhoto extends Photo {
  public type?: RealtyPhotoType;

  constructor() {
    super();
    this.type = RealtyPhotoType.REALTY_PLAIN;
  }
}

export enum RealtyPhotoType {
  REALTY_PLAIN= 'REALTY_PLAIN', REALTY_MAIN= 'REALTY_MAIN'
}
