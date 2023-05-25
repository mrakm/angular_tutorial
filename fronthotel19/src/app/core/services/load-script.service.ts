import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadScriptService {
  async loadJSLibrary(urls: Array<string>): Promise<Array<HTMLScriptElement>> {
    const promises = urls.map(
      // tslint:disable-next-line: promise-function-async
      (url: string) =>
        new Promise(resolve => {
          const scriptElement: HTMLScriptElement = document.createElement('script');
          scriptElement.addEventListener('load', r => {
            resolve(scriptElement);
          });
          scriptElement.src = url;
          document.head.appendChild(scriptElement);
        })
    );

    return new Promise(resolve => {
      Promise.all(promises).then((scriptElements: Array<HTMLScriptElement>) => {
        resolve(scriptElements);
      });
    });
  }

  destroyScripts(scriptElements: Array<HTMLScriptElement>): void {
    scriptElements.forEach((scriptElement: HTMLScriptElement) => {
      document.head.removeChild(scriptElement);
    });
  }
}
