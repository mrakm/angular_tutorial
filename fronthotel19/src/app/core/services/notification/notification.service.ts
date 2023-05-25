import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../base-service';
import { PageableList } from '../pageable-list.interface';
import { Notification } from './notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {
  private static readonly BASE = '/api/notifications';
  notificationUpdate: Subject<Notification> = new Subject<Notification>();

  // tslint:disable-next-line: unnecessary-constructor
  constructor(http: HttpClient) {
    super(http);
  }

  getNotifications(page_size: number, page_number: number): Observable<PageableList<Notification>> {
    return this.post(this.makeUrl('notifications/list'), { page_size, page_number });
  }

  readNotification(id: string): Observable<Array<Notification>> {
    return this.post(this.makeUrl('notifications/read'), { id });
  }

  archiveNotification(id: string): Observable<Notification> {
    return this.post(this.makeUrl('notifications/archive'), { id });
  }

  acceptNotification(id: string): Observable<Notification> {
    return this.post(this.makeUrl('invite_notifications/accept'), { id });
  }

  rejectNotification(id: string): Observable<Notification> {
    return this.post(this.makeUrl('invite_notifications/reject'), { id });
  }

  updateNotification(id: string, type: string): Observable<Notification> {
    return this.post(this.makeUrl(`invite_notifications/${type}`), { id });
  }

  protected baseUrl(): string {
    return NotificationService.BASE;
  }
}
