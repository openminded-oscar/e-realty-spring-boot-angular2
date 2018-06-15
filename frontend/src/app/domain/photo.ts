export class Photo {
  public link: string;
  public filename: string;
  public id: number;
}

export class RealtyPhoto extends Photo {
  public type?: RealtyPhotoType;

  constructor() {
    super();
    this.type = RealtyPhotoType.REALTY_PLAIN;
  }
}

export enum RealtyPhotoType {
  REALTY_PLAIN="REALTY_PLAIN", REALTY_MAIN="REALTY_MAIN"
}
