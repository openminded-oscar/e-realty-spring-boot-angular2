import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {Filter} from '../realty-objs-gallery/realty-objs-gallery.component';
import {ConfigService} from '../services/config.service';

@Component({
  selector: 'app-realty-object-filter',
  templateUrl: './realty-object-filter.component.html',
  styleUrls: ['./realty-object-filter.component.scss']
})
export class RealtyObjectFilterComponent implements OnInit {
  public filter: Filter;
  public ordering: string;

  @Input()
  public initialOrdering!: string;

  @Input()
  public set initialFilter(value: Filter) {
    this._initialFilter = value;
    this.filter = _.cloneDeep(this.initialFilter);
  }

  public get initialFilter(): Filter {
    return this._initialFilter;
  }

  private _initialFilter!: Filter;

  public orderingOptions = ['Recently added', 'Newest', 'Address', 'Price', 'Area'];
  public buildingTypes: string[];

  @Output()
  filterChange = new EventEmitter<Filter>();
  @Output()
  orderChange = new EventEmitter<string>();

  constructor(public config: ConfigService) {
  }

  ngOnInit(): void {
    this.buildingTypes = this.config.supportedBuildingTypes;
  }

  public resetFilters() {
    this.filter = _.cloneDeep(this.initialFilter);
    this.applyFilter();
  }

  public applyFilter() {
    this.filterChange.emit(this.filter);
  }

  public selectOrderingOption(option: string) {
    this.ordering = option;
    this.orderChange.emit(this.ordering);
    alert('Ordering not yet implemented');
  }
}
