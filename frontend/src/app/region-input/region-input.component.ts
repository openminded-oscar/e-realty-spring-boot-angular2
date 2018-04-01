import { Component, OnInit } from '@angular/core';
import {CityOnMap} from "../domain/domain";
import {AddressService} from "../services/address.service";
import {ConfigService} from "../services/config.service";

@Component({
  selector: 'region-input',
  templateUrl: './region-input.component.html',
  styleUrls: ['./region-input.component.css']
})
export class RegionInputComponent implements OnInit {
  public baseCities: CityOnMap[] = [];
  public currentCity: CityOnMap;

  public constructor(public addressService: AddressService, public  config: ConfigService) {
  }

  public ngOnInit() {
    this.currentCity = this.config.getUserRegion();
    this.addressService.getSupportedCities().subscribe((data:CityOnMap[]) => {
      this.baseCities = data;
    });
  }

  public onChangeRegion(value){
    this.config.setUserRegion(value);
  }
}
