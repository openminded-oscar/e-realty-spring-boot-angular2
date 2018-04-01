import {Component, OnInit} from '@angular/core';
import {AddressService} from "../services/address.service";
import {CityOnMap} from "../domain/domain";


@Component({
  selector: 'new-object',
  templateUrl: './new-object.component.html',
  styleUrls: ['./new-object.component.css']
})
export class NewObjectComponent implements OnInit {
  public baseCities: CityOnMap[] = [];
  public currentCity: CityOnMap = {name: "Львів", lat: 49.8430008, lng: 24.0215309};

  public constructor(public addressService: AddressService) {
  }

  public ngOnInit() {
    this.addressService.getSupportedCities().subscribe((data:CityOnMap[]) => {
      this.baseCities = data;
    });
  }
}
