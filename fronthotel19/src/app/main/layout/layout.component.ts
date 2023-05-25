import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core';
import { SpinnerService } from '../../modules/dashboard/services/spinner.service';
import { SideNavItems } from '../models/side-nav-items';
import { SidenavService } from '../services/sidenav.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterContentChecked {
  showBackdrop = false;
  opened = true;
  configOpened = false;
  closeOnClickOutside = false;
  closeOnClickBackdrop = false;
  dock = true;
  mode = 'push';
  spinnerInfo: { isLoading: boolean; isLoadingText: string };
  currentPath: string;
  menuItems: Array<SideNavItems> = this.authService.getCurrentUser().menu;
  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly sidenavService: SidenavService,
    private readonly spinnerService: SpinnerService,
    private readonly authService: AuthService
  ) {}

  onSidebarOpenedChange(opened: boolean): void {
    this.sidenavService.emitSidenavOpenedChange(opened);
  }

  onSidebarConfigOpenedChange(configOpened: boolean): void {
    this.sidenavService.emitSidenavConfigOpenedChange(configOpened);
  }

  ngOnInit(): void {
    this.onSidebarOpenedChange(this.opened);
    this.onSidebarConfigOpenedChange(this.configOpened);
    this.sidenavService.sidenavToggle$.subscribe(() => {
      this.toggleSidebar();
    });

    this.sidenavService.sidenavConfigToggle$.subscribe(() => {
      this.toggleSidebarConfig();
    });
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
    this.spinnerService.isLoadingListener.subscribe(response => {
      this.spinnerInfo = response;
    });
    this.currentPath = window.location.pathname;
  }

  toggleSidebar(): void {
    this.opened = !this.opened;
  }

  toggleSidebarConfig(): void {
    this.configOpened = !this.configOpened;
  }

  // tslint:disable-next-line: no-empty
  _onClosed(): void {}
}
