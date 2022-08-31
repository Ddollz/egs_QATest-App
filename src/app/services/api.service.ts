import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly ApiURL = environment.api_url;
  readonly MethodUrl = environment.unicall_url;
  readonly AuthUrl = environment.auth_url;

  constructor(private http: HttpClient) { }


  UniCall(body: any): Observable<any> {
    console.log(JSON.stringify(body));
    return this.http.post(
      `${this.ApiURL}${this.MethodUrl}`,
      JSON.stringify(body), httpOptions
    );
  }

  RegisterCall(data: any) {
    return this.http.post(this.ApiURL + this.AuthUrl + "register", data);
  }

  LoginCall(data: any) {
    return this.http.post(this.ApiURL + this.AuthUrl + "login", data, { responseType: "text" });
  }

  // getAccountList():Observable<any[]>{
  //   return this.http.get<any>(this.ApiURL+"/Auth/");
  // }

  // getAccount(id:number|string){
  //   return this.http.get<any>(this.ApiURL+`/EgsAccounts/${id}`);
  // }

  // addAccount(data:any){
  //   return this.http.post(this.ApiURL+'/EgsAccounts',data)
  // }

  // updateAccount(id:number|string, data:any){
  //   return this.http.post(this.ApiURL+`/EgsAccounts/${id}`,data);
  // }

  // deleteAccount(id:number|string){
  //   return this.http.delete(this.ApiURL+`/EgsAccounts/${id}`);
  // }
}
