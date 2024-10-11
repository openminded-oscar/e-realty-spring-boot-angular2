import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {
  dateBasedOnNGBDatePicker,
  ReviewsService
} from '../../services/reviews.service';
import {RealtyObj} from '../../domain/realty-obj';
import {switchMap, takeUntil, tap} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {ReviewPostDto} from '../../domain/review';

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
  selector: 'app-schedule-form-modal',
  templateUrl: './schedule-form-modal.component.html',
  styleUrls: ['./schedule-form-modal.component.scss']
})
export class ScheduleFormModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  public realtyObject: RealtyObj;
  public reviewTimeForm: FormGroup;

  public availableTimesOfDay: Date[] = [];
  public savedReview: ReviewPostDto;

  constructor(
    public reviewService: ReviewsService,
    public fb: FormBuilder,
    public modal: NgbActiveModal,
  ) {
  }

  ngOnInit(): void {
    this.reviewTimeForm = this.fb.group({
      reviewDate: new FormControl(null, Validators.required),
      reviewTime: new FormControl(null, Validators.required),
    }, {validators: reviewDateTimeValidator()});
    this.reviewTimeForm.controls.reviewDate.valueChanges
      .pipe(
        tap(() => {
          this.availableTimesOfDay = [];
        }),
        switchMap((dateNgb: NgbDateStruct) => {
          const date = dateBasedOnNGBDatePicker(dateNgb);
          return this.reviewService.getForObjectAndDate(
            this.realtyObject.id,
            date
          );
        })
      )
      .subscribe(values => {
        this.availableTimesOfDay = values.body.map(s => new Date(s));
      });
  }

  public get googleCalendarLink() {
    const startTime = this.reviewTimeForm.value.reviewTime;
    const endTime = new Date(startTime);
    endTime.setUTCHours(endTime.getUTCHours() + 1);

    let titleObjectPart = '';
    if (this.realtyObject) {
      titleObjectPart = encodeURIComponent(` Apartment at ` +
        `${this.realtyObject.address?.street} str. est. at ${this.realtyObject.price}`);
    }

    // TODO add realter contacts and phone number!
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Realperfect+Review` + titleObjectPart +
      `&dates=${this.formatToGoogleCalendarUTC(startTime)}/${this.formatToGoogleCalendarUTC(endTime)}` +
      `&location=To+Be+Contacted&sf=true&output=xml`;
  }

  private formatToGoogleCalendarUTC(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    // Combine the components into the required format
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  public isPreviewDateDisabled(date: NgbDateStruct): boolean {
    const now = new Date();
    const selectedDate = new Date(date.year, date.month - 1, date.day);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return selectedDate < today || selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
  }

  public selectTimeslot(time: Date) {
    this.reviewTimeForm.controls.reviewTime.setValue(time);
  }

  public saveReview(): void {
    this.reviewService.saveReview({
      realtyObjId: this.realtyObject.id,
      dateTime: this.reviewTimeForm.controls.reviewTime.value
    }).pipe(
        takeUntil(this.destroy$),
        tap(reviewDto => {
          this.savedReview = reviewDto;
        })
      )
      .subscribe();

  }

  public close(savedReview: ReviewPostDto) {
    this.modal.close(savedReview);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
