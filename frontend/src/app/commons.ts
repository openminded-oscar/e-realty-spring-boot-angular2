export const base = 'http://localhost:8080';
export const apiBase = `${base}/api`;
export const endpoints: any = {
    userStatus: apiBase + '/signin/with-token',
    signin: apiBase + '/signin',
    signinGoogleData: apiBase + '/signin/google',
    googleSignIn: base + '/oauth2/authorize-client/google',
    interest: apiBase + '/interest',
    review: apiBase + '/object-review',
    realtorReview: apiBase + '/object-review/my-as-realtor',
    signup: apiBase + '/user',
    userUpdate: apiBase + '/user',
    pictures: apiBase + '/files/',
    addressesByCoordinates: apiBase + '/addresses/address-by-geocoding',
    supportedRegions: apiBase + '/addresses/regions-supported',
    addressesNearby: apiBase + '/addresses/addresses-nearby',
    realtors: {
        list: apiBase + '/realtor',
        single: apiBase + '/realtor',
        claim: apiBase + '/claim',
    },
    realtyObj: {
        add: apiBase + '/realty-objects/save',
        byGeolocation: apiBase + '/realty-objects/by-geolocation',
        listSell: apiBase + '/realty-objects/sell',
        listRent: apiBase + '/realty-objects/rent',
        delete: apiBase + '/realty-objects',
        byId: apiBase + '/realty-objects',
        realtorList: apiBase + '/realty-objects/my-as-realtor',
    }
};
