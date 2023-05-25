import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PNotifyService } from 'src/app/core';
import { GenericService } from 'src/app/shared/helper/generic.service';

@Component({
  selector: 'app-product-items-form',
  templateUrl: './product-items-form.component.html',
  styleUrls: ['./product-items-form.component.css']
})
export class ProductItemsFormComponent implements OnInit {
  pnotify;
  fg: FormGroup;
  actionBtn = 'Save';
  id: string;

  constructor(
    private fb: FormBuilder,
    private readonly route: ActivatedRoute,
    pNotifyService: PNotifyService,
    private dialogRef: MatDialogRef<ProductItemsFormComponent>,
    private readonly genericService: GenericService,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {
    this.pnotify = pNotifyService.get();
  }

  ngOnInit(): void {
    this.fg = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      price: new FormControl(null),
      description: new FormControl(null, [Validators.required]),

    });


    if (this.editData) {
      this.fg.patchValue(this.editData);
      this.actionBtn = 'Update';
      this.id = this.editData.id;
    } else {
      this.actionBtn = 'Save';
    }
  }

  saveProductItem(): void {
    if (!this.editData) {
      if (this.fg.valid) {
        this.genericService.__post('/configurations/product/create', this.fg.value).subscribe(
          () => {
            this.pnotify.success({
              title: 'Success!',
              text: "Product has been created."
            });
            this.dialogRef.close();
          },
          error => {
            this.pnotify.error({
              title: 'Oops!',
              text: error.error.message
            });
          }
        );
      } else {
        this.fg.markAllAsTouched();
      }
    } else {
      this.actionBtn = 'Update';
      if (this.fg.valid) {
        this.genericService.__put(`/configurations/product/update/${this.id}`, this.fg.value).subscribe(
          () => {
            this.pnotify.success({
              title: 'Success!',
              text: 'Product has been updated.'
            });

            this.dialogRef.close();
          },
          error => {
            this.pnotify.error({
              title: 'Oops!',
              text: error.error.message
            });
          }
        );
      } else {
        this.fg.markAllAsTouched();
      }
    }
  }
}
