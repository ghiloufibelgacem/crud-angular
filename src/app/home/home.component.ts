import { Component, OnInit, ViewChild } from "@angular/core";

import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { AlertDialogComponent } from "../alert-dialog/alert-dialog.component";
import { ClientService, Client } from "../client.service";
import { AddClientComponent } from "../add-client/add-client.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = [
    "FirstName",
    "LastName",
    "Address",
    "edit",
    "delete",
    "accounts"
  ];
  dataSource: MatTableDataSource<Client>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /* list of clients */
  clients: Client[] = [];
  editMode = false;

  constructor(public dialog: MatDialog, private clientService: ClientService) {
    this.clientService.clientsSubject.subscribe((clients: Client[]) => {
      this.clients = clients;
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(this.clients);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.clientService.getClients();
    this.clientService.editMode.subscribe(bool => {
      this.editMode = bool;
      this.clientService.boolEditMode = this.editMode;
    });
  }

  ngOnInit() {}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  clientToDelete(id: number) {
    this.clientService.idClient = id;
    this.openDialog();
  }
  clientToUpdate(id: number) {
    this.clientService.idClient = id;
    console.log(id);
    this.clientService.editMode.emit(false);
    this.openAddClientDialog();
  }

  /* open alert dialog */
  openDialog(): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: "250px"
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("The dialog was closed");
    });
  }
  /* add client dialog */
  openAddClientDialog(): void {
    const dialogRef = this.dialog.open(AddClientComponent, {
      width: "300px"
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("The dialog was closed");
    });
  }

  onAddClient() {
    this.clientService.editMode.emit(true);
    this.openAddClientDialog();
  }
  showAccounts(id: number) {
    this.clientService.idClient = id;
    this.clientService.setAccoutsForClient();
  }
}
