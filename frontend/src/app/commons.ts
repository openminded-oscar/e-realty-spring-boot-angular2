export function showLoading() {
  console.log("loading ...");
}

export function hideLoading() {
  console.log("loaded");
}

export function doNothing() {
}

export const apiBase: string = 'http://localhost:8080/api';
export const endpoints: any = {
  pictures: apiBase + '/files/',
  addressesNearby: apiBase + "/addresses/addresses-nearby",
  supportedCities: apiBase + "/addresses/cities-supported",
  realtyObj: {
    add: apiBase + "/realty-object/add",
    list: apiBase + '/realty-objects'
  }
};
