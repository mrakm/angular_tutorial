import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { TranslationService } from '../services/translation.service';
@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss']
})
export class TranslationComponent {
  LANG_MAP = {
    'es-MX': 'es'
  };

  constructor(private readonly translate: TranslateService, private readonly translationService: TranslationService) { }

  update(langCode: string): void {
    this.translate.use(langCode);
    // this.translationService
    //   .changeLanguage(this.LANG_MAP[langCode])
    //   .pipe(take(1))
    //   .subscribe(() => location.reload());
  }
}
