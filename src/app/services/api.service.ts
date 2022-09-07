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
  readonly MethodUrlAttach = environment.uniattach_url;
  readonly AuthUrl = environment.auth_url;
  constructor(private http: HttpClient) { }


  UniCall(body: any): Observable<any> {
    console.log(JSON.stringify(body));
    return this.http.post(
      `${this.ApiURL}${this.MethodUrl}`,
      JSON.stringify(body), httpOptions
    );
  }

  UniAttachmentlist(data: any, isResponseBlob: boolean = false): Observable<any> {
    var httpOptions = {};
    if (isResponseBlob) {
      httpOptions = { observe: 'response', responseType: "blob" };
    }
    console.log(this.ApiURL);
    return this.http.post(
      `${this.ApiURL}${this.MethodUrlAttach}`,
      data, httpOptions
    );
  }


  RegisterCall(data: any) {
    return this.http.post(this.ApiURL + this.AuthUrl + "register", data);
  }

  LoginCall(data: any) {
    return this.http.post(this.ApiURL + this.AuthUrl + "login", data, { responseType: "text" });
  }

}
