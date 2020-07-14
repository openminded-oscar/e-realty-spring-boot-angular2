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
  userStatus: apiBase + '/signin/with-token',
  signin: apiBase + '/signin',
  signup: apiBase + '/signup',
  pictures: apiBase + '/files/',
  addressesNearby: apiBase + "/addresses/addresses-nearby",
  supportedCities: apiBase + "/addresses/cities-supported",
  realters:{
    list: apiBase + "/realter",
    single: apiBase + "/realter"
  },
  realtyObj: {
    add: apiBase + "/realty-object/save",
    list: apiBase + '/realty-objects',
    byId: apiBase + '/realty-objects'
  }
};
