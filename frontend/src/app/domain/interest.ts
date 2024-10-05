import {RealtyObj} from './realty-obj';

export interface InterestDto {
  id?: number;
  userId: number;
  realtyObjId: number;
}

export interface Interest {
  id?: number;
  userId: number;
  realtyObj: RealtyObj;
}
