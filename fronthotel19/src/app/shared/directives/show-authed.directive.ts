import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/core';

@Directive({ selector: '[showAuthed]' })
export class ShowAuthedDirective implements OnInit {
  @Input() set showAuthed(condition: boolean) {
    this.condition = condition;
  }

  condition: boolean;
  constructor(private readonly templateRef: TemplateRef<any>, private readonly authService: AuthService, private readonly viewContainer: ViewContainerRef) {}

  ngOnInit(): void {
    this.authService.isUserAuthenticated$.subscribe(isUserAuthenticated => {
      if ((isUserAuthenticated && this.condition) || (!isUserAuthenticated && !this.condition)) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
