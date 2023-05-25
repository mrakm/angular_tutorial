import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Output() readonly clickOutside = new EventEmitter();

  constructor(private readonly _elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target']) onClick(targetElement): void {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
