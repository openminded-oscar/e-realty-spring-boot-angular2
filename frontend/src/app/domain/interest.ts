import {RealtyObj} from './realty-obj';
import {Review} from './review';

export interface InterestDto {
  id?: number;
  userId: number;
  realtyObjId: number;
}

export interface Interest {
  id?: number;
  userId: number;
  reviewScheduled?: Review;
  realtyObj: RealtyObj;
}
