import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { BaseService } from 'src/app/core/services/base-service';

@Injectable()
export class AttachedFileService extends BaseService {
  /**
   * isAdded
   */
  private setIsAddedSource = new Subject<boolean>();
  setIsAdded$ = this.setIsAddedSource.asObservable();

  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * Setting is Added
   * @param {boolean} isAdded
   * @memberof AttachedFileService
   */
  setIsAdded(isAdded: boolean): void {
    this.setIsAddedSource.next(isAdded);
  }
}
