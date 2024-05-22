import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from './directives/uppercase.directive';
import { DirectiveDisabledInput } from './directives/disabled-input.directive';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [ DirectiveModule , DirectiveDisabledInput]
})
export class SharedModule { }
