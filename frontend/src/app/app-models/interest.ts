import {RealtyObj} from './realty-obj';
import {RelatedReviewDto} from './review';

export interface InterestDto {
  id?: number;
  userId: number;
  realtyObjId: number;
}

export interface Interest {
  id?: number;
  userId: number;
  reviewScheduled?: RelatedReviewDto;
  realtyObj: RealtyObj;
}
