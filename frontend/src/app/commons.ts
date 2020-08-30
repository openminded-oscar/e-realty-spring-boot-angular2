export const base: string = 'http://localhost:8080';
export const apiBase: string = `${base}/api`;
export const endpoints: any = {
  userStatus: apiBase + '/signin/with-token',
  signin: apiBase + '/signin',
  signinGoogleData: apiBase + '/signin/google',
  googleSignIn: base + '/oauth2/authorize-client/google',
  interest: apiBase + '/interest',
  review: apiBase + '/object-review',
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
