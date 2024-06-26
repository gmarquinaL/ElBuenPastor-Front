import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyLetters]'
})
export class OnlyLettersDirective {

  constructor(private ngControl: NgControl) { }

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const filteredValue = input.value.replace(/[^a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]/g, '').toUpperCase();
    this.ngControl.control?.setValue(filteredValue);
  }
}
