import {RealtyObj} from './realty-obj';

export interface User {
  id?: number;
  login: string;

  realterDetails?: any;
  realtyObjects?: RealtyObj[];
}
