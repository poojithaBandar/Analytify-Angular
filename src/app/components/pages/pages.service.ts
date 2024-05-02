import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  accessToken: any;
  constructor(private http: HttpClient) { }

  postGreSqlConnection(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    console.log(JSON.parse( currentUser!))
    this.accessToken = JSON.parse( currentUser! )['Token'];
   
    return this.http.post<any>(`${environment.apiUrl}/db_check/`,obj);
  }



}
