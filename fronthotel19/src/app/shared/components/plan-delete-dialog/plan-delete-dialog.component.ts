import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PNotifyService } from 'src/app/core';
import { GenericService } from '../../helper/generic.service';

@Component({
  selector: 'app-plan-delete-dialog',
  templateUrl: './plan-delete-dialog.component.html',
  styleUrls: ['./plan-delete-dialog.component.scss']
})

export class PlanDeleteDialogComponent implements OnInit {
  title: string;
  message: string;
  displayedColumns = ['applicationFormNumber', 'options'];
  dataSource: any;
  appData: any[] = [];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  pNotify;

  constructor(public dialogRef: MatDialogRef<PlanDeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData, private readonly genericService: GenericService, pNotifyService: PNotifyService) {
    this.pNotify = pNotifyService.get();

    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.appData = data.plan;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.appData);
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

  sortData(): void {
    this.dataSource.sort = this.sort;
  }

  delete(id): void {
    this.genericService.__put(`/lease/application-form/plan/update/${id}`, {}).subscribe(
      () => {
        this.pNotify.success({
          title: 'Success!',
          text: 'Admission Type has been deleted.'
        });

        let deleteIndex = this.appData.findIndex(app => app.id = id);
        this.appData.splice(deleteIndex, 1);
        this.dataSource = new MatTableDataSource<any>(this.appData);
      },
      error => {
        this.pNotify.error({
          title: 'Oops!',
          text: error.error.message
        });
      }
    );
  }
}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ConfirmDialogData {
  constructor(public title: string, public message: string, public plan?: any) { }
}
