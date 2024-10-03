import {Photo} from './photo';

export interface Realter {
  id?: number;
  name: string;
  surname: string;
  profilePic?: Photo;
  phoneNumber: string;
  email: string;
}
