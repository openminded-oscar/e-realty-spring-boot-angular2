import {Component, OnInit} from '@angular/core';
import {CityOnMap} from '../../app-models/city-on-map';
import {AddressService} from '../../app-services/address.service';
import {ConfigService} from '../../app-services/config.service';

@Component({
  selector: 'region-input',
  templateUrl: './user-region-input.component.html',
  styleUrls: ['./user-region-input.component.scss']
})
export class UserRegionInputComponent implements OnInit {
  public baseCities: CityOnMap[];
  public currentCity: CityOnMap;

  public constructor(public addressService: AddressService, public  config: ConfigService) {
  }

  public ngOnInit() {
    this.currentCity = this.config.userRegion;
    this.baseCities = [this.currentCity];
    this.addressService.getSupportedCities().subscribe((data: CityOnMap[]) => {
      this.baseCities = data;
    });
  }

  public onChangeRegion(value) {
    this.config.userRegion = value;
  }

  public compareRegions(r1: CityOnMap, r2: CityOnMap) {
    return CityOnMap.compareRegions(r1, r2);
  }
}
