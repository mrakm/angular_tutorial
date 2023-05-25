import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  largeDock = false;
  isSideNavOpened = false;
  isSideNavConfigOpened = false;

  currentUrl = new BehaviorSubject<string>(undefined);
  private readonly sidenavToggle = new Subject<any>();
  private readonly sidenavOpenedChange = new Subject<boolean>();
  private readonly largeDockChanged = new Subject<boolean>();
  private readonly menuChanged = new Subject<string>();
  private readonly sidenavConfigToggle = new Subject<any>();
  private readonly sidenavConfigOpenedChange = new Subject<boolean>();

  // tslint:disable-next-line: member-ordering
  sidenavToggle$ = this.sidenavToggle.asObservable();
  // tslint:disable-next-line: member-ordering
  sidenavOpened$ = this.sidenavOpenedChange.asObservable();
  // tslint:disable-next-line: member-ordering
  largeDock$ = this.sidenavOpenedChange.asObservable();
  // tslint:disable-next-line: member-ordering
  menuChanged$ = this.menuChanged.asObservable();
  // tslint:disable-next-line: member-ordering
  sidenavConfigToggle$ = this.sidenavConfigToggle.asObservable();
  // tslint:disable-next-line: member-ordering
  sidenavConfigOpened$ = this.sidenavConfigOpenedChange.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  toggleSideNav(): void {
    this.isSideNavOpened = !this.isSideNavOpened;
    this.sidenavToggle.next();
  }

  toggleSideNavConfig(configMenuItems): void {
    this.isSideNavConfigOpened = !this.isSideNavConfigOpened;
    this.sidenavConfigToggle.next(configMenuItems);
  }

  emitSidenavOpenedChange(opened: boolean): void {
    this.sidenavOpenedChange.next(opened);
  }

  emitSidenavConfigOpenedChange(opened: boolean): void {
    this.sidenavConfigOpenedChange.next(opened);
  }

  toggleLargeDock(): void {
    this.largeDock = !this.largeDock;
    this.largeDockChanged.next();
  }

  changeMenuItems(option: string): void {
    this.menuChanged.next(option);
  }
}
