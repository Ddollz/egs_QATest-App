import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly ApiURL = "https://localhost:7020/api";

  constructor(private http:HttpClient) { }

  getAccountList():Observable<any[]>{
    return this.http.get<any>(this.ApiURL+"/EgsAccounts");
  }

  getAccount(id:number|string){
    return this.http.get<any>(this.ApiURL+`/EgsAccounts/${id}`);
  }

  addAccount(data:any){
    return this.http.post(this.ApiURL+'/EgsAccounts',data)
  }

  updateAccount(id:number|string, data:any){
    return this.http.post(this.ApiURL+`/EgsAccounts/${id}`,data);
  }

  deleteAccount(id:number|string){
    return this.http.delete(this.ApiURL+`/EgsAccounts/${id}`);
  }
}
