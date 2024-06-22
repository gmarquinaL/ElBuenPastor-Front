import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFormatDate]'
})
export class AutoFormatDateDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent): void {
    const input = this.el.nativeElement;
    let trimmed = input.value.replace(/\D/g, ''); 

    if (trimmed.length > 8) {
      trimmed = trimmed.substr(0, 8);
    }

    let formatted = '';
    if (trimmed.length <= 2) {
      formatted = trimmed;
    } else if (trimmed.length <= 4) {
      formatted = `${trimmed.substr(0, 2)}/${trimmed.substr(2, 2)}`;
    } else {
      formatted = `${trimmed.substr(0, 2)}/${trimmed.substr(2, 2)}/${trimmed.substr(4, 4)}`;
    }

    input.value = formatted;
  }
}
