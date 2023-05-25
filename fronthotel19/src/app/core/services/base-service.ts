import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from './api-response.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export class BaseService {
  constructor(protected readonly http: HttpClient) {}

  download(url: string, params = {}, headers: HttpHeaders): Observable<Blob> {
    // Assign query params to the request.
    let httpParams = new HttpParams();
    if (Object.keys(params).length > 0) {
      Object.keys(params).forEach((key: string) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    const options = { params: httpParams, headers, responseType: 'blob' as 'json' };

    return this.http
      .get<ApiResponse>(url, options)
      .pipe(map((res: any) => res))
      .pipe(catchError(this.handleError<ApiResponse>()));
  }

  get<T>(url: string, params = {}): Observable<T> {
    // Assign query params to the request.
    let httpParams = new HttpParams();
    if (Object.keys(params).length > 0) {
      Object.keys(params).forEach((key: string) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http
      .get<any>(url, { params: httpParams })
      .pipe(catchError(this.handleError<ApiResponse>()));
  }

  postAny<T>(url: string, params = {}): Observable<T> {
    return this.http.post<any>(url, params, httpOptions).pipe(catchError(this.handleError()));
  }

  deleteAny(url: string): Observable<any> {
    return this.http.delete(url, httpOptions).pipe(catchError(this.handleError()));
  }

  post<T>(url: string, params = {}, hasBlobRes?): Observable<T> {
    let postHttpOptions = httpOptions as {};
    // tslint:disable-next-line: no-string-literal
    if (params && params['reportProgress'] !== undefined) {
      // tslint:disable-next-line: no-string-literal
      postHttpOptions = httpOptions['reportProgress'] = params['reportProgress'];
    }
    if (hasBlobRes) {
      // tslint:disable-next-line: no-string-literal
      postHttpOptions['responseType'] = 'blob' as 'json';
    }

    return this.http.post<any>(url, params, postHttpOptions).pipe(catchError(this.handleError()));
  }

  put<T>(url: string, params = {}): Observable<T> {
    return this.http.put<any>(url, params, httpOptions).pipe(catchError(this.handleError()));
  }

  delete<T>(url: string, params = {}): Observable<T> {
    return this.http.put<any>(url, httpOptions).pipe(catchError(this.handleError()));
  }

  protected baseUrl(): string {
    throw new Error('This method needs to be implemented.');
  }

  protected makeUrl(suffix = ''): string {
    return `${this.baseUrl()}/${suffix}`;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<ApiResponse> {
    return (error: any): Observable<ApiResponse> => {
      // TODO: send the error to remote logging infrastructure
      // tslint:disable-next-line: no-console
      if (error.status === 0) {
        // alert('Lost internet connection! Please refresh the page.');
      } else if (error.status === 502) {
        // alert('Cant connect to the server!');
      }
      // Let the app keep running by returning an empty result.
      return throwError(error);
    };
  }
}
