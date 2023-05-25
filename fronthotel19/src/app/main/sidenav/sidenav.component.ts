import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavItems } from '../models/side-nav-items';
import { SidenavService } from '../services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      )
    ])
  ]
})
export class SideNavComponent implements OnInit {
  expanded: boolean;
  opened = true;
  @HostBinding('attr.aria-expanded') ariaExpanded = false;
  @Input() item: any;
  @Input() depth: number;
  @Input() isChild: boolean;

  constructor(public sidenavService: SidenavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit(): void {
    this.sidenavService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
      }
    });

    // this.sidenavService.sidenavOpened$.subscribe((opened: boolean) => {
    this.opened = true;
    // });

  }

  isActive(url: string, name: string): boolean {
    let flag = false;
    if (this.router.url === `/${url}`) {
      flag = true;
    } else {
      flag = false;
    }

    return flag;
  }

  onItemSelected(item: SideNavItems): void {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.url]);
    } else if (item.children && item.children.length && !item.isConfiguration) {
      this.expanded = !this.expanded;
    } else if (item.isConfiguration) {
      this.openConfigSideNav(item.children);

    }
  }

  openConfigSideNav(configMenuItems): void {
    this.sidenavService.toggleSideNavConfig(configMenuItems);
  }
}
