import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { BaseService } from 'src/app/core/services/base-service';

@Injectable()
export class AttachmentService extends BaseService {
  /**
   * upload
   */
  private uploadAttachmentsSource: Subject<any> = new Subject();

  uploadAttachments$ = this.uploadAttachmentsSource.asObservable();

  /**
   * set parent id
   */
  private setParentIdSource = new Subject<number>();
  setParentId$ = this.setParentIdSource.asObservable();

  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * Triggiring upload
   * @param {boolean} upload
   * @memberof AttachedFileService
   */
  uploadAttachments(options: object): void {
    this.uploadAttachmentsSource.next(options);
  }
  /**
   * Setting parentId
   * @param {number} _parentId
   * @memberof AttachedFileService
   */
  setParentId(_parentId: number): void {
    this.setParentIdSource.next(_parentId);
  }
}
