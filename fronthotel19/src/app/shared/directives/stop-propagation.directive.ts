import { Directive, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[clickStopPropagation]'
})
export class ClickStopPropagationDirective {
  @HostListener('click', ['$event']) onClick(event: any): void {
    event.stopPropagation();
  }
}
