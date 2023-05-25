import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PNotifyService } from 'src/app/core';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { GenericService } from 'src/app/shared/helper/generic.service';
import { ProductItemsFormComponent } from '../form/product-items-form.component';

@Component({
  selector: 'app-product-items-list',
  templateUrl: './product-items-list.component.html',
  styleUrls: ['./product-items-list.component.css']
})
export class ProductItemsListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'price', 'description', 'options'];
  pnotify;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  constructor(private router: Router, private readonly genericService: GenericService, private dialog: MatDialog, pNotifyService: PNotifyService) {
    this.pnotify = pNotifyService.get();
  }

  ngOnInit(): void {
    this.getAllProduct();
  }

  openProductForm() {
    this.dialog
      .open(ProductItemsFormComponent, {
        width: '60%'
      })
      .afterClosed()
      .subscribe(result => {
        this.getAllProduct();
      });
  }

  getAllProduct() {
    this.genericService.__get('/configurations/product/findAll').subscribe(
      res => {
        this.dataSource = new MatTableDataSource<any>(res);

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.pnotify.error({
          title: 'Oops!',
          text: error.error.message
        });
      }
    );
  }


  onEdit(row: string) {
    // this.router.navigate([`a/configuration/floors/update/${row}`]);

    this.dialog
      .open(ProductItemsFormComponent, {
        width: '60%',
        data: row
      })
      .afterClosed()
      .subscribe(result => {
        this.getAllProduct();
      });
  }

  openDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.genericService.__delete(`/configurations/product/delete/${id}`).subscribe(
          res => {
            this.getAllProduct();
          },
          error => {
            this.pnotify.error({
              title: 'Oops!',
              text: error.error.message
            });
          }
        );
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
