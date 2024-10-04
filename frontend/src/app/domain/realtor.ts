import {Photo} from './photo';

export interface Realtor {
  id?: number;
  name: string;
  surname: string;
  profilePic?: Photo;
  phoneNumber: string;
  email: string;
}
