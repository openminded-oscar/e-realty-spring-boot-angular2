import {Injectable} from '@angular/core';
import {CityOnMap} from '../app-models/city-on-map';

export enum OPERATION_TYPES {
  SELLING = 'SELLING',
  RENT = 'RENT',
}

export enum DWELLING_TYPES {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE'
}

export enum BUILDING_TYPES {
  BLOCK = 'BLOCK',
  BRICK = 'BRICK',
  WOODEN = 'WOODEN'
}

@Injectable({providedIn: 'root'})
export class ConfigService {
  constructor() { }
  private _userRegion: CityOnMap = {'name': 'Львів', 'lat': 49.8430008, 'lng': 24.0215309};
  private _supportedOperations: string[] = Object.values(OPERATION_TYPES);
  private _supportedDwellingTypes: string[] = Object.values(DWELLING_TYPES);
  private _supportedBuildingTypes: string[] = Object.values(BUILDING_TYPES);

  get supportedBuildingTypes(): string[] {
    return this._supportedBuildingTypes;
  }

  set supportedBuildingTypes(value: string[]) {
    this._supportedBuildingTypes = value;
  }

  get supportedDwellingTypes(): string[] {
    return this._supportedDwellingTypes;
  }

  set supportedDwellingTypes(value: string[]) {
    this._supportedDwellingTypes = value;
  }


  get supportedOperations(): string[] {
    return this._supportedOperations;
  }


  get userRegion(): CityOnMap {
    return this._userRegion;
  }

  set userRegion(value: CityOnMap) {
    this._userRegion = value;
  }
}
