import {Photo} from './photo';

export interface Realter {
  id?: string;
  name: string;
  surname: string;
  profilePic?: Photo;
  phoneNumber: string;
  email: string;
}
