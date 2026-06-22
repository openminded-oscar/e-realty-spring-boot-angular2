import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {combineLatest} from 'rxjs';
import {InterestService} from '../../app-services/interest.service';
import {Interest} from '../../app-models/interest';
import {RealtyObj} from '../../app-models/realty-obj';
import {ReviewsService} from '../../app-services/reviews.service';

@Component({
  selector: 'app-user-favorites',
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.scss']
})
export class UserFavoritesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  public interests: Interest[] = [];

  constructor(public interestService: InterestService,
              public reviewsService: ReviewsService) {
  }

  public trackById(index: number, obj: Interest): number {
    return obj.id;
  }

  ngOnInit(): void {
    this.fetchUserInterests();
  }

  private fetchUserInterests() {
    combineLatest([
      this.interestService.currentUserInterest$, this.reviewsService.currentUserReviews$
    ]).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([interests, reviews]) => {
        this.interests = interests ?? [];
        for (const interest of this.interests) {
          if (interest.id) {
            interest.reviewScheduled = (reviews ?? []).find(r => r.realtyObj?.id === interest.realtyObj?.id);
          }
        }
      });
  }

  public isFutureDate(dateTime: Date): boolean {
    const currentDate = new Date();
    return new Date(dateTime) > currentDate;
  }

  public toggleInterested(currentObject: RealtyObj) {
    this.interestService.remove(currentObject.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.fetchUserInterests();
      });
  }

  public openScheduleReviewModal(object: RealtyObj) {
    this.reviewsService.scheduleReviewFlow(object)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
