import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ReviewFilter} from '../../../app-models/review';

@Component({
  selector: 'app-reviews-filter',
  templateUrl: './reviews-filter.component.html',
  styles: ``
})
export class ReviewsFilterComponent {
  @Output()
  public filterChanged = new EventEmitter<ReviewFilter>();
  @Input()
  public filter: ReviewFilter;

  public setFilter(filterValue: ReviewFilter) {
    this.filter = filterValue;
    this.filterChanged.emit(filterValue);
  }
}
