import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteChangeService {
  private readonly params = new Subject<Params>();
  // tslint:disable-next-line: member-ordering
  params$ = this.params.asObservable();

  emitParams(params: Params): void {
    this.params.next(params);
  }
}
