import {RealtyObj} from './realty-obj';
import {Photo} from './photo';

export interface User {
  id?: number;
  login?: string;

  role?: string;

  name: string;
  surname: string;
  profilePic?: Photo;
  phoneNumber: string;
  email: string;

  realtorDetails?: any;
  realtyObjects?: RealtyObj[];
}
