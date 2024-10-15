import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

function patchErrors(formControl: AbstractControl, errorKey: string, errorValue: any): void {
  const existingErrors = formControl.errors || {};

  if (errorValue) {
    existingErrors[errorKey] = errorValue;
    formControl.setErrors(existingErrors);
  } else {
    delete existingErrors[errorKey];
    formControl.setErrors(Object.keys(existingErrors).length ? existingErrors : null);
  }
}

export function valueGteThanTotal(keyCurrentValue: string, keyTotalValue: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentValueFormControl = control.get(keyCurrentValue);
    const totalValueFormControl = control.get(keyTotalValue);

    if (!totalValueFormControl || !currentValueFormControl) {
      return null;
    }
    const totalArea = totalValueFormControl.value;
    const livingArea = currentValueFormControl.value;

    if (totalArea == null || livingArea == null) {
      return null;
    }

    const error = Number(totalArea) < Number(livingArea) ? {
      totalLessThenCurrent: true
    } : undefined;
    if (error) {
      patchErrors(totalValueFormControl, 'totalLessThenCurrent', true);
      patchErrors(currentValueFormControl, 'totalLessThenCurrent', true);
    } else {
      patchErrors(totalValueFormControl, 'totalLessThenCurrent', undefined);
      patchErrors(currentValueFormControl, 'totalLessThenCurrent', undefined);
    }

    return error;
  };
}

export function atLeastOnePriceRequired(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const priceControl = formGroup.get('price');
    const priceForRentControl = formGroup.get('priceForRent');

    if (!priceControl || !priceForRentControl) {
      return null;
    }

    const price = priceControl.value;
    const priceForRent = priceForRentControl.value;

    if (!price && !priceForRent) {
      patchErrors(priceControl, 'atLeastOnePriceRequired', true);
      patchErrors(priceForRentControl, 'atLeastOnePriceRequired', true);
      return { atLeastOnePriceRequired: true };
    } else {
      patchErrors(priceControl, 'atLeastOnePriceRequired', undefined);
      patchErrors(priceForRentControl, 'atLeastOnePriceRequired', undefined);
    }

    return null; // Validation passed
  };
}

