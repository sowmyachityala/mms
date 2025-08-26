import { AbstractControl } from '@angular/forms';

export function EmailPhoneValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[0-9]{10,14}$/; // Updated phone regex to match min length 10 and max length 14

  const value = control.value;

  if (!value) {
    return null; // Return null if the field is empty
  }

  if (!emailRegex.test(value) && !phoneRegex.test(value)) {
    return { email: true }; 
  }

  return null; // Return null if the value is valid
}
