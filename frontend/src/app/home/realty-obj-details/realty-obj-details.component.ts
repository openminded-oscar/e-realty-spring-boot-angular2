import {Component, OnDestroy, OnInit} from '@angular/core';
import {RealtyObj} from '../../app-models/realty-obj';
import {RealtyObjService} from '../../app-services/realty-obj.service';
import {ActivatedRoute} from '@angular/router';
import {Photo, RealtyPhoto} from '../../app-models/photo';
import {UserService} from '../../app-services/user.service';
import {InterestService} from '../../app-services/interest.service';
import {InterestDto} from '../../app-models/interest';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ReviewsService} from '../../app-services/reviews.service';
import {ReviewDto} from '../../app-models/review';
import {HttpResponse} from '@angular/common/http';
import {combineLatest, Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {User} from '../../app-models/user';

import {RealtorContactComponent} from '../../shared/realtor-contact/realtor-contact.component';
import {DeleteRealtyModalComponent} from '../../shared/delete-realty-modal/delete-realty-modal.component';
import {ConfirmModalComponent} from '../../shared/confirm-modal/confirm-modal.component';


@Component({
  selector: 'app-realty-obj-details',
  templateUrl: './realty-obj-details.component.html',
  styleUrls: ['./realty-obj-details.component.scss']
})
export class RealtyObjDetailsComponent implements OnInit, OnDestroy {
  currentObject: RealtyObj;
  enlargedPhoto: string;
  isInterested = false;
  currentReview: ReviewDto = null;

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
              public route: ActivatedRoute) {
  }

  ngOnInit() {
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
      const interest: InterestDto = {
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

  private initUserObjectRelatedData() {
    this.interestService.get(this.currentObject.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(interestResponse => {
        if (interestResponse.body) {
          this.isInterested = true;
        }
      });

    this.reviewsService.getForObjectAndUser(this.currentObject.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((reviewsResponse: HttpResponse<ReviewDto>) => {
        if (reviewsResponse.body) {
          this.currentReview = reviewsResponse.body;
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
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
    (modalRef.componentInstance as RealtorContactComponent).realtor = this.currentObject.realtor;
  }

  public promptDelete() {
    this.modalService.open(DeleteRealtyModalComponent).result.then(data => {
      if (data) {
        this.realtyObjService.deleteById(this.currentObject.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      }
    }, error => {
      console.log('data dismissed');
    });
  }

  public openScheduleReviewModal() {
    this.reviewsService.scheduleReviewFlow(this.currentObject)
      .pipe(
        takeUntil(this.destroy$),
        tap(reviewDto => {
          if (reviewDto) {
            this.currentReview = {
              ...reviewDto,
              userId: this.user.id,
              realtyObjId: this.currentObject.id,
            };
          }
        })
      )
      .subscribe();
  }

  public removeReview() {
    this.reviewsService.remove(this.currentObject.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.currentReview = null);
  }

  public openReviewRemoveDialog() {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = 'Are you sure you want to cancel this review?';  // Passing custom message
    modalRef.result.then((result) => {
      if (result) {
        this.removeReview();
      }
    }).catch((error) => {
    });
  }
}
