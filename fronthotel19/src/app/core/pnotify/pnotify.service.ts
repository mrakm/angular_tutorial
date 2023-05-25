// https://github.com/sciactive/pnotify
import { Injectable } from '@angular/core';
declare var PNotifyButtons: any;
declare var PNotify: any;

@Injectable()
export class PNotifyService {
  constructor() {
    // https://github.com/sciactive/pnotify#buttons-module
    // In v4, it's no longer possible to show closer/sticker buttons when the notice is nonblocking.
    // PNotifyButtons; // Initiate the module. Important!
    // https://github.com/sciactive/pnotify#nonblock-module
    PNotify.defaults.addClass = 'nonblock';

    PNotify.defaults.delay = 4000;
  }

  get() {
    return PNotify;
  }
}
