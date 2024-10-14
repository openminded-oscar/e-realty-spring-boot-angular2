import {RealtyObj} from './realty-obj';
import {Photo} from './photo';

export interface User {
  id?: number;
  login?: string;

  roles?: string[];

  name: string;
  surname: string;
  profilePicUrl?: string;
  profilePic?: Photo;
  phoneNumber: string;
  email: string;

  realtorDetails?: any;
  realtyObjects?: RealtyObj[];

  createdAt: Date;
}
