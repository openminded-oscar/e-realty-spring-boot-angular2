import {icon, marker} from 'leaflet';

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
