import {icon, marker} from 'leaflet';
import {Geolocation} from '../app-models/geolocation';

export const LVIV_COORDINATES: Geolocation = {lat: 49.83, lng: 24.01};


export const redMarkerOfLatAndLng = (lat: number, lng: number) => {
  return marker([lat, lng], {
    icon: icon({
      iconUrl: '/assets/house-red-icon.png',
      iconSize: [20, 20],
    })
  });
};

export const blueMarkerOfLngAndLat = (lat: number, lng: number) => {
  return marker([lat, lng], {
    icon: icon({
      iconUrl: '/assets/house-icon.png',
      iconSize: [25, 25],
    })
  });
};
