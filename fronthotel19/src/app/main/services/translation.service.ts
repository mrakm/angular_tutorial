import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService extends BaseService {
  private static readonly BASE = '/api/user';

  constructor(http: HttpClient) {
    super(http);
  }

  changeLanguage(language: string): Observable<any> {
    return this.post(this.makeUrl('update_default_language'), { lang: language });
  }

  defaultLanguage(): Observable<string> {
    return this.get(this.makeUrl('default_language'));
  }

  protected baseUrl(): string {
    return TranslationService.BASE;
  }
}
