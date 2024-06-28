import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WorkbenchService {

  accessToken: any;
  constructor(private http: HttpClient) { }

  postGreSqlConnection(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/database_connection/`+this.accessToken,obj);
  }
  // getTableData(obj:any){
  //   const currentUser = localStorage.getItem( 'currentUser' );
  //   console.log(JSON.parse( currentUser!))
  //   this.accessToken = JSON.parse( currentUser! )['Token'];
  //   return this.http.post<any>(`${environment.apiUrl}/get_details/`,obj);
  // }

  tableRelation(obj:any){
    return this.http.post<any>(`${environment.apiUrl}/get_table_relationship/`+this.accessToken,obj);
  }
  getTableData(obj:any){
    return this.http.put<any>(`${environment.apiUrl}/get_table_relationship/`+this.accessToken,obj)
  }
  getdatabaseConnectionsList(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/connection_list/`+this.accessToken,obj)
  }
  getTablesFromConnectedDb(id:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/tables_list/`+this.accessToken+'/'+id)
  }
  getSchemaTablesFromConnectedDb(id:any,obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/server_tables/`+this.accessToken+'/'+id,obj)
  }
  getColumnsData(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/columnextracting/`+this.accessToken,obj);
  }
  executeQuery(obj:any){
    return this.http.post<any>(`${environment.apiUrl}/custom_query/`+this.accessToken,obj);
  }

  joiningTables(obj:any){
    return this.http.post<any>(`${environment.apiUrl}/tables_joining/`+this.accessToken,obj);

  }
  getTableJoiningData(obj:any){
    return this.http.post<any>(`${environment.apiUrl}/query_data/`+this.accessToken,obj);
  }
  getDataExtraction(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/multi_col_dk/`+this.accessToken,obj);
  }
  getChartsEnableDisable(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/show_me/`+this.accessToken,obj);
  }
  deleteDbConnection(id:any){
    return this.http.delete<any>(`${environment.apiUrl}/database_disconnect/`+this.accessToken+'/'+id);
  }
  sheetSave(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/sheetsave/`+this.accessToken,obj);
  }
  sheetUpdate(obj:any,id:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/sheetupdate/`+id+this.accessToken,obj);
  }
  sheetGet(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/sheetretrieve/`+this.accessToken,obj);
  }
  getSheetData(){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.get<any>(`${environment.apiUrl}/sheetslist/`+this.accessToken);
  }
  filterPost(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/chart_filter/`+this.accessToken,obj);
  }
  filterPut(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.put<any>(`${environment.apiUrl}/chart_filter/`+this.accessToken,obj)
  }
  filterEditPost(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.post<any>(`${environment.apiUrl}/get_datasource/`+this.accessToken,obj);
  }
  filterDelete(obj:any){
    const currentUser = localStorage.getItem( 'currentUser' );
    this.accessToken = JSON.parse( currentUser! )['Token'];
    return this.http.delete<any>(`${environment.apiUrl}/chart_filter/`+this.accessToken,obj);
  }
}
