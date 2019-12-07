import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  comptesUrl: any;
}
export interface Compte {
  id: number;
  rib: string;
  solde: number;
}

@Injectable({
  providedIn: "root"
})
export class ClientService {
  clients: Client[] = [];
  clientsSubject = new Subject<Client[]>();
  comptesClient: Compte[] = [];
  idClient: number;
  editMode = new EventEmitter<boolean>();
  boolEditMode = false;
  constructor(private http: HttpClient) {}
  getClients() {
    this.http
      .get(`${environment.API_URL}clients`)
      .pipe(
        map((data: any) => {
          const clients: Client[] = [];
          const responseClients = data._embedded.clients;
          responseClients.forEach(element => {
            const client: Client = {
              id: element.id,
              firstName: element.firstName,
              lastName: element.lastName,
              address: element.address,
              comptesUrl: element._links.comptes
            };
            clients.push(client);
          });
          return clients;
        })
      )
      .subscribe((clients: Client[]) => {
        /* set clients */
        this.clients = clients;
        this.clientsSubject.next([...this.clients]);
      });
  }
  updateClient(client: Client) {
    for (const index in this.clients) {
      if (this.clients[index].id === client.id) {
        this.clients[index].firstName = client.firstName;
        this.clients[index].lastName = client.lastName;
        this.clients[index].address = client.address;
      }
    }
    this.http.post<Client>(`${environment.API_URL}clients`, client).subscribe();
  }
  deleteClient() {
    this.clients = this.clients.filter(client => {
      return client.id !== this.idClient;
    });
    this.clientsSubject.next([...this.clients]);
    this.http
      .delete(`${environment.API_URL}clients/${this.idClient}`)
      .subscribe();
  }
  addClient(client: Client) {
    this.clients.push(client);
    this.clientsSubject.next([...this.clients]);
    /* send http post */
    this.http.post<Client>(`${environment.API_URL}clients`, client).subscribe();
  }
  getClientById(): Client {
    const client = this.clients.find(item => {
      return item.id === this.idClient;
    });
    return { ...client };
  }
  setAccoutsForClient() {
    const URL = this.getClientById().comptesUrl.href;
    console.log(URL);
    this.http
      .get(URL)
      .pipe(
        map((data: any) => {
          const comptes: Compte[] = [];
          const comptesResponse = data._embedded.comptes;
          comptesResponse.forEach(item => {
            const compte: Compte = {
              id: item.id,
              rib: item.rib,
              solde: item.solde
            };
            comptes.push(compte);
          });
          return comptes;
        })
      )
      .subscribe((comptes: Compte[]) => {
        this.comptesClient = comptes;
        console.log(this.comptesClient);
      });
  }
}
