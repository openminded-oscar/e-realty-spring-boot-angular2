import { Component } from '@angular/core';
import {RealtyObjService} from '../../app-services/realty-obj.service';

@Component({
  selector: 'app-realty-objects-management',
  templateUrl: './realty-objects-management.component.html',
  styleUrl: './realty-objects-management.component.scss'
})
export class RealtyObjectsManagementComponent {
    public currentObjects = [
        { name: 'House A', location: 'New York', price: 120000 },
        { name: 'House B', location: 'Los Angeles', price: 95000 },
        { name: 'Apartment C', location: 'Chicago', price: 75000 },
        { name: 'Villa D', location: 'Miami', price: 300000 },
        { name: 'Cottage E', location: 'Seattle', price: 110000 },
        { name: 'House A', location: 'New York', price: 120000 },
        { name: 'House B', location: 'Los Angeles', price: 95000 },
        { name: 'Apartment C', location: 'Chicago', price: 75000 },
        { name: 'Villa D', location: 'Miami', price: 300000 },
        { name: 'Cottage E', location: 'Seattle', price: 110000 },
        { name: 'House A', location: 'New York', price: 120000 },
        { name: 'House B', location: 'Los Angeles', price: 95000 },
        { name: 'Apartment C', location: 'Chicago', price: 75000 },
        { name: 'Villa D', location: 'Miami', price: 300000 },
        { name: 'Cottage E', location: 'Seattle', price: 110000 },

    ];

    public currentPage = 1;
    public pageSize = 1;
    public pagedObjects = this.currentObjects.slice(0, this.pageSize);


    constructor(realtyObjectsService: RealtyObjService) {
    }

    public updatePage() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.pagedObjects = this.currentObjects.slice(startIndex, startIndex + this.pageSize);
    }
}
