import { Injectable } from '@angular/core';
import {CityOnMap} from "../domain/domain";

@Injectable()
export class ConfigService {
  constructor() { }
  public userRegion: CityOnMap = {"name": "Львів", "lat": 49.8430008, "lng": 24.0215309};
  public supportedOperations: string[] = ["SELLING", "RENT", "EXCHANGE"];

  public setUserRegion(value: any) {
    this.userRegion = value;
  }
  public getUserRegion(){
    return this.userRegion;
  }

  public getSupportedOperations(): string[] {
    return this.supportedOperations;
  }
}
