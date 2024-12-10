import {RealtyObj} from './realty-obj';
import {User} from './user';

export enum ReviewAction {
  CONFIRM = 'confirm',
  CANCEL = 'cancel'
}

export interface Review {
  id?: number;
  user: User;
  realtyObj: RealtyObj;
  dateTime: Date;
  approved?: Boolean;
}

export interface ReviewDto {
  id?: number;
  userId: number;
  realtyObjId: number;
  dateTime: Date;
}

export interface ReviewPostDto {
  id?: number;
  userId: number;
  realtyObj: RealtyObj;
  dateTime: Date;
}

export interface ReviewSelectTimeDto {
  realtyObjId?: number;
  realtorId?: number;
  dateTime: Date;
}
