import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router, RouterEvent } from '@angular/router';
import { RouteChangeService } from '../../core/route-change/route-change.service';
import { BreadCrumb } from './bread-crumb.model';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {
  breadCrumbs: Array<BreadCrumb> = [];
  limeSurveyQuestionnaire: { qid: number; token: string } = { qid: undefined, token: undefined };
  breadCrumbTitles: any = {
    d: 'Dashboard',
    product: 'Product',
   
  };

  pageTitle = '';

  private routeChangeParams: Params;

  constructor(private readonly router: Router, public activatedRoute: ActivatedRoute, private readonly routeChangeService: RouteChangeService) {
    this.subscribeToRouteChangeEvents();

    // The questionnaire component emits the matrix url params on init.
    // Subscribe to the params to handle the questionnaire title for the bread crumb.
    this.routeChangeService.params$.subscribe((params: Params) => {
      this.routeChangeParams = params;
    });
  }

  ngOnInit(): void {
    this.subscribeToRouteParams();
    this.determinePageProperties();
  }

  private subscribeToRouteChangeEvents(): void {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.determinePageProperties();
      }
    });
  }

  private subscribeToRouteParams(): void {
    this.activatedRoute.queryParams.subscribe(params => (this.limeSurveyQuestionnaire = { qid: parseInt(params.s, 10), token: params.t }));
  }

  private determinePageProperties(): void {
    this.breadCrumbs = [];
    const blockPush = false;
    // Example: ['a', 'c']
    let urlParts = this.router.url.split('/');

    // TODO: Removes trailing matrix params from the last part.
    if (urlParts.length) {
      urlParts[urlParts.length - 1] = urlParts[urlParts.length - 1].split(';')[0];
    }

    urlParts.shift();
    urlParts.shift();

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < urlParts.length; i++) {
      let urlPart = urlParts[i];
      const route: any = urlPart.split('?');
      urlPart = route.length ? route[0] : urlParts[i];

      // We will use this title and URL to build the bread crumb unless `blockPush` is true.
      const title = this.breadCrumbTitles[urlPart];
      const breadCrumbUrlParts = [urlPart];

      // hack for a/l/clients/abcd-efgh/dashboard breadcrumb
      // if (urlPart === 'dashboard' && i === 2) {
      //   breadCrumbUrlParts.unshift(urlParts[1]);
      //   breadCrumbUrlParts.unshift(urlParts[0]);
      // }

      if (!blockPush && urlPart.length < 30 && urlPart !== 'undefined') {
        this.breadCrumbs.push(new BreadCrumb(title || 'UNKNOWN', this.buildUrl(breadCrumbUrlParts, i)));
      }
    }
  }

  private buildUrl(urlParts: Array<string>, index: number): string {
    const userTypeFragment = this.router.url.split('/')[2];

    return index === 0 ? '#' : [userTypeFragment].concat(urlParts).join('/');
  }
}
