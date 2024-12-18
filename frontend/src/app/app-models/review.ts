import {RealtyObj} from './realty-obj';
import {User, UserProfile} from './user';
import {isFutureDate} from '../utils/time-utils';

export type ReviewFilter = 'all' | 'future' | 'past' | 'unapproved';

export enum ReviewAction {
    CONFIRM = 'confirm',
    CANCEL = 'cancel'
}

export interface RelatedReviewDto {
    id?: number;
    user: UserProfile;
    realtyObj: RealtyObj;
    realtorId: number;
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

export interface ReviewSelectTimeDto {
    realtyObjId?: number;
    realtorId?: number;
    dateTime: Date;
}

export const filterByReviewType = <T extends RelatedReviewDto> (reviews: (T)[], filter: ReviewFilter): T[] => {
    if (filter === 'all') {
        return [...reviews];
    } else if (filter === 'future') {
        return reviews.filter(review => isFutureDate(review.dateTime));
    } else if (filter === 'past') {
        return reviews.filter(review => !isFutureDate(review.dateTime));
    } else if (filter === 'unapproved') {
        return reviews.filter(review => !review.approved);
    }
}
