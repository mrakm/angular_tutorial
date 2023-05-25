import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Output() readonly notificationChangeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private readonly authService: AuthService) { }

  ngOnInit(): void { }

  notify(event): void {
    this.notificationChangeEvent.emit(event);
  }

  moreNotificationsLink(): string {

    return '/a/notifications';
  }
}
