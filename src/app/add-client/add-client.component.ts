import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ClientService, Client } from "../client.service";

@Component({
  selector: "app-add-client",
  templateUrl: "./add-client.component.html",
  styleUrls: ["./add-client.component.css"]
})
export class AddClientComponent implements OnInit {
  editMode = false;
  client: Client = {
    id: null,
    firstName: "",
    lastName: "",
    address: "",
    comptesUrl: ""
  };
  constructor(
    public dialogRef: MatDialogRef<AddClientComponent>,
    public clientService: ClientService
  ) {
    this.editMode = this.clientService.boolEditMode;
    if (!this.editMode) {
      this.client = this.clientService.getClientById();
      // console.log(this.client);
      // console.log(this.editMode);
    }
  }

  ngOnInit() {}
  onCancel() {
    this.dialogRef.close();
  }
  onOk() {
    this.dialogRef.close();
    if (!this.editMode) {
      this.clientService.updateClient(this.client);
    } else {
      this.clientService.addClient(this.client);
    }
  }
}
