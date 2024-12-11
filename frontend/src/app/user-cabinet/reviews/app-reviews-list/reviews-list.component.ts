import {Component, Input} from '@angular/core';
import {Review} from '../../../app-models/review';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styles: ``
})
export class ReviewsListComponent {
  @Input()
  public reviews: Review[] = [];
  @Input() showActionButtons!: boolean;


  constructor() {
  }

  public trackById(index: number, obj: Review): number {
    return obj.id;
  }
}
