import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BrowserVersionService {
  isInternetExplorer: boolean;

  constructor() {
    this.setIsInternetExplorer();
  }

  setIsInternetExplorer(): void {
    this.isInternetExplorer = this.getIsInternetExplorer();
  }

  getIsInternetExplorer(): boolean {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');

    return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
  }
}
