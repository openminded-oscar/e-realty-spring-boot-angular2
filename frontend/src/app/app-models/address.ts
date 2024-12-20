import {CityOnMap} from './city-on-map';

export class Address {
  region: CityOnMap;
  city: string;
  street: string;
  numberOfStreet: string;
  apartmentNumber: number;
  lat?: number;
  lng?: number;
}
