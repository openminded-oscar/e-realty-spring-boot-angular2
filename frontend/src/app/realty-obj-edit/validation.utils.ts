import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {BackendSupportedOperations} from '../services/realty-obj.service';

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

export function priceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors => {
    const targetOperationsIncluded: {
      name: string,
      checked: boolean
    } [] = control.get('targetOperations')?.value || [];
    const sellChecked = targetOperationsIncluded.find(c => c.name === BackendSupportedOperations.BUY)?.checked;
    const rentChecked = targetOperationsIncluded.find(c => c.name === BackendSupportedOperations.RENT)?.checked;

    const price = control.get('price');
    const priceForRent = control.get('priceForRent');

    patchErrors(price, 'priceRequiredForSelling', undefined);
    patchErrors(priceForRent, 'priceForRentRequired', undefined);

    if (sellChecked && !price.value) {
      patchErrors(price, 'priceRequiredForSelling', true);
    }

    if (rentChecked && !priceForRent.value) {
      patchErrors(priceForRent, 'priceForRentRequired', true);
    }

    return null;
  };
}
