import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/sharedmodule';
import { FormsModule } from '@angular/forms';
import { WorkbenchService } from '../workbench.service';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { forkJoin, of, switchMap } from 'rxjs';
// import { data } from '../../charts/echarts/echarts';
import Swal from 'sweetalert2';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule, DOCUMENT } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { InsightsButtonComponent } from '../insights-button/insights-button.component';
import { ViewTemplateDrivenService } from '../view-template-driven.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { InsightEchartComponent } from '../insight-echart/insight-echart.component';
import _ from 'lodash';

import { TemplateDashboardService } from '../../../services/template-dashboard.service';


@Component({
  selector: 'app-workbench',
  standalone: true,
  imports: [RouterModule,NgbModule,SharedModule,FormsModule,CdkDropListGroup, CdkDropList, CdkDrag,GalleryModule,LightboxModule,ToastrModule,CommonModule,NgxPaginationModule,InsightsButtonComponent,InsightEchartComponent],
  templateUrl: './workbench.component.html',
  styleUrl: './workbench.component.scss'
})
export class WorkbenchComponent implements OnInit{
  @ViewChild('fileInput') fileInput:any;
  @ViewChild('fileInput1') fileInput1:any;
  @ViewChild('sheetcontainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  
  tableList = [] as any;
  dragedTableName: any;
  databaseconnectionsList!:boolean;
  draggedtables = [] as any;
  getTableColumns = [] as any;
  getTableRows = [] as any;
  relationOfTables = [] as any;
  databaseId:any;
  fileId:any;
  databaseType:any;
  openPostgreSqlForm= false;
  openMySqlForm = false;
  openConnectWiseForm = false;
  openHaloPSAForm = false;
  openShopifyForm =false;
  openOracleForm = false;
  openMicrosoftSqlServerForm = false;
  openSnowflakeServerForm = false;
  openMongoDbForm = false;
  sqlLiteForm = false;
  openTablesUI = false;
  ibmDb2Form = false;
  databaseName:any;
  tableName:any;
  selectedClmnT1:any;
  selectedClmnT2:any;
  selectedCndn:any;
  tableRelationUi = false;
  custmT1Data = [] as any;
  custmT2Data = [] as any;
  connectionList =[] as any;
  searchDbName :any;
  viewNewDbs!:boolean;
  showPassword1 = false;
  toggleClass = "off-line";
  toggleClass1 = "off-line";
  gridView = true;

  itemsPerPage!:any;
  pageNo = 1;
  page: number = 1;
  totalItems:any;
  fileData:any;
  viewDatasourceList = false;
  isGoogleSheetsPage = false;
  selectedMicroSoftAuthType: string | null = null;
  selectedHirchyIdCrsDb:string | null = null;

  iscrossDbSelect = false;
  primaryHierachyId:any;
  canUploadExcel = false;
  canUploadCsv = false;
  schemaList: any[] = [];
  selectedSchema : string = 'public';
  querysetIdFromDataSource :any;

  isCustomSql = false;
  constructor(private modalService: NgbModal, private workbechService:WorkbenchService,private router:Router,private toasterservice:ToastrService,private route:ActivatedRoute,
    private viewTemplateService:ViewTemplateDrivenService,@Inject(DOCUMENT) private document: Document,private loaderService:LoaderService,private cd:ChangeDetectorRef,private templateDashboardService: TemplateDashboardService){ 
    localStorage.setItem('QuerySetId', '0');
    localStorage.setItem('customQuerySetId', '0');

    this.canUploadExcel = this.viewTemplateService.canUploadExcel();
    this.canUploadCsv = this.viewTemplateService.canUploadCsv();

    const currentUrl = this.router.url; 
    if (currentUrl.startsWith('/analytify/datasources/')) {
      if (currentUrl.includes('view-connections')) {
        this.databaseconnectionsList = true;
        this.viewNewDbs = false;
        this.isGoogleSheetsPage = false;
        // this.iscrossDbSelect = false;
      } else if (currentUrl.includes('new-connections')) {
        this.viewNewDbs = true;
        this.databaseconnectionsList = false;
        this.isGoogleSheetsPage = false;
        // this.iscrossDbSelect = false;
      } else if (currentUrl.includes('google-sheets')) {
        this.viewNewDbs = false;
        this.databaseconnectionsList = false;
        this.isGoogleSheetsPage = true;
        this.iscrossDbSelect = false;
        console.log(currentUrl);
        this.getGoogleSheetDetailsByUrl(currentUrl);
      }else if(currentUrl.includes('crossdatabase/')){
        if (currentUrl.includes('crossdatabase/customsql')) {
          this.isCustomSql = true;
          this.iscrossDbSelect = true;
          this.viewNewDbs = currentUrl.includes('newconnection');
          this.databaseconnectionsList = !this.viewNewDbs;
          this.isGoogleSheetsPage = false;
        } else if (currentUrl.includes('crossdatabase')) {
          this.isCustomSql = false;
          this.iscrossDbSelect = true;
          this.viewNewDbs = currentUrl.includes('newconnection');
          this.databaseconnectionsList = !this.viewNewDbs;
          this.isGoogleSheetsPage = false;
        }
        
        if (route.snapshot.paramMap.has('id1')) {
          this.primaryHierachyId = +atob(route.snapshot.params['id1']);
        }
        if (route.snapshot.paramMap.has('id2')) {
          this.querysetIdFromDataSource = +atob(route.snapshot.params['id2']);
        }
        
      //   if (route.snapshot.paramMap.has('id1') && route.snapshot.paramMap.has('id2')) {
      //     this.querysetIdFromDataSource = +atob(route.snapshot.params['id2']);
      //     this.primaryHierachyId = +atob(route.snapshot.params['id1']);
      //   }else if(route.snapshot.paramMap.has('id1')){
      //     this.primaryHierachyId = +atob(route.snapshot.params['id1']);
      //   }
      //   this.iscrossDbSelect = true;
      //   this.databaseconnectionsList = true;
      //   this.viewNewDbs = false;
      //   this.isGoogleSheetsPage = false;
      // }else if(currentUrl.includes('crossdatabase/newconnection')){
      //   if(route.snapshot.paramMap.has('id1') && route.snapshot.paramMap.has('id2')){
      //     this.querysetIdFromDataSource = +atob(route.snapshot.params['id2']);
      //     this.primaryHierachyId = +atob(route.snapshot.params['id1']);
      //   }else if(route.snapshot.paramMap.has('id1')){
      //     this.primaryHierachyId = +atob(route.snapshot.params['id1']);
      //   }
      //   this.iscrossDbSelect = true;
      //   this.viewNewDbs = true;
      //   this.databaseconnectionsList = false;
      //   this.isGoogleSheetsPage = false;
      // }
      // else if(currentUrl.includes('crossdatabase/customsql/viewconnection')){
      //   if (route.snapshot.paramMap.has('id1') && route.snapshot.paramMap.has('id2')) {
      //     this.querysetIdFromDataSource = +atob(route.snapshot.params['id2']);
      //     this.primaryHierachyId = +atob(route.snapshot.params['id1']);
      //   }else if(route.snapshot.paramMap.has('id1')){
      //     this.primaryHierachyId = +atob(route.snapshot.params['id1']);
      //   }
      //   this.iscrossDbSelect = true;
      //   this.databaseconnectionsList = true;
      //   this.viewNewDbs = false;
      //   this.isGoogleSheetsPage = false;
      // }else if(currentUrl.includes('crossdatabase/customsql/newconnection')){
      //   if(route.snapshot.paramMap.has('id1') && route.snapshot.paramMap.has('id2')){
      //     this.querysetIdFromDataSource = +atob(route.snapshot.params['id2']);
      //     this.primaryHierachyId = +atob(route.snapshot.params['id1']);
      //   }else if(route.snapshot.paramMap.has('id1')){
      //     this.primaryHierachyId = +atob(route.snapshot.params['id1']);
      //   }
      //   this.iscrossDbSelect = true;
      //   this.viewNewDbs = true;
      //   this.databaseconnectionsList = false;
      //   this.isGoogleSheetsPage = false;
      }
    }
    this.viewDatasourceList = this.viewTemplateService.viewDtabase();
  }
  routeNewDatabase(){
    if (this.iscrossDbSelect) {
      const encodedId = btoa(this.primaryHierachyId.toString());
      const encodedQuerySetId = this.querysetIdFromDataSource ? '/' + btoa(this.querysetIdFromDataSource.toString()) : '';
  
      const basePath = this.isCustomSql 
        ? 'analytify/datasources/crossdatabase/customsql/newconnection/' 
        : 'analytify/datasources/crossdatabase/newconnection/';
  
      this.router.navigate([basePath + encodedId + encodedQuerySetId]);
    } else {
      this.router.navigate(['analytify/datasources/new-connections']);
    }
  
  }
  routeViewDatabase(){
    if(this.iscrossDbSelect){
      // const encodedId = btoa(this.primaryHierachyId.toString());
      // this.router.navigate(['analytify/datasources/crossdatabase/viewconnection/'+encodedId])
      const encodedId = btoa(this.primaryHierachyId.toString());
      const encodedQuerySetId = this.querysetIdFromDataSource ? '/' + btoa(this.querysetIdFromDataSource.toString()) : '';
  
      const basePath = this.isCustomSql 
        ? 'analytify/datasources/crossdatabase/customsql/viewconnection/' 
        : 'analytify/datasources/crossdatabase/viewconnection/';
  
      this.router.navigate([basePath + encodedId + encodedQuerySetId]);
    }else{
      this.router.navigate(['analytify/datasources/view-connections'])
    }
  }

    postGreServerName = '';
    postGrePortName = '';
    postGreDatabaseName = '';
    postGreUserName = '';
    PostGrePassword = '';
    OracleServiceName = '';
    displayName ='';
    companyId = '';
    siteURL = '';
    siteURLPSA = '';
    clientSecret = '';
    clientIdPSA = '';
    publicKey = '';
    privateKey = '';
    path='';
    shopifyToken = '';
    shopifyName = '';
  emptyVariables(){
    this.postGrePortName = '';
    this.postGreDatabaseName = '';
    this.postGreServerName = '';
    this.schemaList = [];
    this.selectedSchema = 'public';
    this.postGreUserName = '';
    this.PostGrePassword = '';
    this.OracleServiceName = '';
    this.displayName ='';
    this.path='';
    this.privateKey = '';
    this.publicKey = '';
    this.siteURL = '';
    this.companyId = '';
    this.siteURLPSA = '';
    this.clientIdPSA = '';
    this.clientSecret = '';
    
  } 
  googleSheetsData = [] as any;
  gsheetsParentId:any;
  gsheetprofile:any;
  getGoogleSheetDetailsByUrl(url:any){
  const obj = {
    code: url
  }
  this.workbechService.getGoogleSheetsDetails(obj)
    .subscribe(
      {
        next: (data: any) => {
          console.log(data);
          this.googleSheetsData = data.sheets;
          this.gsheetsParentId = data.parent_id;
          this.gsheetprofile = data.profile
        },
        error: (error: any) => {
          console.log(error);
          if(error.error.message === 'Invalid grant, please re-authorize'){
            Swal.fire({
              title: 'oops! connection lost to Google Sheets',
              text:'Click OK to redirect Google Authentication',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result)=>{
              if(result.isConfirmed){
                this.document.location.href = error.error.redirect_url;
              }
              else{
                this.router.navigate(['analytify/datasources/new-connections'])
              }
            }) 

          }
        }
      }
    )
  }
  getHierachyIdFromGsheets(id:any){
    this.workbechService.getHierachyIdFromGsheets(this.gsheetsParentId,id)
      .subscribe(
        {
          next: (data: any) => {
            console.log(data);
            if(data.hierarchy_id){
              const GsheetsHierarchyId = btoa(data.hierarchy_id.toString());
              this.router.navigate(['/analytify/database-connection/tables/googlesheets/'+GsheetsHierarchyId]);
            }
          },
          error: (error: any) => {
            console.log(error);
            if(error){
              Swal.fire({
                icon: 'error',
                title: 'oops!',
                text: error.error.message,
                width: '400px',
              })
            }
          }
        }
      )
  }
    openPostgreSql(){
    this.openPostgreSqlForm=true;
    this.databaseconnectionsList= false;
    this.viewNewDbs = false;
      this.emptyVariables();
    }
    postgreSignIn(){
      const obj={
          "database_type":"postgresql",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "database": this.postGreDatabaseName,
          "display_name":this.displayName,
          "schema": this.selectedSchema
      }
      this.confirmPopupForDataTransformation().then((isSkip) => {
        if (isSkip === true) {
          this.workbechService.postGreSqlConnection(obj).subscribe({
            next: (responce) => {
              console.log(responce);
              console.log('tablelist', this.tableList)
              if (responce) {
                this.databaseName = responce.database.display_name
                this.databaseId = responce.database?.hierarchy_id
                this.toasterservice.success('Connected', 'success', { positionClass: 'toast-top-right' });
                this.openPostgreSqlForm = false;
                const encodedId = btoa(this.databaseId.toString());
                if (this.iscrossDbSelect) {
                  this.selectedHirchyIdCrsDb = this.databaseId
                  this.connectCrossDbs();
                } else {
                  this.router.navigate(['/analytify/database-connection/tables/' + encodedId]);
                }
              }
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' })
            }
          }
          )
        } else if(isSkip === false) {
          this.checkDataSourceConnection(obj);
        }
      });
    }

    connectWiseUpdate(){
      const obj = {
        "company_id":this.companyId,
        "site_url": this.siteURL,
        "public_key":this.publicKey,
        "private_key": this.privateKey,
        "display_name": this.displayName,
        "hierarchy_id":this.databaseId
    }

      this.workbechService.connectWiseConnectionUpdate(obj).subscribe({next: (responce) => {
            console.log(responce);
            this.modalService.dismissAll('close');
            if(responce){
              this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
            }
            this.getDbConnectionList();
          },
          error: (error) => {
            console.log(error);
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          }
        }
      )

    }
    
    haloPSAUpdate(){
      const obj = {
        "site_url": this.siteURLPSA,
        "client_id": this.clientIdPSA,
        "client_secret": this.clientSecret,
        "display_name": this.displayName,
        "hierarchy_id":this.databaseId
      }

      this.workbechService.haloPSAConnectionUpdate(obj).subscribe({next: (responce) => {
            console.log(responce);
            this.modalService.dismissAll('close');
            if(responce){
              this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
            }
            this.getDbConnectionList();
          },
          error: (error) => {
            console.log(error);
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          }
        }
      )

    }
    shopifyConnectionUpdate(){
      const obj = {
        "api_token": this.shopifyToken,
        "shop_name": this.shopifyName,
        "display_name": this.displayName,
        "hierarchy_id":this.databaseId
      }

      this.workbechService.shopifyConnectionUpdate(obj).subscribe({next: (responce) => {
            console.log(responce);
            this.modalService.dismissAll('close');
            if(responce){
              this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
            }
            this.getDbConnectionList();
          },
          error: (error) => {
            console.log(error);
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          }
        }
      )

    }
    DatabaseUpdate(){
      const obj={
          // "database_type":"postgresql",
          "database_type":this.databaseType,
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "database": this.postGreDatabaseName,
          "display_name":this.displayName,
          "database_id":this.databaseId,
          "schema": this.selectedSchema
      }as any
      if(this.databaseType === 'oracle'){
        delete obj.database
        obj.service_name=this.postGreDatabaseName;
      }
        this.workbechService.postGreSqlConnectionput(obj).subscribe({next: (responce) => {
              console.log(responce);
              this.modalService.dismissAll('close');
              this.schemaList = [];
              this.selectedSchema = 'public';
              if(responce){
                this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
              }
              this.getDbConnectionList();
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            }
          }
        )

    }
    openOracle(){
      this.openOracleForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }


    OracleSignIn(){
      const obj={
          "database_type":"oracle",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "service_name":this.postGreDatabaseName

      }
      this.confirmPopupForDataTransformation().then((isSkip) => {
        if (isSkip === true) {
          this.workbechService.postGreSqlConnection(obj).subscribe({
            next: (responce) => {
              console.log(responce);
              console.log('tablelist', this.tableList)
              if (responce) {
                this.databaseName = responce.database.database_name
                this.databaseId = responce.database?.hierarchy_id
                this.toasterservice.success('Connected', 'success', { positionClass: 'toast-top-right' });
                this.modalService.dismissAll();
                this.openOracleForm = false;
                const encodedId = btoa(this.databaseId.toString());
                if (this.iscrossDbSelect) {
                  this.selectedHirchyIdCrsDb = this.databaseId
                  this.connectCrossDbs();
                } else {
                  this.router.navigate(['/analytify/database-connection/tables/' + encodedId]);
                }
              }
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' })
            }
          }
          )
        } else if(isSkip === false) {
          this.checkDataSourceConnection(obj);
        }
      });
    }
    openMySql(){
      this.openMySqlForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    connectWise(){
      this.openConnectWiseForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }

    connectHaloPSA(){
      this.openHaloPSAForm = true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    connectShopify(){
      this.openShopifyForm = true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
    }
    companyIdError(){
      if(this.companyId){
        this.companyIDError = false;
      }else{
        this.companyIDError = true;
      }
    }

    siteUrlError(){
      if(this.siteURL){
        this.siteURLError = false;
      }else{
        this.siteURLError = true;
      }
    }
    siteUrlPSAError(){
      if(this.siteURLPSA){
        this.siteURLErrorPSA = false;
      }else{
        this.siteURLErrorPSA = true;
      }
    }
    clientSecretsError(){
      if(this.clientSecret){
        this.clientSecretError = false;
      }else{
        this.clientSecretError = true;
      }
    }
    clientIdErrorPSA(){
      if(this.clientIdPSA){
        this.clientIDPSAError = false;
      }else{
        this.clientIDPSAError = true;
      }
    }
    privateConnectWiseError(){
      if(this.privateKey){
        this.privateKeyError = false;
      }else{
        this.privateKeyError = true;
      }
    }
    publicConnectWiseError(){
      if(this.publicKey){
        this.publicKeyError = false;
      }else{
        this.publicKeyError = true;
      }
    }

    shopifyapiTokenError(){
      if(this.shopifyToken){
        this.shopifyApiTokenError = false;
      }else{
        this.shopifyApiTokenError = true;
      }
    }
    shopfyNameError(){
      if(this.shopifyName){
        this.shopifyNameError = false;
      }else{
        this.shopifyNameError = true;
      }
    }
    shopifySignIn(){
      const obj={
        "api_token":this.shopifyToken,
        "shop_name": this.shopifyName,
        "display_name": this.displayName
    }
      this.workbechService.shopifyConnection(obj).subscribe({next: (data) => {
        console.log(data)
            if(data){
              this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
              this.databaseId=data?.hierarchy_id;
              this.modalService.dismissAll();
              this.openShopifyForm = false;
              const encodedId = btoa(this.databaseId.toString());
              // this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              if(this.iscrossDbSelect){
                this.selectedHirchyIdCrsDb = this.databaseId
                this.connectCrossDbs();
              }else{
              this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            }
          },
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            console.log(error);
          }
        }
      )
    }
    connectWiseSignIn(){
      const obj={
        "company_id":this.companyId,
        "site_url": this.siteURL,
        "public_key":this.publicKey,
        "private_key": this.privateKey,
        "display_name": this.displayName
    }
      this.workbechService.connectWiseConnection(obj).subscribe({next: (responce) => {
        console.log(responce)
            if(responce){
              this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
              this.databaseId=responce?.hierarchy_id;
              this.modalService.dismissAll();
              this.openConnectWiseForm = false;
              const encodedId = btoa(this.databaseId.toString());
              // this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              if(this.iscrossDbSelect){
                this.selectedHirchyIdCrsDb = this.databaseId
                this.connectCrossDbs();
              }else{
              // this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              Swal.fire({
                position: "center",
                icon: "question",
                title: "Would you like to view template dashboards based on your connected data?",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Skip',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.templateDashboardService.buildSampleConnectWiseDashboard(this.container , this.databaseId);
                } else {
                  this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
                }
              });
              }
            }
          },
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            console.log(error);
          }
        }
      )
    }

    haloPSASignIn(){
      const obj = {
        "site_url": this.siteURLPSA,
        "client_id": this.clientIdPSA,
        "client_secret": this.clientSecret,
        "display_name": this.displayName
      }
      this.workbechService.haloPSAConnection(obj).subscribe({next: (responce) => {
        console.log(responce)
            if(responce){
              this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
              this.databaseId=responce?.hierarchy_id;
              this.modalService.dismissAll();
              this.openHaloPSAForm = false;
              const encodedId = btoa(this.databaseId.toString());
              // this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              if(this.iscrossDbSelect){
                this.selectedHirchyIdCrsDb = this.databaseId
                this.connectCrossDbs();
              }else{
              // this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              Swal.fire({
                position: "center",
                icon: "question",
                title: "Would you like to view template dashboards based on your connected data?",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Skip',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.templateDashboardService.buildSampleHALOPSADashboard(this.container, this.databaseId);
                } else {
                  this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
                }
              });
              }
            }
          },
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            console.log(error);
          }
        }
      )
    }

    mySqlSignIn(){
      const obj={
          "database_type":"mysql",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "database": this.postGreDatabaseName,

      }
      this.confirmPopupForDataTransformation().then((isSkip) => {
        if (isSkip === true) {
          this.workbechService.DbConnection(obj).subscribe({next: (responce) => {
           console.log(responce)
               if(responce){
                 this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                 this.databaseId=responce.database?.hierarchy_id
                 this.modalService.dismissAll();
                 this.openMySqlForm = false;
                 const encodedId = btoa(this.databaseId.toString());
                 if(this.iscrossDbSelect){
                   this.selectedHirchyIdCrsDb = this.databaseId
                   this.connectCrossDbs();
                 }else{
                   this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
                 }
               }
             },
             error: (error) => {
               this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
               console.log(error);
             }
           }
         )
       } else if(isSkip === false) {
         this.checkDataSourceConnection(obj);
       }
      });
    }
    openMicrosoftSqlServer(){
      this.openMicrosoftSqlServerForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    microsoftSqlSignIn(){
      const obj={
          "database_type":"microsoftsqlserver",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "database": this.postGreDatabaseName,
          "authentication_type":this.selectedMicroSoftAuthType
      }
      this.confirmPopupForDataTransformation().then((isSkip) => {
        if (isSkip === true) {
          this.workbechService.DbConnection(obj).subscribe({next: (responce) => {
            console.log(responce)
                if(responce){
                  this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                  this.databaseId=responce.database?.hierarchy_id
                  this.modalService.dismissAll();
                  this.openMicrosoftSqlServerForm = false;
                  const encodedId = btoa(this.databaseId.toString());
                  if(this.iscrossDbSelect){
                    this.selectedHirchyIdCrsDb = this.databaseId
                    this.connectCrossDbs();
                  }else{
                    this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
                  }
                }
              },
              error: (error) => {
                console.log(error);
                this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
              }
            }
          )
        } else if(isSkip === false) {
          this.checkDataSourceConnection(obj);
        }
      });
    }
    openSnowflakeServer(){
      this.openSnowflakeServerForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    snowflakeSignIn(){
      const obj={
          "database_type":"snowflake",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "database": this.postGreDatabaseName,
      }
      this.confirmPopupForDataTransformation().then((isSkip) => {
        if (isSkip === true) {
          this.workbechService.DbConnection(obj).subscribe({next: (responce) => {
            console.log(responce)
                if(responce){
                  this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                  this.databaseId=responce.database?.hierarchy_id
                  this.modalService.dismissAll();
                  this.openSnowflakeServerForm = false;
                  const encodedId = btoa(this.databaseId.toString());
                  if(this.iscrossDbSelect){
                    this.selectedHirchyIdCrsDb = this.databaseId
                    this.connectCrossDbs();
                  }else{
                    this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
                  }
                }
              },
              error: (error) => {
                console.log(error);
                this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
              }
            }
          )
        } else if(isSkip === false) {
          this.checkDataSourceConnection(obj);
        }
      });
    }
    openMOngoDb(){
      this.openMongoDbForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    mongoDbSignIn(){
      const obj={
          "database_type":"mongodb",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "database": this.postGreDatabaseName,
      }
      this.confirmPopupForDataTransformation().then((isSkip) => {
        if (isSkip === true) {
          this.workbechService.DbConnection(obj).subscribe({next: (responce) => {
            console.log(responce)
                if(responce){
                  this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                  this.databaseId=responce.database?.hierarchy_id
                  this.modalService.dismissAll();
                  this.openMongoDbForm = false;
                  const encodedId = btoa(this.databaseId.toString());
                  if(this.iscrossDbSelect){
                    this.selectedHirchyIdCrsDb = this.databaseId
                    this.connectCrossDbs();
                  }else{
                    this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
                  }
                }
              },
              error: (error) => {
                console.log(error);
                this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
              }
            }
          )
        } else if(isSkip === false) {
          this.checkDataSourceConnection(obj);
        }
      });
    }
    openIbmDb2(){
      this.ibmDb2Form=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    ibmDb2SignIn(){
      const obj={
          "database_type":"ibmdb2",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "database": this.postGreDatabaseName,
      }
      this.confirmPopupForDataTransformation().then((isSkip) => {
        if (isSkip === true) {
          this.workbechService.DbConnection(obj).subscribe({next: (responce) => {
            console.log(responce)
                if(responce){
                  this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                  this.databaseId=responce.database?.hierarchy_id
                  this.modalService.dismissAll();
                  this.ibmDb2Form = false;
                  const encodedId = btoa(this.databaseId.toString());
                  this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
                }
              },
              error: (error) => {
                console.log(error);
                this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
              }
            }
          )
        } else if(isSkip === false) {
          this.checkDataSourceConnection(obj);
        }
      });
    }

    opensqlLite(){
      this.sqlLiteForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
    }
    uploadfile(event:any){
      const file:File = event.target.files[0];
      this.fileData = file
    }
    sqLiteSignIn(){
      const formData: FormData = new FormData();
      formData.append('path', this.fileData,this.fileData.name); 
      formData.append('database_type','sqlite');
      formData.append('display_name',this.displayName);

      this.confirmPopupForDataTransformation().then((isSkip) => {
        if (isSkip === true) {
        this.workbechService.DbConnection(formData).subscribe({next: (responce) => {
          console.log(responce)
              if(responce){
                this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                this.databaseId=responce.database?.hierarchy_id
                this.modalService.dismissAll();
                this.ibmDb2Form = false;
                const encodedId = btoa(this.databaseId.toString());
                if(this.iscrossDbSelect){
                  this.selectedHirchyIdCrsDb = this.databaseId
                  this.connectCrossDbs();
                }else{
                  this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
                }
              }
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            }
          }
        )
      } else if(isSkip === false) {
        this.checkDataSourceConnection(formData);
      }
      });
    }

    triggerFileUpload(value:any) {
      if(value === 'csv'){
      this.fileInput.nativeElement.click();
      }else if(value === 'excel'){
        this.fileInput1.nativeElement.click();
      }
    }

    uploadfileCsv(event:any,type:any,database:any){
      const file:File = event.target.files[0];
      this.fileData = file;
      if(this.fileData && this.fileData.type == 'text/csv'){
        if(type === 'upload'){
          this.csvUpload(event.target);
        } else if(type === 'replace'){
          this.replaceExcelOrCsvFile(event.target,database);
        } else if(type === 'upsert'){
          this.upsertExcelOrCsvFile(event.target,database);
        } else if(type === 'append'){
          this.appendExcelOrCsvFile(event.target,database);
        }
      } else{
        this.toasterservice.error('Not a supported file format. Please select an CSV file.','info',{ positionClass: 'toast-top-center'})
      }
    }
    csvUpload(fileInput: any){
    const formData: FormData = new FormData();
      formData.append('file_path', this.fileData,this.fileData.name); 
      formData.append('file_type','csv');
      this.workbechService.DbConnectionFiles(formData).subscribe({next: (responce) => {
        console.log(responce)
            if(responce){
              this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
              this.fileId=responce.hierarchy_id
              const encodedId = btoa(this.fileId.toString());
              if(this.iscrossDbSelect){
                this.selectedHirchyIdCrsDb = this.fileId
                this.connectCrossDbs();
              }else{
              this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            }
          },
          error: (error) => {
            console.log(error);
            fileInput.value = '';
            this.cd.detectChanges();
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          },
          complete: () => {
            fileInput.value = '';
            this.cd.detectChanges();
          }
        }
      )
    }
    uploadfileExcel(event:any,type:any,database:any){
      const file:File = event.target.files[0];
      this.fileData = file;
      if(this.fileData && ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(this.fileData.type)){
        if(type === 'upload'){
          this.excelUpload(event.target);
        } else if(type === 'replace'){
          this.replaceExcelOrCsvFile(event.target,database);
        } else if(type === 'upsert'){
          this.upsertExcelOrCsvFile(event.target,database);
        }  else if(type === 'append'){
          this.appendExcelOrCsvFile(event.target,database);
        }
      } else{
        this.toasterservice.error('Not a supported file format. Please select an Excel file.','info',{ positionClass: 'toast-top-center'})
      }
    }
    excelUpload(fileInput: any){
      const formData: FormData = new FormData();
        formData.append('file_path', this.fileData,this.fileData.name); 
        formData.append('file_type','excel');
        this.workbechService.DbConnectionFiles(formData).subscribe({next: (responce) => {
          console.log(responce)
              if(responce){
                this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                this.fileId=responce.hierarchy_id
                const encodedId = btoa(this.fileId.toString());
                if(this.iscrossDbSelect){
                  this.selectedHirchyIdCrsDb = this.fileId
                  this.connectCrossDbs();
                }else{
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
                }
              }
            },
            error: (error) => {
              console.log(error);
              fileInput.value = '';
              this.cd.detectChanges();
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            },
            complete: () => {
              fileInput.value = '';
              this.cd.detectChanges();
            }
          }
        )
      }
      // quickbooks Connection
      connectQuickBooks(){
        Swal.fire({
          title: 'This will redirect to QuickBooks SignIn page',
          // text: 'This will redirect to QuickBooks SignIn page',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result)=>{
          if(result.isConfirmed){
            this.workbechService.connectQuickBooks()
            .subscribe(
              {
                next: (data) => {
                  console.log(data);
                  // this.routeUrl = data.redirection_url
                  this.document.location.href = data.redirection_url;
                  this.loaderService.show();
                },
                error: (error) => {
                  console.log(error);
                }
              }
            )
          }}) 
      }
      connectSalesforce(){
        Swal.fire({
        title: 'This will redirect to Salesforce SignIn page',
        // text: 'This will redirect to Salesforce SignIn page',
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result)=>{
        if(result.isConfirmed){
          this.workbechService.connectSalesforce()
          .subscribe(
            {
              next: (data) => {
                console.log(data);
                // this.routeUrl = data.redirection_url
                this.document.location.href = data.redirection_url;
              },
              error: (error) => {
                console.log(error);
              }
            }
          )
        }}) 
      }

      connectxAmplify() {
        Swal.fire({
            title: 'This will redirect to xAmplify SignIn page',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to the specified URL
                window.location.href = 'https://xamplify.io/';
                // Optionally, if there's a loader or some other indication, show it here:
                // this.loaderService.show();
            }
        });
    }
    connectJira() {
      Swal.fire({
          title: 'This will redirect to Jira SignIn page',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
      }).then((result) => {
          if (result.isConfirmed) {
              // Redirect to the specified URL
              window.location.href = 'https://id.atlassian.com/login';
              // Optionally, if there's a loader or some other indication, show it here:
              // this.loaderService.show();
          }
      });
  }
//gsheets
connectGoogleSheets(){
  Swal.fire({
    title: 'This will redirect to Google SignIn page',
    // text: 'This will redirect to QuickBooks SignIn page',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ok'
  }).then((result)=>{
    if(result.isConfirmed){
      this.workbechService.connectGoogleSheets()
      .subscribe(
        {
          next: (data) => {
            console.log(data);
            // this.routeUrl = data.redirection_url
            this.document.location.href = data.redirection_url;
            this.loaderService.show();
          },
          error: (error) => {
            console.log(error);
          }
        }
      )
    }}) 
}
    deleteDbConnection(id:any){
      // const obj ={
      //   database_id:dbId
      // }
      let obj: any = {};
        obj = { hierarchy_id: id };

      // if (dbId) {
      //   obj = { database_id: dbId };
      // } else if (fileId) {
      //   obj = { file_id: fileId };
      // }
      this.workbechService.deleteDbMsg(obj)
      .subscribe(
        {
          next:(data:any) => {
            console.log(data);      
            if(data){
              Swal.fire({
                title: 'Are you sure?',
                text: data.message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result)=>{
                if(result.isConfirmed){
                  if(id){
                  this.workbechService.deleteDbConnection(id)
                  .subscribe(
                    {
                      next:(data:any) => {
                        console.log(data);      
                        if(data){
                          this.toasterservice.success('Database Deleted Successfully','success',{ positionClass: 'toast-top-right'});
                        }
                        this.getDbConnectionList();
                      },
                      error:(error:any)=>{
                        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
                        console.log(error)
                      }
                    } 
                  )
                  }
                  // if(fileId){
                  //   this.workbechService.deleteFileConnection(fileId)
                  //   .subscribe(
                  //     {
                  //       next:(data:any) => {
                  //         console.log(data);      
                  //         if(data){
                  //           // Swal.fire({
                  //           //   icon: 'success',
                  //           //   title: 'Deleted!',
                  //           //   text: 'Databse Deleted Successfully',
                  //           //   width: '400px',
                  //           // })
                  //           this.toasterservice.success('Database Deleted Successfully','success',{ positionClass: 'toast-top-right'});
                  //         }
                  //         this.getDbConnectionList();
                  //       },
                  //       error:(error:any)=>{
                  //         Swal.fire({
                  //           icon: 'warning',
                  //           text: error.error.message,
                  //           width: '300px',
                  //         })
                  //         console.log(error)
                  //       }
                  //     } 
                  //   )
                  // }
                }})
            }
          },
          error:(error:any)=>{
            Swal.fire({
              icon: 'warning',
              text: error.error.message,
              width: '300px',
            })
            console.log(error)
          }
        } 
      )





    }
    editDbConnectionModal(OpenmdoModal: any) {
      this.modalService.open(OpenmdoModal);
    }
  editDbDetails(id: any) {
    const editDataArray = this.connectionList.filter((item: { hierarchy_id: number; }) => item.hierarchy_id == id);
    console.log(editDataArray)
    const editData = editDataArray[0]
    this.databaseType = editData.database_type;
    this.databaseId = editData.hierarchy_id;
    if (this.databaseType == "connectwise") {
      this.companyId = editData.company_id;
        this.siteURL = editData.site_url;
        this.publicKey = editData.public_key;
        this.privateKey = editData.private_key;
        this.displayName = editData.display_name;
    } else if (this.databaseType == "halops") {
      this.siteURLPSA = editData.site_url;
      this.clientIdPSA = editData.client_id;
      this.clientSecret = editData.client_secret;
      this.displayName = editData.display_name;
    }else if(this.databaseType == "shopify"){
      this.displayName = editData.display_name;
      this.shopifyName = editData.shop_name;
      this.shopifyToken = editData.api_token;
    }
     else {
      this.postGreServerName = editData.hostname;
      this.postGrePortName = editData.port;
      this.postGreUserName = editData.username;
      this.PostGrePassword = '';
      this.OracleServiceName = '';
      this.displayName = editData.display_name;
      if (this.databaseType === 'oracle') {
        this.postGreDatabaseName = editData.service_name;
      } else {
        this.postGreDatabaseName = editData.database;
      }
      if(this.databaseType == 'postgresql'){
        this.selectedSchema = editData.schema;
      }
      this.errorCheck();
    }
  }

    Openmdo(OpenmdoModal: any) {
      this.modalService.open(OpenmdoModal);
    }
    toggleVisibility1() {
      this.showPassword1 = !this.showPassword1;
      if (this.toggleClass1 === "off-line") {
        this.toggleClass1 = "line";
      } else {
        this.toggleClass1 = "off-line";
      }
    }
  ngOnInit(): void {
    // {
    //   document.querySelector('html')?.getAttribute('data-toggled') != null
    //     ? document.querySelector('html')?.removeAttribute('data-toggled')
    //     : document
    //         .querySelector('html')
    //         ?.setAttribute('data-toggled', 'icon-overlay-close');    
    // }
    this.loaderService.hide();
    if (this.viewDatasourceList) {
      if (this.databaseconnectionsList) {
        this.getDbConnectionList();
      }
    }
    this.errorCheck();
  }

  pageChangegetconnectionList(page:any){
    this.pageNo=page;
    this.getDbConnectionList();
  }
  searchDbConnectionList(){
    this.pageNo=1;
    this.getDbConnectionList();
  }
  getDbConnectionList(){
    const Obj: { search?: any; page_no: number; page_count?: any; remove_hierarchy_id?: boolean } ={
      search : this.searchDbName,
      page_no:this.pageNo,
      page_count:this.itemsPerPage

    }
    if(Obj.search == '' || Obj.search == null){
      delete Obj.search;
    }
    if(Obj.page_count == undefined || Obj.page_count == null){
      delete Obj.page_count
    }
    if(this.iscrossDbSelect){
      Obj.remove_hierarchy_id = this.primaryHierachyId
    }
    this.workbechService.getdatabaseConnectionsList(Obj).subscribe({
      next:(data)=>{
        console.log(data);
        this.connectionList = data.sheets;
        this.itemsPerPage = data.items_per_page;
        this.totalItems = data.total_items
        console.log('connectionlist',data)
       },
      error:(error)=>{
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'oops!',
          text: error.error.message,
          width: '400px',
        })
      }
    })
  }
  getTablesFromConnectedDb(id:any,crsdbId:any){
    // if(dbId === null){
    if(crsdbId){
    const encodedId = btoa(crsdbId.toString());
    this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
    }
    else{
      const encodedId = btoa(id.toString());
    this.router.navigate(['/analytify/database-connection/tables/'+encodedId]); 
    }

}

  onDeleteItem(index: number) {
     this.draggedtables.splice(index, 1); // Remove the item from the droppedItems array
     console.log(this.draggedtables)
  }

  gotoNewConnections(){
  this.openPostgreSqlForm=false;
  this.viewNewDbs=true;
  this.openMySqlForm=false;
  this.openOracleForm = false;
  this.openMongoDbForm = false;
  this.openMicrosoftSqlServerForm = false;
  this.openSnowflakeServerForm = false;
  this.ibmDb2Form= false;
  this.sqlLiteForm = false;
  this.openConnectWiseForm = false;
  this.openHaloPSAForm = false;
  this.openShopifyForm = false;
  this.postGreServerName = '';
  this.schemaList = [];
  this.selectedSchema = 'public';
  this.postGrePortName = '';
  this.postGreDatabaseName = '';
  this.postGreUserName = '';
  this.PostGrePassword = '';
  this.OracleServiceName = '';
  this.displayName ='';
  this.fileData = '';
  this.privateKey = '';
  this.publicKey = '';
  this.siteURL = '';
  this.companyId = '';
  this.siteURLPSA = '';
  }

  serverError:boolean = false;
  portError:boolean = false;
  databaseError:boolean = false;
  userNameError:boolean = false;
  displayNameError:boolean = false;
  passwordError:boolean = false;
  pathError:boolean = false;
  siteURLError:boolean = false;
  siteURLErrorPSA:boolean = false;
  clientIDPSAError:boolean = false;
  clientSecretError: boolean = false;
  privateKeyError:boolean = false;
  publicKeyError:boolean = false;
  companyIDError:boolean = false;
  disableConnectBtn = true;

  shopifyApiTokenError:boolean = false;
  shopifyNameError:boolean = false;

  serverConditionError(){
    if(this.schemaList && this.schemaList.length > 0){
      this.selectedSchema = 'public';
      this.schemaList = [];
    }
    if(this.postGreServerName){
      this.serverError = false;
    }else{
      this.serverError = true;
    }
    this.errorCheck();
  }
  portConditionError(){
    if(this.schemaList && this.schemaList.length > 0){
      this.selectedSchema = 'public';
      this.schemaList = [];
    }
    if(this.postGrePortName){
      this.portError = false;
    }else{
      this.portError = true;
    }
    this.serverConditionError();
    this.errorCheck();
  }
  databaseConditionError(){
    if(this.schemaList && this.schemaList.length > 0){
      this.selectedSchema = 'public';
      this.schemaList = [];
    }
      if (this.postGreDatabaseName) {
        this.databaseError = false;
      } else {
        this.databaseError = true;
      }
    this.portConditionError();
    this.errorCheck();
  }
  userNameConditionError(){
    if(this.schemaList && this.schemaList.length > 0){
      this.selectedSchema = 'public';
      this.schemaList = [];
    }
    if(this.postGreUserName){
      this.userNameError = false;
    }else{
      this.userNameError = true;
    }
    this.databaseConditionError();
    this.errorCheck();
  }
  displayNameIntegrationConditionError(){
    if(this.displayName){
      this.displayNameError = false;
    }else{
      this.displayNameError = true;
    }
  }
  displayNameConditionError(){
    if(this.displayName){
      this.displayNameError = false;
    }else{
      this.displayNameError = true;
    }
    if(this.sqlLiteForm){
      this.pathConditionError();
    } else{
      this.userNameConditionError();
    }
    this.errorCheck();
  }
  passwordConditionError(){
    if(this.schemaList && this.schemaList.length > 0){
      this.selectedSchema = 'public';
      this.schemaList = [];
    }
    if(this.PostGrePassword){
      this.passwordError = false;
    }else{
      this.passwordError = true;
    }
    this.displayNameConditionError();
    this.errorCheck();
  }
  pathConditionError(){
    if(this.path){
      this.pathError = false;
    } else{
      this.pathError = true;
    }
  }
  errorCheck(){
    if(this.openMicrosoftSqlServerForm){
      if(this.selectedMicroSoftAuthType === 'Windows Authentication'){
        if(this.serverError || this.portError || this.databaseError || this.displayNameError){
          this.disableConnectBtn = true;
        } else if(!(this.postGreServerName && this.postGrePortName && this.postGreDatabaseName && this.displayName)) {
          this.disableConnectBtn = true;
        } else{
          this.disableConnectBtn = false;
        }
      }
      else{
         if(this.serverError || this.portError || this.databaseError || this.userNameError || this.displayNameError || this.passwordError){
          this.disableConnectBtn = true;
        } else if(!(this.postGreServerName && this.postGrePortName && this.postGreDatabaseName && this.postGreUserName && this.displayName && this.PostGrePassword)) {
          this.disableConnectBtn = true;
        } else{
          this.disableConnectBtn = false;
        }
      }
    }
    else if(this.serverError || this.portError || this.databaseError || this.userNameError || this.displayNameError || this.passwordError){
      this.disableConnectBtn = true;
    } else if(!(this.postGreServerName && this.postGrePortName && this.postGreDatabaseName && this.postGreUserName && this.displayName && this.PostGrePassword)) {
      this.disableConnectBtn = true;
    } else{
      this.disableConnectBtn = false;
    }
  }
  replaceExcelOrCsvFile(fileInput: any,database:any) {
    const formData: FormData = new FormData();
    formData.append('file_path', this.fileData, this.fileData.name);
    formData.append('file_type', database.database_type);
    formData.append('hierarchy_id', database.hierarchy_id);
    this.workbechService.replaceExcelOrCsvFile(formData).subscribe({
      next:(responce)=>{
        console.log(responce);
        this.toasterservice.success(responce.message,'success',{ positionClass: 'toast-top-right'});
        this.fileId=database.hierarchy_id
        const encodedId = btoa(this.fileId.toString());
        this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
       },
       error: (error) => {
        console.log(error);
        fileInput.value = '';
        this.cd.detectChanges();
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
      },
      complete: () => {
        fileInput.value = '';
        this.cd.detectChanges();
      }
    })
  }
  upsertExcelOrCsvFile(fileInput: any,database : any){
    const formData: FormData = new FormData();
    formData.append('file_path', this.fileData, this.fileData.name);
    formData.append('file_type', database.database_type);
    formData.append('hierarchy_id', database.hierarchy_id);
    this.workbechService.upsertExcelOrCsvFile(formData).subscribe({
      next:(responce)=>{
        console.log(responce);
        this.toasterservice.success(responce.message,'success',{ positionClass: 'toast-top-right'});
        this.fileId=database.hierarchy_id
        const encodedId = btoa(this.fileId.toString());
        this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
       },
       error: (error) => {
        console.log(error);
        fileInput.value = '';
        this.cd.detectChanges();
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
      },
      complete: () => {
        fileInput.value = '';
        this.cd.detectChanges();
      }
    })
  }

  onSelectedHIDCrsDb(hId:any){
    if (this.selectedHirchyIdCrsDb === hId) {
      this.selectedHirchyIdCrsDb = null;  // Unselect if clicking the same one
    } else {
      this.selectedHirchyIdCrsDb = hId;  // Select new one
    }
    console.log(hId);
  }
  connectCrossDbs(){
    const obj ={
      hierarchy_ids:[this.primaryHierachyId,this.selectedHirchyIdCrsDb]
    }
    this.workbechService.crossDbConnection(obj).subscribe({
      next:(data)=>{
        console.log(data);
        const encodedId = btoa(data[0].cross_db_id.toString());
        if(this.isCustomSql){
          if(this.querysetIdFromDataSource){
            const encodeQrysetId = btoa(this.querysetIdFromDataSource.toString())
            this.router.navigate(['/analytify/database-connection/savedQuery/'+encodedId+'/'+encodeQrysetId]);
            }
            else{
              this.router.navigate(['/analytify/database-connection/savedQuery/'+encodedId]);
            }
        }
        else if(!this.isCustomSql){
          if(this.querysetIdFromDataSource){
            const encodeQrysetId = btoa(this.querysetIdFromDataSource.toString())
            this.router.navigate(['/analytify/database-connection/tables/'+encodedId+'/'+encodeQrysetId]);
            }
            else{
              this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
            }
        }
       },
      error:(error)=>{
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'oops!',
          text: error.error.message,
          width: '400px',
        })
      }
    })
  }

  fetchSchemaList() {
    this.loaderService.show();
    const obj = {
      "database_type": "postgresql",
      "hostname": this.postGreServerName,
      "port": this.postGrePortName,
      "username": this.postGreUserName,
      "password": this.PostGrePassword,
      "database": this.postGreDatabaseName,
      "display_name": this.displayName
    }
    this.workbechService.fetchSchemaList(obj).subscribe({
      next: (responce) => {
        if (responce && responce.schemas) {
          this.schemaList = responce.schemas;
          this.loaderService.hide();
        }
      },
      error: (error) => {
        console.log(error);
        this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' });
        this.loaderService.hide();
      }
    })
  }

  appendExcelOrCsvFile(fileInput: any,database : any){
    const formData: FormData = new FormData();
    formData.append('file_path', this.fileData, this.fileData.name);
    formData.append('file_type', database.database_type);
    formData.append('hierarchy_id', database.hierarchy_id);
    this.workbechService.appendExcelOrCsvFile(formData).subscribe({
      next:(responce)=>{
        console.log(responce);
        this.toasterservice.success(responce.message,'success',{ positionClass: 'toast-top-right'});
        this.fileId=database.hierarchy_id
        const encodedId = btoa(this.fileId.toString());
        this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
       },
       error: (error) => {
        console.log(error);
        fileInput.value = '';
        this.cd.detectChanges();
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
      },
      complete: () => {
        fileInput.value = '';
        this.cd.detectChanges();
      }
    })
  }
  onSchemaChange(){
    this.toasterservice.info('On Updating your existing sheets will not work as expected as you are changing schema','info',{ positionClass: 'toast-center-center'});
  }

  confirmPopupForDataTransformation(): Promise<boolean | null> {
    return Swal.fire({
      position: "center",
      icon: "question",
      title: "Do you want to do transformations on the data?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Skip",
      cancelButtonText: "Data Transformation",
      showCloseButton: true, 
      allowOutsideClick: false, 
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.close) {
        return null;
      }
      if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
      return result.isConfirmed;
    });
  }

  checkDataSourceConnection(object: any) {
    this.workbechService.checkDatasourceConnection(object).subscribe({
      next: (responce) => {
        console.log(responce);
        const encodedServerId = btoa(responce.server_id.toString());
        if (this.iscrossDbSelect){
          const encodedPrimaryHId = btoa(this.primaryHierachyId.toString());
          const encodedQuerySetId = this.querysetIdFromDataSource ? btoa(this.querysetIdFromDataSource.toString()) : '';
          if(this.isCustomSql){
            if(encodedQuerySetId){
              this.router.navigate(['/analytify/crossDatabase/customSql/dataTransformation/' + encodedServerId + '/' + encodedPrimaryHId +'/' + encodedQuerySetId]);
            } else{
              this.router.navigate(['/analytify/crossDatabase/customSql/dataTransformation/' + encodedServerId + '/' + encodedPrimaryHId]);
            }
          } else{
            if(encodedQuerySetId){
              this.router.navigate(['/analytify/crossDatabase/dataTransformation/' + encodedServerId + '/' + encodedPrimaryHId +'/' + encodedQuerySetId]);
            } else{
              this.router.navigate(['/analytify/crossDatabase/dataTransformation/' + encodedServerId + '/' + encodedPrimaryHId]);
            }
          }
        } else{
          this.router.navigate(['/analytify/databaseConnection/dataTransformation/' + encodedServerId]);
        }
      },
      error: (error) => {
        console.log(error);
        this.toasterservice.error(error.error.message, 'error', { positionClass: 'toast-center-center' })
      }
    });
  }
  goToTransformationLayer(hierarchyId:any){
    const encodedId = btoa(hierarchyId.toString());
    this.router.navigate(['/analytify/transformationList/dataTransformation/' + encodedId]);
  }

}
