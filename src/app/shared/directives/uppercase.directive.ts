import { CommonModule } from '@angular/common';
import { Directive, ElementRef, forwardRef, NgModule, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR, DefaultValueAccessor } from '@angular/forms';

@Directive({
  selector: '[uppercase]',
  host: {
    '(input)': 'onInput($event)',
    '(blur)': 'onTouched()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UppercaseDirective),
    multi: true
  }],
})
export class UppercaseDirective extends DefaultValueAccessor {

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    super(renderer, elementRef, false);
  }

  override writeValue(value: any): void {
    const transformed = this.transformValue(value);
    super.writeValue(transformed);
  }

  onInput($event: any): void {
    const start = $event.target.selectionStart;
    const end = $event.target.selectionEnd;
    const value = $event.target.value;
    const transformed = this.transformValue(value);
    super.writeValue(transformed);
    this.onChange(transformed);
    this.elementRef.nativeElement.setSelectionRange(start, end);
  }

  private transformValue(value: any): any {
    const result = value && typeof value === 'string'
      ? value.toUpperCase()
      : value;

    return result;
  }

}

@NgModule({
  declarations: [UppercaseDirective],
  exports: [UppercaseDirective],
  imports: [CommonModule], // Asegúrate de importar CommonModule aquí
})
export class DirectiveModule { }