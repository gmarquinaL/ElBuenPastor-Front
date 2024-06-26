import { Directive, HostListener, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appUppercaseLettersAndHyphens]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: UppercaseLettersAndHyphensDirective,
    multi: true
  }]
})
export class UppercaseLettersAndHyphensDirective implements ControlValueAccessor {
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value.replace(/[^a-zA-Z-]/g, ''); // Remove invalid characters
    value = value.toUpperCase(); // Convert to uppercase
    input.value = value;
    this.onChange(value);
  }

  writeValue(value: any): void {
    this.el.nativeElement.value = value ? value.toUpperCase().replace(/[^a-zA-Z-]/g, '') : '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }
}
