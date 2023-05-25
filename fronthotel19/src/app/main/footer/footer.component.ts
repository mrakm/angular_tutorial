import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PNotifyService } from '../../core';
import { CopyrightBottomSheetComponent } from './copyright-bottom-sheet.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  percentage: number = undefined;
  profileSaved: boolean;
  savingProfile: boolean;
  isAutoSave = false;
  isAutoSaving = false;
  isAutoSaveBuilder = false;
  isAutoSavingBuilder = false;
  autoSaveMessage: string;
  pnotify: any;

  constructor(
    private readonly bottomSheet: MatBottomSheet,
    pNotifyService: PNotifyService
  ) {
    this.pnotify = pNotifyService.get();
  }

  ngOnInit(): void {
  }

  openCopyrightBottomSheet(): void {
    this.bottomSheet.open(CopyrightBottomSheetComponent);
  }
}
