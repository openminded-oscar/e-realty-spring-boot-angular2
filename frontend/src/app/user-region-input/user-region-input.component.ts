import {Component, OnInit} from '@angular/core';
import {CityOnMap} from "../domain/domain";
import {AddressService} from "../services/address.service";
import {ConfigService} from "../services/config.service";

@Component({
  selector: 'region-input',
  templateUrl: './user-region-input.component.html',
  styleUrls: ['./user-region-input.component.css']
})
export class UserRegionInputComponent implements OnInit {
  public baseCities: CityOnMap[];
  public currentCity: CityOnMap;

  public constructor(public addressService: AddressService, public  config: ConfigService) {
  }

  public ngOnInit() {
    this.currentCity = this.config.getUserRegion();
    this.baseCities = [this.currentCity];
    this.addressService.getSupportedCities().subscribe((data: CityOnMap[]) => {
      this.baseCities = data;
    });
  }

  public onChangeRegion(value) {
    this.config.setUserRegion(value);
  }

  public compareRegions(r1: CityOnMap, r2: CityOnMap) {
    return CityOnMap.compareRegions(r1, r2);
  }
}
