import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {InterestService} from '../../services/interest.service';
import {Interest} from '../../domain/interest';
import {RealtyObj} from '../../domain/realty-obj';
import {ReviewsService} from '../../services/reviews.service';

@Component({
  selector: 'app-user-favorites',
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.scss']
})
export class UserFavoritesComponent implements OnInit, OnDestroy {
  public interests: Interest[] = [];
  private destroy$ = new Subject<boolean>();

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
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([interests, reviews]) => {
        this.interests = interests ?? [];
        for (const interest of this.interests) {
          if (interest.id) {
            interest.reviewScheduled = (reviews ?? []).find(r => r.realtyObj?.id === interest.realtyObj?.id);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public isFutureDate(dateTime: Date): boolean {
    const currentDate = new Date();
    return new Date(dateTime) > currentDate;
  }

  public toggleInterested(currentObject: RealtyObj) {
    this.interestService.remove(currentObject.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchUserInterests();
      });
  }

  public openScheduleReviewModal(object: RealtyObj) {
    this.reviewsService.scheduleReviewFlow(object)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
