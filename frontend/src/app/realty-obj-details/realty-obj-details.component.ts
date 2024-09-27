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
import {takeUntil} from 'rxjs/operators';

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

  constructor(private realtyObjService: RealtyObjService,
              private userService: UserService,
              private interestService: InterestService,
              private reviewsService: ReviewsService,
              private modalService: NgbModal,
              private socketService: SampleSocketService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const id  = params['realterId'];
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

  public setEnlargedPhoto(photo: RealtyPhoto) {
    this.enlargedPhoto = Photo.getLinkByFilename(photo.filename);
  }

  public saveInterested() {
    const interest: Interest = {
      userId: this.userService.user.id,
      realtyObjId: this.currentObject.id
    };

    this.interestService.save(interest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(interestFromServer => {
        this.isInterested = true;
      });
  }

  public removeInterested() {
    this.interestService.remove(this.userService.user.id, this.currentObject.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(interest => {
        this.isInterested = false;
      });
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
      userId: this.userService.user.id,
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
    this.interestService.get(this.userService.user.id, this.currentObject.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(interestResponse => {
        if (interestResponse.body) {
          this.isInterested = true;
        }
      });

    this.reviewsService.get(this.userService.user.id, this.currentObject.id)
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
}
