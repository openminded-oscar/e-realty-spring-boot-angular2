import {Component} from '@angular/core';
import {RealtyObjService} from '../../app-services/realty-obj.service';

@Component({
    selector: 'app-realty-objects-management',
    templateUrl: './realty-objects-management.component.html',
    styleUrl: './realty-objects-management.component.scss'
})
export class RealtyObjectsManagementComponent {
    public currentPage = 1;
    public pageSize = 5;
    public totalElements = 0;
    public pagedObjects = [];

    constructor(private realtyObjectsService: RealtyObjService) {
        this.realtyObjectsService.findAdminObjectsByFilterAndPage({
                page: this.currentPage,
                size: this.pageSize,
            })
            .subscribe(objects => {
                this.totalElements = objects.totalElements;
                this.pagedObjects = objects.content;
            });
    }

    public updatePage(indexClicked: number) {
        const startIndex = (indexClicked - 1) * this.pageSize;
    }
}
