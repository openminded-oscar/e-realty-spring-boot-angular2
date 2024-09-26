import { Injectable } from '@angular/core';
import {CityOnMap} from '../domain/city-on-map';

@Injectable()
export class ConfigService {
  constructor() { }
  private _userRegion: CityOnMap = {'name': 'Львів', 'lat': 49.8430008, 'lng': 24.0215309};
  private _supportedOperations: string[] = ['SELLING', 'RENT'];
  private _supportedDwellingTypes: string[] = ['APARTMENT', 'HOUSE'];
  private _supportedBuildingTypes: string[] = ['BLOCK', 'BRICK', 'WOODEN'];

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
