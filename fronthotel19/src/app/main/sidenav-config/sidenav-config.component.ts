import { animate, state, style, transition, trigger } from '@angular/animations';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { PNotifyService } from '../../core';
import { SideNavItems } from '../models/side-nav-items';
import { SidenavService } from '../services/sidenav.service';

interface NavNode {
  name: string;
  level: number;
  children?: Array<NavNode>;
  url: string;
  icon: string;
  title: string;
  img_src: string;
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  url: string;
  icon: string;
  level: number;
  img_src: string;
}

@Component({
  selector: 'app-sidenav-config',
  templateUrl: './sidenav-config.component.html',
  styleUrls: ['./sidenav-config.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)'))
    ])
  ]
})
export class SideNavConfigComponent implements OnInit {
  activeSource = '';
  lastClicked = '';
  animationState = 'out';
  pnotify: any;
  opened = false;
  // expanded: boolean;
  menuItems: any = [];
  menuFilteredItems: any = [];
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  @HostBinding('attr.aria-expanded') ariaExpanded = false;
  @Input() item: any;
  @Input() depth: number;
  @Input() isChild: boolean;

  readonly transformer = (node: NavNode, level: number) => ({
    expandable: !node.children && node.children.length > 0,
    name: node.name,
    url: node.url,
    icon: node.icon,
    level,
    img_src: node.img_src
  });
  // tslint:disable-next-line: member-ordering
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable
  );
  // tslint:disable-next-line: member-ordering
  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );
  // tslint:disable-next-line: member-ordering
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private readonly router: Router, private readonly sidenavService: SidenavService, public dialog: MatDialog, pnotifyService: PNotifyService) {
    this.pnotify = pnotifyService.get();
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit(): void {
    this.sidenavService.sidenavConfigToggle$.subscribe(configMenuItems => {
      this.menuItems = [];
      if (configMenuItems) {
        configMenuItems.forEach(configMenu => {
          configMenu['expanded'] = false;
          this.menuItems.push(configMenu);
        });
      }
    });

    this.sidenavService.sidenavConfigOpened$.subscribe((opened: boolean) => {
      this.opened = opened;
    });
  }

  onMenuClicked(clickedName: string): void {
    this.lastClicked = clickedName;
  }

  isActive(url: string): boolean {
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
      item.expanded = !item.expanded;
    } else if (item.children && item.children.length && item.isConfiguration) {
      item.expanded = !item.expanded;
    }
  }

  navigate(menuItem: string): void {
    this.router.navigate([menuItem['url']]);
  }

  closeSideBar(): void {
    this.sidenavService.toggleSideNavConfig(false);
  }
}
