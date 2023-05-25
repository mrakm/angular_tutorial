import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { PageableList } from 'src/app/core/services/pageable-list.interface';
import { Notification, NotificationService } from '../../../core';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  notifications: Array<Notification> = [];
  @Input() hidePagination: boolean;
  pageSize = 8;
  pageNumber = 1;
  totalCount: number;
  @Output() readonly notificationChangeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.setupActionCable();
  }

  timeSince(date: string): string {
    return moment(date).fromNow();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showInviteAcceptReject(notification): boolean {
    const status = notification.invite_status === 'INVITED' || notification.invite_status === 'SHARE' || notification.invite_status === 'HIRE';

    return status;
  }

  readInvite(notification): void {
    this.notificationService.readNotification(notification.id).subscribe((response: Array<Notification>) => {
      notification.is_read = true;
    });
  }

  acceptInvite(notification, event): void {
    this.notificationService.acceptNotification(notification.id).subscribe((response: Notification) => { });
  }

  archiveNotification(notification, index): void {
    this.notificationService.archiveNotification(notification.id).subscribe((response: Notification) => {
      this.notifications.splice(index, 1);
    });
  }

  rejectInvite(notification, event): void {
    this.notificationService.rejectNotification(notification.id).subscribe((response: Notification) => { });
  }

  nextPage(): void {
    this.pageNumber++;
    this.loadNotifications();
  }

  previousPage(): void {
    this.pageNumber--;
    this.loadNotifications();
  }

  isLastPage(): boolean {
    return this.pageNumber === Math.ceil(this.totalCount / this.pageSize);
  }

  isDeletedAccount(message: string): boolean {
    return message.includes('has deleted');
  }

  isAcceptedInvitaion(message: string): boolean {
    return message.includes('your invitation');
  }

  navigate(notificationType: string): void {
    if (notificationType === 'Pusher::PusherNotification') {
      this.router.navigate(['/a/l/conversations']);
    }
  }

  private loadNotifications(): void {
    // this.notificationService
    //   .getNotifications(this.pageSize, this.pageNumber)
    //   .pipe(take(1))
    //   .subscribe((pageableList: PageableList<Notification>) => {
    //     this.notifications = pageableList.items || [];
    //     this.notificationChangeEvent.emit(this.notifications.some((notification: Notification) => !notification.is_read));
    //     this.totalCount = pageableList.meta?.total_count || 0;
    //   });
  }

  private setupActionCable(): void {
    // this.cable = this.actionCableWrapperService.cable();
    // const channel: Channel = this.cable.channel('NotificationsChannel');
    // if (channel) {
    //   this.subscription = channel.received().subscribe(message => {
    //     this.notifications = message.notifications;
    //     this.notificationChangeEvent.emit(this.notifications.some((notification: Notification) => !notification.is_read));
    //   });
    // } else {
    //   // TODO: Send this to Rollbar
    //   this.rollbar.error('Socket not connected to for NotificationsChannel');
    // }
  }
}
