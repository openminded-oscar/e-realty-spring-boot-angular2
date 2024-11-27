import {Component, ElementRef, Input, NgZone} from '@angular/core';
import {LatLng, Layer, LayerGroup, LeafletMouseEvent, Map, MapOptions, tileLayer} from 'leaflet';
import {Router} from '@angular/router';
import {RealtyObjService} from '../../../app-services/realty-obj.service';
import {blueMarkerOfLngAndLat, redMarkerOfLatAndLng} from '../../../utils/location-utils';
import {Geolocation} from '../../../app-models/geolocation';
import {RealtyObj} from '../../../app-models/realty-obj';
import {WindowService} from '../../../app-services/window.service';

const MAP_INIT_TIMEOUT_MS = 100;

@Component({
  selector: 'app-geolocation-widget',
  templateUrl: './geolocation-widget.component.html',
  styleUrls: ['./geolocation-widget.component.scss']
})
export class GeolocationWidgetComponent {
  public options: MapOptions = {
    zoomControl: true,
    zoom: 11
  };
  public layers: Layer[] = [
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      noWrap: true
    })
  ];
  public markers: LayerGroup = new LayerGroup(); // Existing markers for multiple points
  public clickedMarkerLayer: LayerGroup = new LayerGroup(); // Dedicated layer for the clicked marker

  private _initialLocation: Geolocation;
  private map: Map;

  @Input()
  public set initialLocation(value: Geolocation) {
    // setting  timeout for initial map initialization
    setTimeout(() => {
      this._initialLocation = value;
      if (value?.lat && value?.lng) {
        this.currentLocation = {
          lng: value.lng,
          lat: value.lat
        };
        if (this.map) {
          this.onMapCenterChanged({lat: value.lat, lng: value.lng} as LatLng);
          this.map.setView(value, this.map.getZoom(), {animate: true});
        }
      }
    }, MAP_INIT_TIMEOUT_MS);
  }

  public get initialLocation(): Geolocation {
    return this._initialLocation;
  }

  private _zoomLevel: number;
  @Input()
  set zoomLevel(value: number) {
    // setting  timeout for initial map initialization
    setTimeout(() => {
      this._zoomLevel = value;
      if (this.map) {
        this.map.setZoom(value);
      }
    }, MAP_INIT_TIMEOUT_MS);
  }

  get zoomLevel(): number {
    return this._zoomLevel;
  }

  public currentLocation: Geolocation;

  constructor(public realtyObjectService: RealtyObjService,
              public router: Router,
              public windowService: WindowService,
              public ngZone: NgZone,
              private elementRef: ElementRef) {
    this.layers.push(this.markers, this.clickedMarkerLayer);
  }

  public onMapClick(mouseClickData: LeafletMouseEvent) {
    const {lat, lng} = mouseClickData.latlng;

    this.updatePointForClicked(lat, lng);
  }

  public onMapCenterChanged(latLng: LatLng) {
    this.applyMapUpdateForLatLng(latLng.lat, latLng.lng);

    this.currentLocation = {lat: latLng.lat, lng: latLng.lng};
  }

  private applyMapUpdateForLatLng(lat: number, lng: number) {
    this.realtyObjectService.findByLatLngAndZoomLevel(
      lat, lng, this.map.getZoom()
    ).subscribe(objects => {
      objects.forEach(object => {
        if (this.currentLocation?.lat !== object.address.lat || this.currentLocation?.lng !== object.address.lng) {
          const newRelatedMarker = redMarkerOfLatAndLng(object.address.lat, object.address.lng)
            .bindPopup(this.renderMapPopupForObject(object),
              {autoPan: true})
            .on('popupopen', () => {
              this.elementRef.nativeElement
                .querySelector('.clickableLeafletPopupArea')
                .addEventListener('click', e => {
                  this.goToObject(object);
                });
            });
          this.markers.addLayer(newRelatedMarker);
        }
      });
    });
  }

  private renderMapPopupForObject(object: RealtyObj) {
    const photoUrl = object.mainPhotoPath;
    const title = 'House at ' + object.address.street;
    const priceText = object.price ? `est. at ${object.price}` : null;
    const rentPriceText = object.priceForRent ? `(${ object.priceForRent }/month)` : null;
    return `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                  <img style="object-fit: cover; max-width: 100%" height="100" src="${photoUrl}" alt="housePhoto">
                  <div style="cursor: pointer; color: cadetblue" class="clickableLeafletPopupArea">
                      ${title}
                  </div>
                ${priceText ? `<div>${priceText}</div>` : ''}
                ${rentPriceText ? `<div>${rentPriceText}</div>` : ''}
                </div>
`;
  }

  private goToObject(realtyObject: RealtyObj) {
    this.ngZone.run(() => {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/realty-object', realtyObject.id])
      );
      this.windowService.nativeWindow?.open(url, '_blank');
    });
  }

  private updatePointForClicked(lat: number, lng: number) {
    const newMarker = blueMarkerOfLngAndLat(lat, lng);
    this.clickedMarkerLayer.clearLayers();
    this.clickedMarkerLayer.addLayer(newMarker);
  }

  public onMapReady(map: Map) {
    this.map = map;
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }
}

