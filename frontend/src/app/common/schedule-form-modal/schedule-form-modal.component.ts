import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

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

  constructor(
    public fb: FormBuilder,
    public modal: NgbActiveModal
  ) { }

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

    // Allow today's date and disable past dates and weekends
    return selectedDate < today || selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
  }
}
