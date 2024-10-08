import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function valueGteAreaTotal(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const totalAreaFormControl = control.get('totalArea');
    const livingAreaFormControl = control.get('livingArea');

    const totalArea = totalAreaFormControl.value;
    const livingArea = livingAreaFormControl.value;

    if (totalArea === undefined || livingArea === undefined) {
      return null;
    }

    const error =
      Number(totalArea) < Number(livingArea) ? {totalAreaLessThenCurrent: true} : null;
    if (error) {
      totalAreaFormControl.setErrors({ invalid: true });
      livingAreaFormControl.setErrors({ invalid: true });
      totalAreaFormControl.markAsDirty();
      livingAreaFormControl.markAsDirty();
    }

    return error;
  };
}

export function valueGteFloorTotal(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const floorFormControl = control.get('floor');
    const totalFloorsFormControl = control.get('totalFloors');

    const floor = floorFormControl.value;
    const totalFloors = totalFloorsFormControl.value;

    if (floor === undefined || totalFloors === undefined) {
      return null;
    }

    const error = Number(totalFloors) < Number(floor) ? {totalFloorLessThenCurrent: true} : null;
    if (error) {
      floorFormControl.setErrors({ invalid: true });
      totalFloorsFormControl.setErrors({ invalid: true });
      floorFormControl.markAsDirty();
      totalFloorsFormControl.markAsDirty();
    }

    return error;
  };
}
