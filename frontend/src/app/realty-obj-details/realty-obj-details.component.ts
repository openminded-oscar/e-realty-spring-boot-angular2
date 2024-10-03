import {Component, OnDestroy, OnInit} from '@angular/core';
import {RealtyObj} from '../domain/realty-obj';
import {RealtyObjService} from '../services/realty-obj.service';
import {ActivatedRoute} from '@angular/router';
import {Photo, RealtyPhoto} from '../domain/photo';
import {UserService} from '../services/user.service';
import {InterestService} from '../services/interest.service';
import {Interest} from '../domain/interest';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ReviewsService} from '../services/reviews.service';
import {Review} from '../domain/review';
import {HttpResponse} from '@angular/common/http';
import {SampleSocketService} from '../services/socket/sample-socket.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil, tap} from 'rxjs/operators';
import {User} from '../domain/user';
import {combineLatest} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {RealtorContactComponent} from '../realtor/realtor-contact/realtor-contact.component';

export function reviewDateTimeValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors => {
    const reviewDate = formGroup.get('reviewDate')?.value;
    const reviewTime = formGroup.get('reviewTime')?.value;

    if (!reviewDate || !reviewTime) {
      return {emptyPart: true};
    }

    const now = new Date();
    const selectedDateTime = new Date(
      reviewDate.year,
      reviewDate.month - 1,
      reviewDate.day,
      reviewTime.hour,
      reviewTime.minute
    );

    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now

    if (selectedDateTime < threeHoursLater) {
      return {tooSoon: true};
    }

    return null;
  };
}


@Component({
  selector: 'app-realty-obj-details',
  templateUrl: './realty-obj-details.component.html',
  styleUrls: ['./realty-obj-details.component.scss']
})
export class RealtyObjDetailsComponent implements OnInit, OnDestroy {
  currentObject: RealtyObj;
  enlargedPhoto: string;

  isInterested = false;

  currentReview: any = null;

  private destroy$ = new Subject<boolean>();

  public defaultRealtyObjectPhoto = 'https://placehold.co/650x400?text=Main+photo';
  public defaultRealtorPhoto = 'https://placehold.co/600x400?text=Realtor+photo';
  public user: User;
  private currentUserObjects: RealtyObj[] = [];

  public reviewTimeForm: FormGroup;

  constructor(public realtyObjService: RealtyObjService,
              public userService: UserService,
              public interestService: InterestService,
              public reviewsService: ReviewsService,
              public modalService: NgbModal,
              public socketService: SampleSocketService,
              public fb: FormBuilder,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.reviewTimeForm = this.fb.group({
      reviewDate: new FormControl(null),
      reviewTime: new FormControl(null),
    }, {validators: reviewDateTimeValidator()});

    combineLatest([
      this.userService.user$.pipe(
        tap(user => {
          this.user = user;
          this.currentUserObjects = user ? user.realtyObjects : [];
        })
      ),
      this.route.params
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([user, params]) => {
        const id = params['objectId'];
        if (id) {
          this.realtyObjService.findById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(realtyObj => {
              this.enlargedPhoto = RealtyObj.getMainPhoto(realtyObj);
              this.currentObject = realtyObj;
              if (!user) {
                return;
              } else {
                this.initUserObjectRelatedData();
              }
            });
        }
      });

  }

  public isMyObject(realtyObject: RealtyObj) {
    const id = realtyObject.id;
    if (this.currentUserObjects) {
      const object = this.currentUserObjects.find((obj) => obj.id === id);
      return !!object;
    }
    return false;
  }

  public setEnlargedPhoto(photo: RealtyPhoto) {
    this.enlargedPhoto = Photo.getLinkByFilename(photo.filename);
  }

  public toggleInterested() {
    if (this.isInterested) {
      this.interestService.remove(this.currentObject.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(interest => {
          this.isInterested = false;
        });
    } else {
      const interest: Interest = {
        userId: this.user.id,
        realtyObjId: this.currentObject.id
      };
      this.interestService.save(interest)
        .pipe(takeUntil(this.destroy$))
        .subscribe(interestFromServer => {
          this.isInterested = true;
        });
    }
  }

  public isPreviewDateDisabled(date: NgbDateStruct): boolean {
    const now = new Date();
    const selectedDate = new Date(date.year, date.month - 1, date.day);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Allow today's date and disable past dates and weekends
    return selectedDate < today || selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
  }


  public openScheduleReviewModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(data => {

    }, (reason) => {
      console.log(reason);
    });
  }

  public saveReviewAndClose() {
    const reviewDate = this.reviewTimeForm.value.reviewDate;
    const reviewTime = this.reviewTimeForm.value.reviewTime;

    const utcDatetime =
      new Date(
        reviewDate.year,
        reviewDate.month - 1,
        reviewDate.day,
        reviewTime.hour,
        reviewTime.minute,
        reviewTime.second
      );

    const review = {
      userId: this.user.id,
      realtyObjId: this.currentObject.id,
      dateTime: utcDatetime
    };

    this.reviewsService.save(review)
      .pipe(takeUntil(this.destroy$))
      .subscribe(reviewsResponse => {
        if (reviewsResponse.body) {
          this.currentReview = reviewsResponse.body;
        }
      });

    this.modalService.dismissAll();
  }

  private initUserObjectRelatedData() {
    this.interestService.get(this.currentObject.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(interestResponse => {
        if (interestResponse.body) {
          this.isInterested = true;
        }
      });

    this.reviewsService.get(this.currentObject.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((reviewsResponse: HttpResponse<Review>) => {
        if (reviewsResponse.body) {
          this.currentReview = reviewsResponse.body;
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public setDefaultRealtorPhoto(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultRealtorPhoto;
  }

  public setDefaultRealtyObjectPhoto(event: ErrorEvent) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultRealtyObjectPhoto;
  }

  public openRealtorContacts() {
    const modalRef = this.modalService.open(RealtorContactComponent);
    (modalRef.componentInstance as RealtorContactComponent).realtor = this.currentObject.realter;
  }
}
