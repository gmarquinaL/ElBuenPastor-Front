import { CommonModule } from '@angular/common';
import { Directive, Input, NgModule } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

@Directive({
  selector: '[disableControl]',
})
export class DisableControlDirective {
  @Input() disableControl: boolean;

  constructor(private ngControl: NgControl) {}

  ngOnInit(): void {
    if (this.ngControl) {
      const formControl: AbstractControl | null = this.ngControl.control;
      if (formControl) {
        if (this.disableControl) {
          formControl.disable({ onlySelf: true });
        } else {
          formControl.enable({ onlySelf: true });
        }
      }
    }
  }
}

@NgModule({
  declarations: [DisableControlDirective],
  exports: [DisableControlDirective],
  imports: [CommonModule], // Asegúrate de importar CommonModule aquí
})
export class DirectiveDisabledInput {}
