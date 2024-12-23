import {Component, OnInit} from '@angular/core';
import {RealtyObjService} from '../../app-services/realty-obj.service';
import {RealtyObj} from '../../app-models/realty-obj';
import {AddressService} from '../../app-services/address.service';
import {CityOnMap} from '../../app-models/city-on-map';

@Component({
    selector: 'app-realty-objects-management',
    templateUrl: './realty-objects-management.component.html',
    styleUrl: './realty-objects-management.component.scss'
})
export class RealtyObjectsManagementComponent implements OnInit {
    public currentPage = 1;
    public pageSize = 5;
    public totalElements = 0;
    public pagedObjects: RealtyObj[] = [];
    public selectedRegion: string;
    public selectedOperation: any;
    public regions: CityOnMap[];

    constructor(private realtyObjectsService: RealtyObjService, private addressService: AddressService) {
    }

    public ngOnInit(): void {
        this.addressService
            .supportedRegions()
            .subscribe(regions => {
                this.regions = regions;
            });
        this.loadPortion();
    }

    public updatePage(indexClicked: number) {
        this.currentPage = indexClicked;
        this.loadPortion();
    }

    public applyFilters() {
        this.loadPortion();
        this.currentPage = 1;
    }

    private loadPortion() {
        this.realtyObjectsService.findAdminObjectsByFilterAndPage({
                page: this.currentPage - 1,
                size: this.pageSize,
            }, (this.selectedRegion !== 'all' ? this.selectedRegion : null), (this.selectedOperation !== 'all' ? this.selectedOperation : null))
            .subscribe(objects => {
                this.totalElements = objects.totalElements;
                this.pagedObjects = objects.content;
            });
    }
}
