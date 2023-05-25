import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GenericService } from 'src/app/shared/helper/generic.service';

@Component({
  selector: 'image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit, OnChanges {

  @Input() id: number;
  @Input() parent: string;
  @Input() width: number;
  @Input() height: number;

  url;

  constructor(private readonly genericService: GenericService, private readonly sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // this.getImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getImage();
  }

  private getImage(): void {

    if (this.id && this.parent) {
      this.genericService.__post('settings/attachments/getFileByParent', { id: this.id, parent: this.parent }, true).subscribe(res => {
        if (res.size) {
          const nonSanitizedUrl = URL.createObjectURL(res);
          this.url = this.sanitizer.bypassSecurityTrustUrl(nonSanitizedUrl);
        }
      });
    }
  }
}
