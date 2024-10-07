import {RealtyObj} from './realty-obj';
import {User} from './user';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

export interface Review {
  id?: number;
  user: User;
  realtyObj: RealtyObj;
  dateTime: Date;
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
  reviewDate?: NgbDateStruct;
  reviewTime?: NgbTimeStruct;
}
