import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs/operators';
import { GLOBALS } from 'src/app/config/globals';
import { AuthService, PNotifyService } from 'src/app/core';
import { staggerAnimation } from 'src/app/shared/animations';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { UsersService } from 'src/app/shared/services/user.service';
import { UsersModel } from '../../../models/users.model';

@Component({
  selector: 'app-user-list',
  styleUrls: ['./user-list.component.scss'],
  templateUrl: './user-list.component.html',
  animations: [staggerAnimation]
})
export class UserListComponent implements OnInit {
  displayedColumns = ['name', 'role', 'options'];
  data: Array<UsersModel> = [new UsersModel(this.authService)];
  dataSource: any;
  isLoading = false;
  pnotify;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    public dialog: MatDialog,
    public matDialog: MatDialog,
    pNotifyService: PNotifyService
  ) {
    this.pnotify = pNotifyService.get();
  }

  ngOnInit(): void {
    this.getRecords();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getRecords(): void {
    this.isLoading = true;
    this.usersService
      .findAll()
      .pipe(take(1))
      .subscribe(
        response => {
          this.data = response;
          this.dataSource = new MatTableDataSource<UsersModel>(this.data);
          setTimeout(() => (this.dataSource.paginator = this.paginator));
          setTimeout(() => (this.dataSource.sort = this.sort));
          this.isLoading = false;
          console.log(this.data)
        },
        error => {
          this.pnotify.error({
            title: 'Oops!',
            text: error.error.message
          });
          this.isLoading = false;
        }
      );

  }

  delete(id: string): void {
    this.matDialog
      .open(ConfirmDialogComponent, {
        width: GLOBALS.deleteDialog.width,
        data: { title: GLOBALS.deleteDialog.title, message: GLOBALS.deleteDialog.message }
      })
      .afterClosed()
      .subscribe((accept: boolean) => {
        if (accept) {
          this.isLoading = true;
          this.usersService.remove(id).subscribe(
            () => {
              this.pnotify.success({
                title: 'Success!',
                text: 'User has been deleted.'
              });
              this.getRecords();
            },
            error => {
              this.pnotify.error({
                title: 'Oops!',
                text: error.error.message
              });
              this.isLoading = false;
            }
          );
        }
      });
  }

  sortData(): void {
    this.dataSource.sort = this.sort;
  }
}
