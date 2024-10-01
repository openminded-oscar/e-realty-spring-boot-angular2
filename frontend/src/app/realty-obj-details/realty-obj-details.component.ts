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
import {convertUTCDateToLocalDate} from '../commons';
import {Subject} from 'rxjs/Subject';
import {takeUntil, tap} from 'rxjs/operators';
import {User} from '../domain/user';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'app-realty-obj-details',
  templateUrl: './realty-obj-details.component.html',
  styleUrls: ['./realty-obj-details.component.scss']
})
export class RealtyObjDetailsComponent implements OnInit, OnDestroy {
  currentObject: RealtyObj;
  enlargedPhoto: string;

  reviewDate: any = null;
  reviewTime: any = null;

  isInterested = false;

  currentReview: any = null;

  private destroy$ = new Subject<boolean>();

  public defaultRealtyObjectPhoto = 'https://placehold.co/650x400?text=Main+photo';
  public defaultRealtorPhoto = 'https://placehold.co/600x400?text=Realtor+photo';
  public user: User;
  private currentUserObjects: RealtyObj[] = [];

  constructor(public realtyObjService: RealtyObjService,
              public userService: UserService,
              public interestService: InterestService,
              public reviewsService: ReviewsService,
              public modalService: NgbModal,
              public socketService: SampleSocketService,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    combineLatest([
      this.userService.user$.pipe(
        tap(user => {
          this.user = user;
          this.currentUserObjects = user ? user.realtyObjects : [];
        }),
        takeUntil(this.destroy$)
      ),
      this.route.params.pipe(takeUntil(this.destroy$))
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([user, params]) => {
        if (!user || !params['realterId']) {
          return;
        }
        const id = params['realterId'];
        if (id) {
          this.realtyObjService.findById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(realtyObj => {
              this.enlargedPhoto = RealtyObj.getMainPhoto(realtyObj);
              this.currentObject = realtyObj;

              this.initObjectRelatedData();
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
      this.interestService.remove(this.user.id, this.currentObject.id)
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

  public isPreviewDateDisabled(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  public openScheduleReviewModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(data => {

    }, (reason) => {
      console.log(reason);
    });
  }

  public saveReviewAndClose() {
    const utcDatetime =
      new Date(
        this.reviewDate.year,
        this.reviewDate.month - 1,
        this.reviewDate.day,
        this.reviewTime.hour,
        this.reviewTime.minute,
        this.reviewTime.second
      );
    const review = {
      userId: this.user.id,
      realtyObjId: this.currentObject.id,
      dateTime: convertUTCDateToLocalDate(utcDatetime)
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

  private initObjectRelatedData() {
    this.interestService.get(this.user.id, this.currentObject.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(interestResponse => {
        if (interestResponse.body) {
          this.isInterested = true;
        }
      });

    this.reviewsService.get(this.user.id, this.currentObject.id)
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
}
