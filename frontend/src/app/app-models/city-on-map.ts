export class CityOnMap {
  id: number;
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

export const supportedRegions = [
        { id: 1, name: 'Kyiv', lat: 50.4501, lng: 30.5234 },
        { id: 2, name: 'Odesa', lat: 46.4825, lng: 30.7181 },
        { id: 3, name: 'Kharkiv', lat: 49.9935, lng: 36.2304 },
        { id: 4, name: 'Dnipro', lat: 48.4647, lng: 35.0462 },
        { id: 5, name: 'Lviv', lat: 49.8397, lng: 24.0297 },
        { id: 6, name: 'Vinnytsia', lat: 49.2328, lng: 28.4826 },
        { id: 7, name: 'Zhytomyr', lat: 50.2547, lng: 28.6587 },
        { id: 8, name: 'Chernivtsi', lat: 48.2915, lng: 25.9403 },
        { id: 9, name: 'Zaporizhzhia', lat: 47.8388, lng: 35.1318 },
        { id: 10, name: 'Donetsk', lat: 47.0971, lng: 37.6187 },
        { id: 11, name: 'Kherson', lat: 46.6354, lng: 32.6169 },
        { id: 12, name: 'Cherkasy', lat: 49.4229, lng: 32.0621 },
        { id: 13, name: 'Kropyvnytskyi', lat: 48.5079, lng: 32.2623 },
        { id: 14, name: 'Rivne', lat: 50.6199, lng: 26.2516 },
        { id: 15, name: 'Poltava', lat: 49.5883, lng: 34.5514 },
        { id: 16, name: 'Mykolaiv', lat: 46.9750, lng: 31.8906 },
        { id: 17, name: 'Khmelnytskyi', lat: 49.4197, lng: 26.9794 },
        { id: 18, name: 'Luhansk', lat: 48.5735, lng: 39.3495 },
        { id: 19, name: 'Kryvyi Rih', lat: 47.9051, lng: 33.4729 },
        { id: 20, name: 'Lutsk', lat: 50.7472, lng: 25.3429 },
        { id: 21, name: 'Ivano-Frankivsk', lat: 48.9226, lng: 24.7097 },
        { id: 22, name: 'Chernihiv', lat: 51.4982, lng: 31.2849 },
        { id: 23, name: 'Uzhhorod', lat: 48.6210, lng: 22.2947 },
        { id: 24, name: 'Sumy', lat: 50.9077, lng: 34.8021 },
        { id: 25, name: 'Ternopil', lat: 49.5535, lng: 25.5934 }
    ];
