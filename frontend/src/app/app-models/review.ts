import {RealtyObj} from './realty-obj';
import {User} from './user';
import {isFutureDate} from '../utils/time-utils';

export type ReviewFilter = 'all' | 'future' | 'past' | 'unapproved';

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
  approved?: Boolean;
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

export const filterByReviewType = (reviews: Review[], filter: ReviewFilter): Review[] => {
  if (filter === 'all') {
    return [...reviews];
  } else if (filter === 'future') {
    return reviews.filter(review => isFutureDate(review.dateTime));
  } else if (filter === 'past') {
    return reviews.filter(review => isFutureDate(review.dateTime));
  } else if (filter === 'unapproved') {
    return reviews.filter(review => !review.approved);
  }
}
