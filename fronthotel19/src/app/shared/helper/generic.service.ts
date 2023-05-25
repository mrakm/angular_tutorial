import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/core/services/base-service';

/**
 *
 *
 * @export
 * @class GenericService
 * @extends {BaseService}
 */
@Injectable({ providedIn: 'root' })
export class GenericService extends BaseService {
  /**
   * Constructor
   *
   *
   * @method constructor
   * @param http Http
   */
  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * Send http get request to server.
   *
   * @method get
   * @param url string
   * @param params object
   */
  __get(url, params?): any {
    return this.get(`${url}`, params);
  }

  /**
   * Send http put request to server.
   *
   * @method put
   * @param url string
   * @param putBody object
   */
  __put(url, putBody): any {
    return this.put(`${url}`, putBody);
  }

  /**
   * Send http post request to server
   *
   * @method post
   * @param url string
   * @param postBody object
   */
  __post(url, postBody, hasBlobRes?): any {
    return this.post(`${url}`, postBody, hasBlobRes);
  }

  /**
   * Send http delte request to server
   *
   * @method delete
   * @param url string
   */
  __delete(url): any {
    return this.put(`${url}`);
  }
}
