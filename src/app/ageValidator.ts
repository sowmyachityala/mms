import { AbstractControl, ValidatorFn } from '@angular/forms';

export function ageValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const dob = control.value;
        if (!dob) return null; // If no value, don't validate

        const today = new Date();
        const birthDate = new Date(dob);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        const isValid = age > minAge || (age === minAge && monthDifference >= 0);
        return isValid ? null : { ageInvalid: { value: control.value } };
    };
}
