export class CityOnMap {
  name: string;
  lat: number;
  lng: number;

  public static compareRegions(r1: CityOnMap, r2: CityOnMap) {
    if (!r1 || !r2) {
      return false;
    }
    return r1.name === r2.name && r1.lat === r2.lat && r1.lng === r2.lng;
  }
}
