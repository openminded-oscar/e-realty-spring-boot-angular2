import {RealtyObj} from './realty-obj';
import {User} from './user';

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
