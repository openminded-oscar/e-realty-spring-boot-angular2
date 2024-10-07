import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {dateTimeBasedOnNGBDateTimePicker} from '../../services/reviews.service';

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
export class ScheduleFormModalComponent implements OnInit {
  public reviewTimeForm: FormGroup;

  public get googleCalendarLink() {
    const startTime = dateTimeBasedOnNGBDateTimePicker(this.reviewTimeForm.value);
    const endTime = new Date(startTime);
    endTime.setUTCHours(endTime.getUTCHours() + 1);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Realperfect+Realty+Review` +
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


  constructor(
    public fb: FormBuilder,
    public modal: NgbActiveModal
  ) {
  }

  ngOnInit(): void {
    this.reviewTimeForm = this.fb.group({
      reviewDate: new FormControl(null),
      reviewTime: new FormControl(null),
    }, {validators: reviewDateTimeValidator()});
  }

  public isPreviewDateDisabled(date: NgbDateStruct): boolean {
    const now = new Date();
    const selectedDate = new Date(date.year, date.month - 1, date.day);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return selectedDate < today || selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
  }
}
