import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {InterestService} from '../../services/interest.service';
import {Interest} from '../../domain/interest';
import {RealtyObj} from '../../domain/realty-obj';
import {ScheduleFormModalComponent} from '../../shared/schedule-form-modal/schedule-form-modal.component';
import {NgbDateStruct, NgbModal, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {ReviewsService} from '../../services/reviews.service';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'app-user-favorites',
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.scss']
})
export class UserFavoritesComponent implements OnInit, OnDestroy {
  public interests: Interest[] = [];
  private destroy$ = new Subject<boolean>();

  constructor(public interestService: InterestService,
              public reviewsService: ReviewsService,
              public modalService: NgbModal) {
  }

  public trackById(index: number, obj: Interest): number {
    return obj.id;
  }

  ngOnInit(): void {
    this.fetchUserInterests();
  }

  private fetchUserInterests() {
    combineLatest(
      this.interestService.currentUserInterest$, this.reviewsService.currentUserReviews$
    ).pipe(takeUntil(this.destroy$))
      .subscribe(([interests, reviews]) => {
        this.interests = interests as Interest[] ?? [];
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
    const modalRef = this.modalService.open(ScheduleFormModalComponent, {ariaLabelledBy: 'modal-basic-title'});
    modalRef.result.then((value: {
      reviewDate: NgbDateStruct,
      reviewTime: NgbTimeStruct
    }) => {
      this.saveReviewAndClose(object.id, value);
    }, error => {
      console.log('data dismissed');
    });
    modalRef.componentInstance.realtyObject = object;
  }

  public saveReviewAndClose(objectId: number, value: {
    reviewDate: NgbDateStruct,
    reviewTime: NgbTimeStruct
  }) {
    this.reviewsService.save({
      ...value,
      realtyObjId: objectId,
    }).pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
