import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Layer, LayerGroup, LeafletMouseEvent, Map, MapOptions, tileLayer} from 'leaflet';

import {blueMarkerOfLngAndLat} from '../../utils/location-utils';
import {Geolocation} from '../../app-models/geolocation';
import {CityOnMap} from '../../app-models/city-on-map';

@Component({
    selector: 'app-select-location',
    templateUrl: './select-location.component.html',
    styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent {
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
    public markers: LayerGroup = new LayerGroup();

    @Output()
    public locationSelected = new EventEmitter<Geolocation>();
    public currentLocation: Geolocation;
    private map: Map;

    constructor() {
        this.layers.push(new LayerGroup([this.markers]));
    }


    private _regionChanged!: CityOnMap;
    get regionChanged(): CityOnMap {
        return this._regionChanged;
    }
    @Input()
    set regionChanged(value: CityOnMap) {
        this._regionChanged = value;

        if (value?.lat && value?.lng) {
            this.options.center = this.currentLocation;
            if (this.map) {
                this.map.setView(value, this.map.getZoom(), {animate: true});
            }
        }
    }

    private _location: Geolocation;
    public get location(): Geolocation {
        return this._location;
    }
    @Input()
    public set location(value: Geolocation) {
        this._location = value;
        if (value?.lat && value?.lng) {
            this.currentLocation = {
                lng: value.lng,
                lat: value.lat
            };
            this.options.center = this.currentLocation;
            this.addMarkerOnMap(value.lat, value.lng);
            if (this.map) {
                this.map.setView(value, this.map.getZoom(), {animate: true});
            }
        }
    }

    public onMapClick(mouseClickData: LeafletMouseEvent) {
        const {lat, lng} = mouseClickData.latlng;

        this.addMarkerOnMap(lat, lng);

        this.currentLocation = mouseClickData.latlng;
        this.locationSelected.emit(this.currentLocation);
    }

    public onMapReady(map: Map) {
        this.map = map;
        setTimeout(() => {
            map.invalidateSize();
        }, 0);
    }

    private addMarkerOnMap(lat: number, lng: number) {
        const newMarker = blueMarkerOfLngAndLat(lat, lng);
        this.markers.clearLayers();
        this.markers.addLayer(newMarker);
    }
}
