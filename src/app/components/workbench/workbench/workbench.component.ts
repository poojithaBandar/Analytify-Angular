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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { BambooHRIntegrationService } from '../bamboohr-integration.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-workbench',
  standalone: true,
  imports: [RouterModule,NgbModule,SharedModule,FormsModule,CdkDropListGroup, CdkDropList, CdkDrag,GalleryModule,LightboxModule,ToastrModule,CommonModule,NgxPaginationModule,InsightsButtonComponent,InsightEchartComponent,NgMultiSelectDropDownModule,NgSelectModule],
  templateUrl: './workbench.component.html',
  styleUrl: './workbench.component.scss',
  providers: [TemplateDashboardService]
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
  openPax8Form = false;
  openBambooHRForm = false;
  openHubspotForm = false;
  openShopifyForm =false;
  openGoogleAnalyticsForm = false;
  openOpenAIForm = false;
  openDeepSeekForm = false;
  openGeminiForm = false;
  smartDashboardSources = ['CONNECTWISE','SHOPIFY','HALOPS','OPEN_AI','HUBSPOT','NINJA','IMMYBOT','QUICKBOOKS','SALESFORCE','TALLY','PAX8','BAMBOOHR'];
  openOracleForm = false;
  openMicrosoftSqlServerForm = false;
  openSnowflakeServerForm = false;
  openMongoDbForm = false;
  openSapHanaForm = false;
  openTallyForm = false;
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
  existingConnectionListWithoutFilter = [] as any;
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
  readonly SAP_DEFAULT_SCHEMA = 'DBADMIN';
  querysetIdFromDataSource :any;
  datasourceSwitchUI=false;
  databaseSwitchType:any;
  selectedSourceSwithDbId:any;
  dashbaordIdToSwitch:any;
  isCustomSql = false;
  openNinjaRMMForm: boolean = false;
  ninjaRMMClientIdError : boolean = false;
  ninjaRMMClientid!: string;
  ninjaRMMClientSecretError : boolean = false;
  ninjaRMMClientSecret! : string;
  ninjaRMMScopes = ['monitoring', 'management', 'control'];
  selectedNinjaRMMScopes: string[] = [];
  ninjaRMMScopeError: boolean = false;
  hubspotClientId!: string;
  hubspotClientSecret!: string;
  hubspotRedirectURL!: string;
  hubspotScopes: string[] = [
    "cms.domains.read",
    "cms.functions.read",
    "cms.knowledge_base.articles.read",
    "cms.knowledge_base.settings.read",
    "cms.membership.access_groups.read",
    "cms.performance.read",
    "communication_preferences.read",
    "communication_preferences.statuses.batch.read",
    "conversations.custom_channels.read",
    "conversations.read",
    "crm.dealsplits.read_write",
    "crm.lists.read",
    "crm.objects.appointments.read",
    "crm.objects.carts.read",
    "crm.objects.commercepayments.read",
    "crm.objects.companies.read",
    "crm.objects.contacts.read",
    "crm.objects.courses.read",
    "crm.objects.custom.read",
    "crm.objects.deals.read",
    "crm.objects.feedback_submissions.read",
    "crm.objects.owners.read",
    "crm.objects.quotes.read",
    "crm.schemas.courses.read",
    "crm.objects.marketing_events.read",
    "crm.schemas.contacts.read",
    "crm.schemas.companies.read",
    "crm.schemas.deals.read",
    "crm.objects.goals.read",
    "crm.objects.invoices.read",
    "crm.objects.leads.read",
    "crm.objects.line_items.read",
    "crm.objects.listings.read",
    "crm.objects.orders.read",
    "crm.objects.partner-clients.read",
    "crm.objects.products.read",
    "crm.objects.services.read",
    "crm.objects.subscriptions.read",
    "crm.objects.users.read",
    "crm.pipelines.orders.read",
    "crm.schemas.custom.read",
    "crm.schemas.appointments.read",
    "crm.schemas.carts.read",
    "crm.schemas.commercepayments.read",
    "crm.schemas.invoices.read",
    "crm.schemas.line_items.read",
    "crm.schemas.listings.read",
    "crm.schemas.orders.read",
    "crm.schemas.quotes.read",
    "crm.schemas.services.read",
    "crm.schemas.subscriptions.read",
    "ctas.read",
    "marketing.campaigns.read",
    "marketing.campaigns.revenue.read",
    "settings.users.read",
    "settings.users.teams.read",
    "content",
    "hubdb",
    "tickets",
    "crm.import",
    "account-info.security.read",
  "settings.currencies.read"
  ];
  hubspotDropdownSettings: IDropdownSettings = {
    enableCheckAll: true,
    allowSearchFilter: true,
    itemsShowLimit: 10,
    closeDropDownOnSelection: false
  };
  selectedHubspotScopes: string[] = [];
  hubspotClientIdError = false;
  hubspotClientSecretError = false;
  hubspotRedirectURLError = false;
  hubspotScopeError = false;
  openImmybot: boolean = false;
  clientIDImmyBotError: boolean = false;
  clientIdImmybot! : string ;
  secretValue! : string;
  secretValueError: boolean = false;
  tenantIdError: boolean = false;
  tenantId!: string
  subDomain!: string;
  subDomainError: boolean = false;
  viewNewDbsOld: boolean = false;

  alertsCount:any;
  recentSyncCount:any;
  datasetsCount:any;
  connectionsCount:any;
  callAllConnectionsExistingList: boolean = false;
  constructor(private modalService: NgbModal, private workbechService:WorkbenchService,private router:Router,private toasterservice:ToastrService,private route:ActivatedRoute,
    private viewTemplateService:ViewTemplateDrivenService,@Inject(DOCUMENT) private document: Document,private loaderService:LoaderService,private bambooHRService: BambooHRIntegrationService,private cd:ChangeDetectorRef,private templateDashboardService: TemplateDashboardService,private toasterService:ToastrService,private sanitizer: DomSanitizer){
    localStorage.setItem('QuerySetId', '0');
    localStorage.setItem('customQuerySetId', '0');

    this.canUploadExcel = this.viewTemplateService.canUploadExcel();
    this.canUploadCsv = this.viewTemplateService.canUploadCsv();

    const currentUrl = this.router.url; 
    if (currentUrl.includes('/analytify/datasources/')) {
      if (currentUrl.includes('view-connections')) {
        this.databaseconnectionsList = true;
        this.viewNewDbs = false;
        this.isGoogleSheetsPage = false;
        // this.iscrossDbSelect = false;
      } else if (currentUrl.includes('new-connections')) {
        this.callAllConnectionsExistingList = true;
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
      }
      else if(currentUrl.includes('datasource-switch/')){
        this.databaseconnectionsList = false;
        this.viewNewDbs = false;
        this.isGoogleSheetsPage = false;
        this.datasourceSwitchUI=true;
        if (route.snapshot.paramMap.has('id1')) {
          this.databaseSwitchType = route.snapshot.params['id1'];
          this.selectedSourceSwithDbId = +atob(route.snapshot.params['id2']);
          this.dashbaordIdToSwitch = +atob(route.snapshot.params['id3'])
        }
        this.openConnectionOnDatasourceSwitch();
      }
    }
    this.viewDatasourceList = this.viewTemplateService.viewDtabase();
  }

  buildSampleGieneAiqDashbaord(hid:any,data:any){
  this.templateDashboardService.buildSampleGieneAiqDashbaord(this.container, hid, data);
}
  openConnectionOnDatasourceSwitch(){
    if(this.databaseSwitchType === 'POSTGRESQL'){
    this.openPostgreSql();
    }
    else if(this.databaseSwitchType === 'ORACLE'){
    this.openOracle();
    }
    else if(this.databaseSwitchType === 'MYSQL'){
    this.openMySql();
    }
    else if(this.databaseSwitchType === 'SQLITE'){
    this.opensqlLite();
    }
    else if(this.databaseSwitchType === 'MICROSOFTSQLSERVER'){
    this.openMicrosoftSqlServer();
    }
    else if(this.databaseSwitchType === 'SNOWFLAKE'){
    this.openSnowflakeServer();
    }
    else if(this.databaseSwitchType === 'SHOPIFY'){
    this.connectShopify();
    }
    else if(this.databaseSwitchType === 'CONNECTWISE'){
    this.connectWise();
    }
    else if(this.databaseSwitchType === 'HALOPS'){
    this.connectHaloPSA();
    }
    else if(this.databaseSwitchType === 'PAX8'){
    this.connectPax8();
    }
    else if(this.databaseSwitchType === 'TALLY'){
    this.connectTally();
    }
    else if(this.databaseSwitchType === 'IMMYBOT'){
    this.connectImmybot();
    }
    else if(this.databaseSwitchType === 'NINJA'){
    this.connectNinjaRMM();
    }
    else if(this.databaseSwitchType === 'HUBSPOT'){
    this.connectHubspot();
    }
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
    pax8ClientId = '';
    pax8ClientSecret = '';
    bambooHRApiKey = '';
    bambooHRDomain = '';
    publicKey = '';
    privateKey = '';
    path='';
    shopifyToken = '';
    shopifyName = '';
    tallyToken = '';
    openAiKey = '';
    deepSeekKey = '';
    geminiKey = '';

    googleAnalytics: {
      type: string;
      project_id: string;
      private_key_id: string;
      private_key: string;
      client_email: string;
      client_id: string;
      client_x509_cert_url: string;
      property_id: string;
      dimensions: string[];  // <-- Explicitly typed
      metrics: string[];     // <-- Explicitly typed
      displayname: string;
    } = {
      type: 'service_account',
      project_id: '',
      private_key_id: '',
      private_key: '',
      client_email: '',
      client_id: '',
      client_x509_cert_url: '',
      property_id: '',
      dimensions: [],
      metrics: [],
      displayname: ''
    };
    availableDimensions =[
      "date",
      "country",
      "firstUserDv360LineItemName",
      "firstUserDv360Medium",
      "firstUserDv360PartnerId",
      "firstUserDv360PartnerName",
      "firstUserDv360Source",
      "firstUserDv360SourceMedium",
      "firstUserGoogleAdsAccountName",
      "firstUserGoogleAdsAdGroupId",
      "firstUserGoogleAdsAdGroupName",
      "firstUserGoogleAdsAdNetworkType",
      "firstUserGoogleAdsCampaignId",
      "firstUserGoogleAdsCampaignName",
      "firstUserGoogleAdsCampaignType",
      "firstUserGoogleAdsCreativeId",
      "firstUserGoogleAdsCustomerId",
      "firstUserGoogleAdsKeyword",
      "firstUserGoogleAdsQuery",
      "firstUserManualAdContent",
      "firstUserManualCampaignId",
      "firstUserManualCampaignName",
      "firstUserManualCreativeFormat",
      "firstUserManualMarketingTactic",
      "firstUserManualMedium",
      "firstUserManualSource",
      "firstUserManualSourceMedium",
      "firstUserManualSourcePlatform",
      "firstUserManualTerm",
      "firstUserSa360AdGroupId",
      "firstUserSa360AdGroupName",
      "firstUserSa360CampaignId",
      "firstUserSa360CampaignName",
      "firstUserSa360CreativeFormat",
      "firstUserSa360EngineAccountId",
      "firstUserSa360EngineAccountName",
      "firstUserSa360EngineAccountType",
      "firstUserSa360KeywordText",
      "firstUserSa360ManagerAccountId",
      "firstUserSa360ManagerAccountName",
      "firstUserSa360Medium",
      "firstUserSa360Query",
      "firstUserSa360Source",
      "firstUserSa360SourceMedium",
      "firstUserMedium",
      "firstUserPrimaryChannelGroup",
      "firstUserSource",
      "firstUserSourceMedium",
      "firstUserSourcePlatform",
      "googleAdsAccountName",
      "googleAdsAdGroupId",
      "googleAdsAdGroupName",
      "googleAdsAdNetworkType",
      "googleAdsCampaignId",
      "googleAdsCampaignName",
      "googleAdsCampaignType",
      "googleAdsCreativeId",
      "googleAdsCustomerId",
      "googleAdsKeyword",
      "googleAdsQuery",
      "groupId",
      "hostName",
      "hour",
      "isKeyEvent",
      "isoWeek",
      "isoYear",
      "isoYearIsoWeek",
      "fullPageUrl",
      "platform",
      "platformDeviceCategory",
      "primaryChannelGroup",
      "region",
      "sa360AdGroupId",
      "sa360AdGroupName",
      "sa360CampaignId",
      "sa360CampaignName",
      "sa360CreativeFormat",
      "sa360EngineAccountId",
      "sa360EngineAccountName",
      "sa360EngineAccountType",
      "sa360KeywordText",
      "sa360ManagerAccountId",
      "sa360ManagerAccountName",
      "sa360Medium",
      "sa360Query",
      "sa360Source",
      "sa360SourceMedium",
      "searchTerm",
      "sessionCampaignId",
      "sessionCampaignName",
      "sessionDefaultChannelGroup",
      "sessionGoogleAdsAdGroupId",
      "sessionGoogleAdsAdGroupName",
      "sessionGoogleAdsCampaignType",
      "shippingTier",
      "signedInWithUserId",
      "source",
      "sourceMedium",
      "sourcePlatform",
      "streamId",
      "streamName",
      "testDataFilterId",
      "testDataFilterName",
      "transactionId",
      "unifiedPagePathScreen",
      "unifiedPageScreen",
      "unifiedScreenClass",
      "unifiedScreenName",
      "userAgeBracket",
      "userGender",
      "videoProvider",
      "videoTitle",
      "videoUrl",
      "virtualCurrencyName",
      "visible",
      "week",
      "year",
      "yearMonth",
      "yearWeek"
  ]
    
    availableMetrics =[
      "active1DayUsers",
      "active28DayUsers",
      "active7DayUsers",
      "activeUsers",
      "adUnitExposure",
      "addToCarts",
      "advertiserAdClicks",
      "advertiserAdCost",
      "advertiserAdCostPerClick",
      "advertiserAdCostPerKeyEvent",
      "advertiserAdImpressions",
      "averagePurchaseRevenue",
      "averagePurchaseRevenuePerPayingUser",
      "averagePurchaseRevenuePerUser",
      "averageRevenuePerUser",
      "averageSessionDuration",
      "bounceRate",
      "cartToViewRate",
      "checkouts",
      "cohortActiveUsers",
      "cohortTotalUsers",
      "crashAffectedUsers",
      "crashFreeUsersRate",
      "dauPerMau",
      "dauPerWau",
      "ecommercePurchases",
      "engagedSessions",
      "engagementRate",
      "eventCount",
      "eventCountPerUser",
      "eventValue",
      "eventsPerSession",
      "firstTimePurchaserRate",
      "firstTimePurchasers",
      "firstTimePurchasersPerNewUser",
      "grossItemRevenue",
      "grossPurchaseRevenue",
      "itemDiscountAmount",
      "itemListClickEvents",
      "itemListClickThroughRate",
      "itemListViewEvents",
      "itemPromotionClickThroughRate",
      "itemRefundAmount",
      "itemRevenue",
      "itemViewEvents",
      "itemsAddedToCart",
      "itemsCheckedOut",
      "itemsClickedInList",
      "itemsClickedInPromotion",
      "itemsPurchased",
      "itemsViewed",
      "itemsViewedInList",
      "itemsViewedInPromotion",
      "keyEvents",
      "newUsers",
      "organicGoogleSearchAveragePosition",
      "organicGoogleSearchClickThroughRate",
      "organicGoogleSearchClicks",
      "organicGoogleSearchImpressions",
      "promotionClicks",
      "promotionViews",
      "publisherAdClicks",
      "publisherAdImpressions",
      "purchaseRevenue",
      "purchaseToViewRate",
      "purchaserRate",
      "refundAmount",
      "returnOnAdSpend",
      "screenPageViews",
      "screenPageViewsPerSession",
      "screenPageViewsPerUser",
      "scrolledUsers",
      "sessionKeyEventRate",
      "sessions",
      "sessionsPerUser",
      "shippingAmount",
      "taxAmount",
      "totalAdRevenue",
      "totalPurchasers",
      "totalRevenue",
      "totalUsers",
      "transactions",
      "transactionsPerPurchaser",
      "userEngagementDuration",
      "userKeyEventRate"
  ]
    isGoogleAnalyticsFormValid(): boolean {
      const g = this.googleAnalytics;
      return !!g.type && !!g.project_id && !!g.private_key_id && !!g.private_key &&
             !!g.client_email && !!g.client_id && !!g.client_x509_cert_url &&
             !!g.property_id && !!g.dimensions.length && !!g.metrics.length && !!g.displayname;
    }
    
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
    this.pax8ClientId = '';
    this.pax8ClientSecret = '';
    this.bambooHRApiKey = '';
    this.bambooHRDomain = '';
    this.ninjaRMMClientid = '';
    this.ninjaRMMClientSecret = '';
    this.selectedNinjaRMMScopes = [];
    this.hubspotClientId = '';
    this.hubspotClientSecret = '';
    this.selectedHubspotScopes = [];
    
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
                if(!this.datasourceSwitchUI){
                this.openPostgreSqlForm = false;
                }
                const encodedId = btoa(this.databaseId.toString());
                if (this.iscrossDbSelect) {
                  this.selectedHirchyIdCrsDb = this.databaseId
                  this.connectCrossDbs();
                }else if(this.datasourceSwitchUI){
                  this.switchDatabase();
                }
                 else {
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

    ninjaRMMUpdate(){
      const obj = {
        "client_id": this.ninjaRMMClientid,
        "client_secret": this.ninjaRMMClientSecret,
        "display_name": this.displayName,
        "scopes": this.selectedNinjaRMMScopes,
        "hierarchy_id":this.databaseId
      }

      this.workbechService.ninjaRMMConnectionUpdate(obj).subscribe({next: (responce) => {
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

    pax8Update(){
      const obj = {
        "client_id": this.pax8ClientId,
        "client_secret": this.pax8ClientSecret,
        "display_name": this.displayName,
        "hierarchy_id":this.databaseId
      }

      this.workbechService.pax8ConnectionUpdate(obj).subscribe({next: (responce) => {
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

    bambooHRUpdate(){
      const obj = {
        "api_key": this.bambooHRApiKey,
        "display_name": this.displayName,
        "domain": this.bambooHRDomain,
        "hierarchy_id":this.databaseId
      }

      this.bambooHRService.updateIntegration(obj).subscribe({next: (responce) => {
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

    ImmybotConnectionUpdate(){
      const obj={
        "client_id":this.clientIdImmybot,
        "secret_value":this.secretValue,
        "azure_domain":this.tenantId,
        "instance_subdomain":this.subDomain,
        "display_name":this.displayName,
        "hierarchy_id": this.databaseId
    }
      this.workbechService.immyBotConnectionUpdate(obj).subscribe({next: (responce) => {
        console.log(responce)
        if(responce){
          this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
        }
        this.getDbConnectionList();
          },
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            console.log(error);
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

    tallyUpdate(){
      const obj = {
        "token_key": this.tallyToken,
        "display_name": this.displayName,
        "hierarchy_id": this.databaseId
      }

      this.workbechService.updateTally(obj).subscribe({next: (res)=>{
            this.modalService.dismissAll('close');
            if(res){
              this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
            }
            this.getDbConnectionList();
          },
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          }
        }
      )

    }

    openAIUpdate(){
      const obj = {
        "open_ai_key": this.openAiKey,
        "display_name": this.displayName,
        "hierarchy_id": this.databaseId
      }
      this.workbechService.openAiConnectionUpdate(obj).subscribe({next:(res)=>{
            this.modalService.dismissAll('close');
            if(res){
              this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
            }
            this.getDbConnectionList();
          },
          error:(error)=>{
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          }
        }
      )

    }

    deepSeekUpdate(){
      const obj = {
        "deepseek_key": this.deepSeekKey,
        "display_name": this.displayName,
        "hierarchy_id": this.databaseId
      }
      this.workbechService.deepSeekConnectionUpdate(obj).subscribe({next:(res)=>{
            this.modalService.dismissAll('close');
            if(res){
              this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
            }
            this.getDbConnectionList();
          },
          error:(error)=>{
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          }
        }
      )

    }
    geminiUpdate(){
      const obj = {
        "gemini_key": this.geminiKey,
        "display_name": this.displayName,
        "hierarchy_id": this.databaseId
      }
      this.workbechService.geminiConnectionUpdate(obj).subscribe({next:(res)=>{
            this.modalService.dismissAll('close');
            if(res){
              this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
            }
            this.getDbConnectionList();
          },
          error:(error)=>{
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          }
        }
      )

    }
    googleAnalyticsUpdate(){
      const g = this.googleAnalytics;
     const obj = { type: g.type,
      project_id: g.project_id,
      private_key_id: g.private_key_id,
      private_key: g.private_key,
      client_email: g.client_email,
      client_id: g.client_id,
      client_x509_cert_url: g.client_x509_cert_url,
      property_id: g.property_id,
      dimensions: g.dimensions, // Array of strings
      metrics: g.metrics,
      display_name:g.displayname
     }

     this.workbechService.googleAnalyticsUpdate(obj).subscribe({next: (responce) => {
      console.log(responce);
      this.modalService.dismissAll('close');
      if(responce){
        this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
      }
      this.getDbConnectionList();
    },
    // error: (error) => {
    //   console.log(error);
    //   this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
    // }
    error: (error) => {
      console.log(error);
      if(error.error.error){
        this.modalService.dismissAll('close');
      // this.toasterservice.error(error.error.error,'error',{ positionClass: 'toast-center-center'})
      Swal.fire({
        icon: 'error',
        title: 'oops!',
        text: error.error.error,
        width: '400px',
      })
      }else {
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})

      }
  }
}
)
    }
    DatabaseUpdate(){
      const obj:any = {
          "database_type":this.databaseType,
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "database_id":this.databaseId,
      };
      if(this.databaseType === 'oracle'){
        obj.service_name = this.postGreDatabaseName;
      }else if(this.databaseType === 'sap hana'){
        if(this.postGreDatabaseName){
          obj.database = this.postGreDatabaseName;
        }
        if(this.selectedSchema){
          obj.schema = this.selectedSchema;
        }
      }else{
        obj.database = this.postGreDatabaseName;
        obj.schema = this.selectedSchema;
      }
      this.workbechService.postGreSqlConnectionput(obj).subscribe({next: (responce) => {
              console.log(responce);
              this.modalService.dismissAll('close');
              this.schemaList = [];
              this.selectedSchema = this.databaseType === 'sap hana' ? this.SAP_DEFAULT_SCHEMA : 'public';
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
                if(!this.datasourceSwitchUI){
                this.openOracleForm = false;
                }
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
    connectImmybot(){
      this.openImmybot = true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }

    connectNinjaRMM(){
      this.openNinjaRMMForm=true;
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
    connectPax8(){
      this.openPax8Form = true;
      this.databaseconnectionsList = false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }

    connectBambooHR(){
      this.openBambooHRForm = true;
      this.databaseconnectionsList = false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }

    connectTally(){
      this.openTallyForm = true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    connectGoogleAnalytics(){
      this.openGoogleAnalyticsForm = true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    connectShopify(){
      this.openShopifyForm = true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
    }
  connectHubspot(){
    this.openHubspotForm = true;
    this.databaseconnectionsList = false;
    this.viewNewDbs = false;
    this.emptyVariables();
  }
  connectOpenAI(){
    this.openOpenAIForm = true;
    this.databaseconnectionsList = false;
    this.viewNewDbs = false;
    this.emptyVariables();
  }
  connectDeepSeek(){
    this.openDeepSeekForm = true;
    this.databaseconnectionsList = false;
    this.viewNewDbs = false;
    this.emptyVariables();
  }
  connectGemini(){
    this.openGeminiForm = true;
    this.databaseconnectionsList = false;
    this.viewNewDbs = false;
    this.emptyVariables();
  }
  companyIdError(){
      if(this.companyId){
        this.companyIDError = false;
      }else{
        this.companyIDError = true;
      }
    }

    ninjaRMMClient(){
      if(this.ninjaRMMClientid){
        this.ninjaRMMClientIdError = false;
      }else{
        this.ninjaRMMClientIdError = true;
      }
    }

    ninjaRMMClientSecretData(){
      if(this.ninjaRMMClientSecret){
        this.ninjaRMMClientSecretError = false;
      }else{
        this.ninjaRMMClientSecretError = true;
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

    pax8ClientIdValidation(){
      if(this.pax8ClientId){
        this.pax8ClientIdError = false;
      }else{
        this.pax8ClientIdError = true;
      }
    }

    pax8ClientSecretValidation(){
      if(this.pax8ClientSecret){
        this.pax8ClientSecretError = false;
      }else{
        this.pax8ClientSecretError = true;
      }
    }

    bambooHRApiKeyValidation(){
      if(this.bambooHRApiKey){
        this.bambooHRApiKeyError = false;
      }else{
        this.bambooHRApiKeyError = true;
      }
    }

    bambooHRDomainValidation(){
      if(this.bambooHRDomain){
        this.bambooHRDomainError = false;
      }else{
        this.bambooHRDomainError = true;
      }
    }

    secretValueImmybotError(){
      if(this.secretValue){
        this.secretValueError = false;
      }else{
        this.secretValueError = true;
      }
    }

    clientIdErrorImmyBot(){
      if(this.clientIdImmybot){
        this.clientIDImmyBotError = false;
      }else{
        this.clientIDImmyBotError = true;
      }
    }

    tenantIdImmyBotError(){
      if(this.tenantId){
        this.tenantIdError = false;
      }else{
        this.tenantIdError = true;
      }
    }

    subDomainImmyBotError(){
      if(this.subDomain){
        this.subDomainError = false;
      }else{
        this.subDomainError = true;
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
    tallyTokenInputError(){
      if(this.tallyToken){
        this.tallyTokenError = false;
      }else{
        this.tallyTokenError = true;
      }
    }
    openAiKeyInputError(){
      if(this.openAiKey){
        this.openAiKeyError = false;
      }else{
        this.openAiKeyError = true;
      }
    }
    deepSeekKeyInputError(){
      if(this.deepSeekKey){
        this.deepSeekKeyError = false;
      }else{
        this.deepSeekKeyError = true;
      }
    }
    geminiKeyInputError(){
      if(this.geminiKey){
        this.geminiKeyError = false;
      }else{
        this.geminiKeyError = true;
      }
    }
    shopfyNameError(){
      if(this.shopifyName){
        this.shopifyNameError = false;
      }else{
        this.shopifyNameError = true;
      }
    }

    hubspotClientIdInput(){
      this.hubspotClientIdError = !this.hubspotClientId;
    }

  hubspotClientSecretInput(){
    this.hubspotClientSecretError = !this.hubspotClientSecret;
  }

  hubspotRedirectURLInput(){
    this.hubspotRedirectURLError = !this.hubspotRedirectURL;
  }

  onHubspotScopeChange(): void {
    this.hubspotScopeError = this.selectedHubspotScopes.length <= 0;
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
              if(!this.datasourceSwitchUI){
              this.openShopifyForm = false;
              }
              const encodedId = btoa(this.databaseId.toString());
              if(this.iscrossDbSelect){
                this.selectedHirchyIdCrsDb = this.databaseId
                this.connectCrossDbs();
              }else if(this.datasourceSwitchUI){
                this.switchDatabase();
              }else{
                Swal.fire({
                  position: "center",
                  iconHtml: '<img src="./assets/images/copilot.gif">',
                  title: "Create smart dashboard from your data with just one click?",
                  showConfirmButton: true,
                  showCancelButton: true,
                  confirmButtonText: 'Yes',
                  cancelButtonText: 'Skip',
                  customClass: {
                    icon: 'no-icon-bg',
                  }
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.templateDashboardService.buildSampleShopifyDashboard(this.container, this.databaseId);
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

    ninjaRMMSignIn(){
      const obj = {
        "client_id": this.ninjaRMMClientid,
        "client_secret": this.ninjaRMMClientSecret,
        "display_name": this.displayName,
        "scopes": this.selectedNinjaRMMScopes
      }
      this.workbechService.ninjaRMMConnection(obj).subscribe({next: (responce) => {
        console.log(responce)
            if(responce){
              this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
              this.databaseId=responce?.hierarchy_id;
              this.modalService.dismissAll();
              if(!this.datasourceSwitchUI){
              this.openNinjaRMMForm = false;
              }
              const encodedId = btoa(this.databaseId.toString());
              // this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              if(this.iscrossDbSelect){
                this.selectedHirchyIdCrsDb = this.databaseId
                this.connectCrossDbs();
              }else if(this.datasourceSwitchUI){
                  this.switchDatabase();
              }else{
            // --- Smart Dashboard Prompt for NinjaRMM ---
            Swal.fire({
              position: "center",
              iconHtml: '<img src="./assets/images/copilot.gif">',
              title: "Create smart dashboard from your data with just one click?",
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'Skip',
              customClass: {
                icon: 'no-icon-bg',
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.templateDashboardService.buildSampleNinjaRMMDashboard(this.container, this.databaseId);
              } else {
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            });
            // --- End Smart Dashboard Prompt ---
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

    ImmybotSignIn(){
      const obj={
        "client_id":this.clientIdImmybot,
        "secret_value":this.secretValue,
        "azure_domain":this.tenantId,
        "instance_subdomain":this.subDomain,
        "display_name":this.displayName
    }
      this.workbechService.immyBotConnection(obj).subscribe({next: (responce) => {
        console.log(responce)
            if(responce){
              this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
              this.databaseId=responce?.hierarchy_id;
              this.modalService.dismissAll();
              if(!this.datasourceSwitchUI){
              this.openImmybot = false;
              }
              const encodedId = btoa(this.databaseId.toString());
              // this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              if(this.iscrossDbSelect){
                this.selectedHirchyIdCrsDb = this.databaseId
                this.connectCrossDbs();
              }else if(this.datasourceSwitchUI){
                  this.switchDatabase();
              } else {
            // --- Smart Dashboard Prompt for Immybot ---
            Swal.fire({
              position: "center",
              iconHtml: '<img src="./assets/images/copilot.gif">',
              title: "Create smart dashboard from your data with just one click?",
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'Skip',
              customClass: {
                icon: 'no-icon-bg',
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.templateDashboardService.buildSampleImmybotDashboard(this.container, this.databaseId);
              } else {
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            });
            // --- End Smart Dashboard Prompt ---
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
              if(!this.datasourceSwitchUI){
              this.openConnectWiseForm = false;
              }
              const encodedId = btoa(this.databaseId.toString());
              // this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              if(this.iscrossDbSelect){
                this.selectedHirchyIdCrsDb = this.databaseId
                this.connectCrossDbs();
              }else{
              // this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              Swal.fire({
                position: "center",
                // icon: "question",
                iconHtml: '<img src="./assets/images/copilot.gif">',
                title: "Create smart dashboard from your data with just one click?",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Skip',
                customClass: {
                  icon: 'no-icon-bg',
                }
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
              if(!this.datasourceSwitchUI){
              this.openHaloPSAForm = false;
              }
              const encodedId = btoa(this.databaseId.toString());
              // this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              if(this.iscrossDbSelect){
                this.selectedHirchyIdCrsDb = this.databaseId
                this.connectCrossDbs();
              }else{
              // this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              Swal.fire({
                position: "center",
                iconHtml: '<img src="./assets/images/copilot.gif">',
                title: "Create smart dashboard from your data with just one click?",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Skip',
                customClass: {
                  icon: 'no-icon-bg',
                }
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

    tallySignIn(){
      const obj = {
        "token_key": this.tallyToken,
        "display_name": this.displayName
      }
      this.workbechService.createTally(obj).subscribe({next: (res)=>{
        if(res){
          this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
          this.databaseId = res?.hierarchy_id;
          this.modalService.dismissAll();
          if(!this.datasourceSwitchUI){
          this.openTallyForm = false;
          }
          const encodedId = btoa(this.databaseId.toString());
          if(this.iscrossDbSelect){
            this.selectedHirchyIdCrsDb = this.databaseId
            this.connectCrossDbs();
          }else if(this.datasourceSwitchUI){
            this.switchDatabase();
          }else{
    Swal.fire({
          position: "center",
          iconHtml: '<img src="./assets/images/copilot.gif">',
          title: "Create smart dashboard from your data with just one click?",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Skip',
          customClass: {
            icon: 'no-icon-bg',
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.templateDashboardService.buildSampleTallyDashboard(this.container, this.databaseId);
          } else {
            this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
          }
        });          }
        }
      }, error: (error)=>{
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
      }});
    }

    openAISignIn(){
      const obj = {
        "open_ai_key": this.openAiKey,
        "display_name": this.displayName
      }
      this.workbechService.openAiConnection(obj).subscribe({next:(res)=>{
        if(res){
          this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
          this.databaseId = res?.hierarchy_id;
          this.modalService.dismissAll();
          if(!this.datasourceSwitchUI){
            this.openOpenAIForm = false;
          }
          const encodedId = btoa(this.databaseId.toString());
          if(this.iscrossDbSelect){
            this.selectedHirchyIdCrsDb = this.databaseId;
            this.connectCrossDbs();
          }else if(this.datasourceSwitchUI){
            this.switchDatabase();
          }else{
            Swal.fire({
                title: '✨ Ready to Build Your AI Adoption Dashboard?',
                html: `
                  <img src="./assets/images/copilot.gif">
                  <p style="font-size: 16px;">Let AI turn your data into insights — instantly.</p>
                `,
                showCancelButton: true,
                confirmButtonText: 'Yes, Generate It!',
                cancelButtonText: 'Skip for Now',
                confirmButtonColor: '#007bff',
                cancelButtonColor: '#e0e0e0',
                reverseButtons: true,
                customClass: {
                  popup: 'rounded-lg',
                  title: 'font-semibold',
                  htmlContainer: 'text-gray-600',
                }
              }).then((result) => {
              if (result.isConfirmed) {
                this.templateDashboardService.buildSampleOpenAIDashboard(this.container, this.databaseId);
              } else {
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            });
          }
        }
      }, error:(error)=>{
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
      }});
    }

    deepSeekSignIn(){
      const obj = {
        "deepseek_key": this.deepSeekKey,
        "display_name": this.displayName
      }
      this.workbechService.deepSeekConnection(obj).subscribe({next:(res)=>{
        if(res){
          this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
          this.databaseId = res?.hierarchy_id;
          this.modalService.dismissAll();
          if(!this.datasourceSwitchUI){
            this.openDeepSeekForm = false;
          }
          const encodedId = btoa(this.databaseId.toString());
          if(this.iscrossDbSelect){
            this.selectedHirchyIdCrsDb = this.databaseId;
            this.connectCrossDbs();
          }else if(this.datasourceSwitchUI){
            this.switchDatabase();
          }else{
            this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);

            // Swal.fire({
            //     title: '✨ Ready to Build Your AI Adoption Dashboard?',
            //     html: `
            //       <img src="./assets/images/copilot.gif">
            //       <p style="font-size: 16px;">Let AI turn your data into insights — instantly.</p>
            //     `,
            //     showCancelButton: true,
            //     confirmButtonText: 'Yes, Generate It!',
            //     cancelButtonText: 'Skip for Now',
            //     confirmButtonColor: '#007bff',
            //     cancelButtonColor: '#e0e0e0',
            //     reverseButtons: true,
            //     customClass: {
            //       popup: 'rounded-lg',
            //       title: 'font-semibold',
            //       htmlContainer: 'text-gray-600',
            //     }
            //   }).then((result) => {
            //   if (result.isConfirmed) {
            //     this.templateDashboardService.buildSampleOpenAIDashboard(this.container, this.databaseId);
            //   } else {
            //     this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
            //   }
            // });
          }
        }
      }, error:(error)=>{
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
      }});
    }

    geminiSignIn(){
      const obj = {
        "gemini_key": this.geminiKey,
        "display_name": this.displayName
      }
      this.workbechService.geminiConnection(obj).subscribe({next:(res)=>{
        if(res){
          this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
          this.databaseId = res?.hierarchy_id;
          this.modalService.dismissAll();
          if(!this.datasourceSwitchUI){
            this.openGeminiForm = false;
          }
          const encodedId = btoa(this.databaseId.toString());
          if(this.iscrossDbSelect){
            this.selectedHirchyIdCrsDb = this.databaseId;
            this.connectCrossDbs();
          }else if(this.datasourceSwitchUI){
            this.switchDatabase();
          }else{
            this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
          }
        }
      }, error:(error)=>{
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
      }});
    }

    hubspotSignIn(){
      const obj = {
        "client_id": this.hubspotClientId,
        "client_secret": this.hubspotClientSecret,
        "redirect_uri": this.hubspotRedirectURL,
        "display_name": this.displayName,
        "scopes": this.selectedHubspotScopes
      }
      this.workbechService.hubspotConnection(obj).subscribe({next:(data)=>{
          if(data){
            localStorage.setItem('hubspotHierarchyId', data.hierarchy_id);
            this.modalService.dismissAll();
            this.document.location.href = data.authorisation_url;
          }
        },
        error:(error)=>{
          this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
        }});
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
                 if(!this.datasourceSwitchUI){
                 this.openMySqlForm = false;
                 }
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
                  if(!this.datasourceSwitchUI){
                  this.openMicrosoftSqlServerForm = false;
                  }
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
                  if(!this.datasourceSwitchUI){
                  this.openSnowflakeServerForm = false;
                  }
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

    openSapHana(){
      this.openSapHanaForm = true;
      this.databaseconnectionsList = false;
      this.viewNewDbs = false;
      this.emptyVariables();
      this.selectedSchema = this.SAP_DEFAULT_SCHEMA;
    }

    sapHanaSignIn(){
      const obj:any = {
          "database_type":"sap hana",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
      };
      if(this.postGreDatabaseName){
        obj.database = this.postGreDatabaseName;
      }
      if(this.selectedSchema){
        obj.schema = this.selectedSchema;
      }
          this.workbechService.postGreSqlConnection(obj).subscribe({next: (responce) => {
                if(responce){
                  this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                  this.databaseId=responce.database?.hierarchy_id;
                  this.modalService.dismissAll();
                  if(!this.datasourceSwitchUI){
                  this.openSapHanaForm = false;
                  }
                  const encodedId = btoa(this.databaseId.toString());
                  if(this.iscrossDbSelect){
                    this.selectedHirchyIdCrsDb = this.databaseId;
                    this.connectCrossDbs();
                  }else if(this.datasourceSwitchUI){
                    this.switchDatabase();
                  }else{
                    this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
                  }
                }
              },
              error: (error) => {
                console.log(error);
                this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'});
              }
            }
          )
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
                if(!this.datasourceSwitchUI){
                this.ibmDb2Form = false;
                }
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
    connectToGoogleAnalytics(){

      if (!this.isGoogleAnalyticsFormValid()) {
        this.toasterservice.error('Please fill in all required Google Analytics fields correctly.', 'Validation Error', {
          positionClass: 'toast-top-center'
        });
        return;
      }
      const g = this.googleAnalytics;
     const obj = { type: g.type,
      project_id: g.project_id,
      private_key_id: g.private_key_id,
      private_key: g.private_key,
      client_email: g.client_email,
      client_id: g.client_id,
      client_x509_cert_url: g.client_x509_cert_url,
      property_id: g.property_id,
      dimensions: g.dimensions, // Array of strings
      metrics: g.metrics,
      display_name:g.displayname
     }
        this.workbechService.googleAnalyticsConnectionApi(obj).subscribe({next: (responce) => {
          console.log(responce)
              if(responce){
                this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                this.databaseId=responce.parent_id
                this.modalService.dismissAll();
                this.openGoogleAnalyticsForm = false;
                const encodedId = btoa(this.databaseId.toString());
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            },
            // error: (error) => {
            //   console.log(error);
            //   this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            // }
            error: (error) => {
              console.log(error);
              if(error.error.error){
              // this.toasterservice.error(error.error.error,'error',{ positionClass: 'toast-center-center'})
              Swal.fire({
                icon: 'error',
                title: 'oops!',
                text: error.error.error,
                width: '400px',
              })
              }else {
                      this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
        
              }
          }
          }
        )
    }
        
    triggerFileUpload(value:any) {
      if(value === 'csv'){
      this.fileInput.nativeElement.click();
      }else if(value === 'excel'){
        this.fileInput1.nativeElement.click();
      }
    }

    pax8SignIn(){
      const obj = {
        "client_id": this.pax8ClientId,
        "client_secret": this.pax8ClientSecret,
        "display_name": this.displayName
      }
      this.workbechService.pax8Connection(obj).subscribe({next: (responce) => {
        if(responce){
          this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
          this.databaseId = responce?.hierarchy_id;
          this.modalService.dismissAll();
          if(!this.datasourceSwitchUI){
            this.openPax8Form = false;
          }
          const encodedId = btoa(this.databaseId.toString());
          if(this.iscrossDbSelect){
            this.selectedHirchyIdCrsDb = this.databaseId;
            this.connectCrossDbs();
          }else if(this.datasourceSwitchUI){
            this.switchDatabase();
          }else{
            Swal.fire({
              position: "center",
              iconHtml: '<img src="./assets/images/copilot.gif">',
              title: "Create smart dashboard from your data with just one click?",
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'Skip',
              customClass: {
                icon: 'no-icon-bg',
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.workbechService.buildSamplePaxDashboard(this.databaseId).subscribe({
                  next: (dashboardData) => {
                    this.createSmartDashboard(dashboardData,'pax8');
                  },
                  error: (error) => {
                    this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'});
                  }
                });
              } else {
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            });
          }
        }
      },
      error:(error)=>{
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
        console.log(error);
      }})
    }

    bambooHRSignIn(){
      const obj = {
        "api_key": this.bambooHRApiKey,
        "display_name": this.displayName,
        "domain": this.bambooHRDomain
      }
      this.bambooHRService.createIntegration(obj).subscribe({next: (responce) => {
        if(responce){
          this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
          this.databaseId = responce?.hierarchy_id;
          this.modalService.dismissAll();
          if(!this.datasourceSwitchUI){
            this.openBambooHRForm = false;
          }
          const encodedId = btoa(this.databaseId.toString());
          if(this.iscrossDbSelect){
            this.selectedHirchyIdCrsDb = this.databaseId;
            this.connectCrossDbs();
          }else if(this.datasourceSwitchUI){
            this.switchDatabase();
          }else{
            Swal.fire({
              position: "center",
              iconHtml: '<img src="./assets/images/copilot.gif">',
              title: "Create smart dashboard from your data with just one click?",
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'Skip',
              customClass: {
                icon: 'no-icon-bg',
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.workbechService.buildSampleBambooHRDashboard(this.databaseId).subscribe({
                  next: (dashboardData) => {
                    this.createSmartDashboard(dashboardData,'bamboohr');
                  },
                  error: (error) => {
                    this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'});
                  }
                });
              } else {
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            });
          }
        }
      },
      error:(error)=>{
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
        console.log(error);
      }})
    }

    createSmartDashboard(dashboardData:any, source:string){
      switch(source){
        case 'pax8':
          this.templateDashboardService.buildSamplePaxDashboard(this.container, this.databaseId, dashboardData);
          break;
        case 'bamboohr':
          this.templateDashboardService.buildSampleBambooHRDashboard(this.container, this.databaseId, dashboardData);
          break;
        case 'connectwise':
          this.templateDashboardService.buildSampleConnectWiseDashboard(this.container, this.databaseId, dashboardData);
          break;
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


      onDragOver(event: DragEvent) {
          event.preventDefault();
          event.stopPropagation();
        }

        onDragLeave(event: DragEvent) {
          event.preventDefault();
          event.stopPropagation();
        }

        onDropCsv(event: DragEvent) {
          event.preventDefault();
          event.stopPropagation();
          if (!this.canUploadCsv) return;

          const files = event.dataTransfer?.files;
          if (files && files.length) {
            // Create a mock event to reuse uploadfileCsv logic
            const fileEvent = { target: { files } };
            this.uploadfileCsv(fileEvent, 'upload', {});
          }
        }
         onDropExcel(event: DragEvent) {
          event.preventDefault();
          event.stopPropagation();
          if (!this.canUploadExcel) return;

          const files = event.dataTransfer?.files;
          if (files && files.length) {
            // Create a mock event to reuse uploadfileExcel logic
            const fileEvent = { target: { files } };
            this.uploadfileExcel(fileEvent, 'upload', {});
          }
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
    } else if (this.databaseType == "ninja") {
       this.displayName = editData.display_name;
       this.ninjaRMMClientid = editData.client_id;
       this.ninjaRMMClientSecret = editData.client_secret;
       this.selectedNinjaRMMScopes = editData.scopes;
    }
    else if (this.databaseType == "halops") {
      this.siteURLPSA = editData.site_url;
      this.clientIdPSA = editData.client_id;
      this.clientSecret = editData.client_secret;
      this.displayName = editData.display_name;
    } else if (this.databaseType == "pax8") {
      this.pax8ClientId = editData.client_id;
      this.pax8ClientSecret = editData.client_secret;
      this.displayName = editData.display_name;
    } else if (this.databaseType == "bamboohr") {
      this.bambooHRApiKey = editData.api_key;
      this.bambooHRDomain = editData.domain;
      this.displayName = editData.display_name;
    }  else if (this.databaseType == "immybot") {
      this.clientIdImmybot = editData.client_id;
      this.secretValue = editData.secret_value;
      this.tenantId = editData.azure_domain;
      this.subDomain = editData.instance_subdomain;
      this.displayName = editData.display_name;
    } else if(this.databaseType == "shopify"){
      this.displayName = editData.display_name;
      this.shopifyName = editData.shop_name;
      this.shopifyToken = editData.api_token;
    } else if (this.databaseType == "tally") {
      this.displayName = editData.display_name;
      this.tallyToken = editData.token_key;
    } else if (this.databaseType == "open_ai") {
      this.displayName = editData.display_name;
      this.openAiKey = editData.open_ai_key;
    } else if (this.databaseType == "deepseek") {
      this.displayName = editData.display_name;
      this.deepSeekKey = editData.deepseek_key;
    } else if (this.databaseType == "gemini") {
      this.displayName = editData.display_name;
      this.geminiKey = editData.gemini_key;
    }else if (this.databaseType === 'google_analytics') {
      this.googleAnalytics = {
        type: 'service_account',
        project_id: editData.project_id || '',
        private_key_id: editData.private_key_id || '',
        private_key: editData.private_key || '',
        client_email: editData.client_email || '',
        client_id: editData.client_id || '',
        client_x509_cert_url: editData.client_x509_cert_url || '',
        property_id: editData.property_id || '',
        dimensions: [...editData.dimensions],
        metrics: [...editData.metrics],
        displayname: editData.display_name || ''
      };
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
      if(this.databaseType == 'postgresql' || this.databaseType == 'sap hana'){
        this.selectedSchema = editData.schema || (this.databaseType === 'sap hana' ? this.SAP_DEFAULT_SCHEMA : 'public');
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
    if(this.callAllConnectionsExistingList){
      this.connectionListWithOutPagination();
    }
    // this.getDbConnectionList();
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
   onPageSizeChange() {
  // Reset to page 1 if you're on the last page and items may not fit
  const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  if (this.pageNo > totalPages) {
    this.pageNo = 1;
    this.page=1;
  }
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
        this.totalItems = data.total_items;
        this.connectionsCount = data.connection_count;
        this.datasetsCount = data.queries_count;
        this.recentSyncCount = data.recent_count;
        this.alertsCount = data.alerts_count;
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
  connectionListWithOutPagination(){
      const Obj ={
        need_pagination:false
    }
     this.workbechService.getdatabaseConnectionsList(Obj).subscribe({
      next:(data)=>{
        console.log(data);
        this.existingConnectionListWithoutFilter = data;
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
  this.openNinjaRMMForm = false;
  this.openImmybot = false;
  this.viewNewDbs=true;
  this.openMySqlForm=false;
  this.openOracleForm = false;
  this.openMongoDbForm = false;
  this.openMicrosoftSqlServerForm = false;
  this.openSnowflakeServerForm = false;
  this.ibmDb2Form= false;
  this.openSapHanaForm = false;
  this.sqlLiteForm = false;
  this.openConnectWiseForm = false;
  this.openHaloPSAForm = false;
  this.openPax8Form = false;
  this.openBambooHRForm = false;
  this.openShopifyForm = false;
  this.openTallyForm = false;
  this.openOpenAIForm = false;
  this.openDeepSeekForm = false;
  this.openGeminiForm = false;
  this.openHubspotForm = false;
  this.openGoogleAnalyticsForm = false;
  this.openGoogleAnalyticsForm = false;
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
  this.tallyToken = '';
  this.tallyTokenError = false;
  this.openAiKey = '';
  this.openAiKeyError = false;
  this.deepSeekKey = '';
  this.deepSeekKeyError = false;
  this.geminiKey = '';
  this.geminiKeyError = false;
  this.ninjaRMMClientid = '';
  this.ninjaRMMClientSecret = '';
  this.selectedNinjaRMMScopes = [];
  this.hubspotClientId = '';
  this.hubspotClientSecret = '';
  this.selectedHubspotScopes = [];
  this.hubspotRedirectURL = '';
  this.hubspotRedirectURLError = false;
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
  pax8ClientIdError:boolean = false;
  pax8ClientSecretError:boolean = false;
  bambooHRApiKeyError:boolean = false;
  bambooHRDomainError:boolean = false;
  privateKeyError:boolean = false;
  publicKeyError:boolean = false;
  companyIDError:boolean = false;
  disableConnectBtn = true;

  shopifyApiTokenError:boolean = false;
  shopifyNameError:boolean = false;
  tallyTokenError:boolean = false;
  openAiKeyError:boolean = false;
  deepSeekKeyError:boolean = false;
  geminiKeyError:boolean = false;

  serverConditionError(){
    if(this.schemaList && this.schemaList.length > 0){
      this.selectedSchema = this.openSapHanaForm ? this.SAP_DEFAULT_SCHEMA : 'public';
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
      this.selectedSchema = this.openSapHanaForm ? this.SAP_DEFAULT_SCHEMA : 'public';
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
      this.selectedSchema = this.openSapHanaForm ? this.SAP_DEFAULT_SCHEMA : 'public';
      this.schemaList = [];
    }
    if(this.openSapHanaForm || this.databaseType === 'sap hana'){
      if(this.postGreDatabaseName || this.selectedSchema){
        this.databaseError = false;
      }else{
        this.databaseError = true;
      }
    } else {
      if (this.postGreDatabaseName) {
        this.databaseError = false;
      } else {
        this.databaseError = true;
      }
    }
    this.portConditionError();
    this.errorCheck();
  }
  userNameConditionError(){
    if(this.schemaList && this.schemaList.length > 0){
      this.selectedSchema = this.openSapHanaForm ? this.SAP_DEFAULT_SCHEMA : 'public';
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
      this.selectedSchema = this.openSapHanaForm ? this.SAP_DEFAULT_SCHEMA : 'public';
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
    else if(this.openSapHanaForm){
      if(this.serverError || this.portError || this.userNameError || this.displayNameError || this.passwordError || this.databaseError){
        this.disableConnectBtn = true;
      } else if(!(this.postGreServerName && this.postGrePortName && this.postGreUserName && this.displayName && this.PostGrePassword && (this.postGreDatabaseName || this.selectedSchema))) {
        this.disableConnectBtn = true;
      } else{
        this.disableConnectBtn = false;
      }
    }
    else if(this.databaseType === 'sap hana'){
      if(this.serverError || this.portError || this.userNameError || this.displayNameError || this.passwordError || this.databaseError){
        this.disableConnectBtn = true;
      } else if(!(this.postGreServerName && this.postGrePortName && this.postGreUserName && this.displayName && this.PostGrePassword && (this.postGreDatabaseName || this.selectedSchema))) {
        this.disableConnectBtn = true;
      } else{
        this.disableConnectBtn = false;
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

  onNinjaRMMScopeChange(event: any) {
    this.selectedNinjaRMMScopes = event;
    this.ninjaRMMScopeError = this.selectedNinjaRMMScopes.length <= 0;
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
    const obj:any = {
      "database_type": (this.openSapHanaForm || this.databaseType === 'sap hana') ? "sap hana" : "postgresql",
      "hostname": this.postGreServerName,
      "port": this.postGrePortName,
      "username": this.postGreUserName,
      "password": this.PostGrePassword,
      "display_name": this.displayName
    };
    if(this.postGreDatabaseName){
      obj.database = this.postGreDatabaseName;
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
  switchDatabase(){
    const obj ={
      existing_h_id:this.selectedSourceSwithDbId,
      switch_h_id:this.databaseId,
      dashboard_id:this.dashbaordIdToSwitch
    }
    this.workbechService.datbaseSwitch(obj).subscribe({
      next:(data)=>{
        console.log(data);
        if(data.message ==='Datasource switched successfully'){
          const encodedDashboardId = btoa(this.dashbaordIdToSwitch.toString());
          this.router.navigate(['/analytify/home/sheetsdashboard/',encodedDashboardId],{state: {dbSwitched: true}})
        }
      },
      error:(error)=>{
        console.log(error);
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' })
      }
    })
  }

  smartDashboardFromConnection(database:any){
    let request$;
    if(database.server_type === 'PAX8'){
      request$ = this.workbechService.buildSamplePaxDashboard(database.hierarchy_id);
    }else if(database.server_type === 'BAMBOOHR'){
      request$ = this.workbechService.buildSampleBambooHRDashboard(database.hierarchy_id);
    }else{
      request$ = this.workbechService.createSmartDashboard(database.hierarchy_id);
    }
    request$.subscribe({
      next: (responce) => {
        switch(database.server_type){
          case 'TALLY':
            this.templateDashboardService.buildSampleTallyDashboard(this.container, database.hierarchy_id, responce);
            break;
          case 'SHOPIFY':
            this.templateDashboardService.buildSampleShopifyDashboard(this.container, database.hierarchy_id, responce);
            break;
          case 'SALESFORCE':
            this.templateDashboardService.buildSampleSalesforceDashboard(this.container, database.hierarchy_id, responce);
            break;
          case 'QUICKBOOKS':
            this.templateDashboardService.buildSampleQuickbooksDashboard(this.container, database.hierarchy_id, responce);
            break;
          case 'IMMYBOT':
            this.templateDashboardService.buildSampleImmybotDashboard(this.container, database.hierarchy_id, responce);
            break;
          case 'NINJA':
            this.templateDashboardService.buildSampleNinjaRMMDashboard(this.container, database.hierarchy_id, responce);
            break;
          case 'HUBSPOT':
            this.templateDashboardService.buildSampleHubspotDashboard(this.container, database.hierarchy_id, responce);
            break;
          case 'CONNECTWISE':
            this.createSmartDashboard(responce,'connectwise');
            break;
          case 'HALOPS':
            this.templateDashboardService.buildSampleHALOPSADashboard(this.container, database.hierarchy_id, responce);
            break;
          case 'PAX8':
            this.createSmartDashboard(responce,'pax8');
            break;
          case 'BAMBOOHR':
            this.createSmartDashboard(responce,'bamboohr');
            break;
          case 'OPEN_AI':
            this.templateDashboardService.buildSampleOpenAIDashboard(this.container, database.hierarchy_id, responce);
            break;
          case 'DEEPSEEK':
            this.templateDashboardService.buildSampleOpenAIDashboard(this.container, database.hierarchy_id, responce);
            break;
          case 'GEMINI':
            this.templateDashboardService.buildSampleOpenAIDashboard(this.container, database.hierarchy_id, responce);
            break;
        }
      },
      error: (error) => {
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
      }
    })
  }
  gotoDashboardWithoutSwitch(){
    const encodedDashboardId = btoa(this.dashbaordIdToSwitch.toString());
    this.router.navigate(['/analytify/home/sheetsdashboard/',encodedDashboardId])
  }
  gotoConfigureEmailAlerts(id:any){
    const encodedId = btoa(id.toString());
    this.router.navigate(['/analytify/configure-page/email/datasource/' + encodedId]);
  }




skeletons = Array(6); // show 3 skeleton cards while loading
  searchQuery: string = '';
  showNewConnection: boolean = false;
  selectedCategory: string | null = null;
  selectedConnectionType: string | null = null;

  connectionListIcons: any = {
    postgresql: { type: 'emoji', value: '🐘' },
    oracle: { type: 'emoji', value: '🏺' },
    mysql: { type: 'emoji', value: '🐬' },
    microsoftsqlserver: { type: 'emoji', value: '🖥️' },
    snowflake: { type: 'emoji', value: '❄️' },
    mongodb: { type: 'emoji', value: '🍃' },
    'sap hana': { type: 'emoji', value: '⚡' },
    quickbooks: { type: 'emoji', value: '💵' },
    ninja: { type: 'emoji', value: '🐱‍👤' },
    tally: { type: 'emoji', value: '📒' },
    csv: {type: 'emoji', value: '📑'},
    excel: {type: 'emoji', value: '📊'},
    google_analytics: {type: 'emoji', value: '📈'},
    halops: {type: 'emoji', value: '🛡️'},
    pax8: {type: 'emoji', value: '🌍'},
    connectwise: {type: 'emoji', value: '🔧'},
    shopify: {type: 'emoji', value: '🛍️'},
    open_ai: {type: 'emoji', value: '🤖'},
    immybot: {type: 'svg', value: `<svg width="48" height="47" viewBox="0 0 24 24" aria-label="Immybot icon" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient for bot body -->
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5fd4ff"/>
      <stop offset="1" stop-color="#7b6cff"/>
    </linearGradient>
  </defs>

  <!-- Bot head -->
  <rect x="3" y="5" width="18" height="15" rx="7" fill="url(#g)"/>
  <!-- Antenna nub -->
  <rect x="16.6" y="3" width="2.8" height="4" rx="1.4" fill="url(#g)"/>

  <!-- Visor -->
  <rect x="6.8" y="9" width="10.4" height="7" rx="3.5" fill="#0b0b0e" opacity="0.9"/>

  <!-- Eyes -->
  <circle cx="10" cy="12.5" r="0.9" fill="#ffffff"/>
  <circle cx="14" cy="12.5" r="0.9" fill="#ffffff"/>

  <!-- Smile -->
  <path d="M10.1 14.3c.5.5 1.2.8 1.9.8s1.4-.3 1.9-.8" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>
</svg>`},
  };
  existingConnections: any = [];
  getSpecificConnections(){
    this.existingConnections = this.existingConnectionListWithoutFilter.filter((connection:any) => connection.database_type === (this.selectedConnection?.toLocaleLowerCase() || ''));
  }
  handleCategoryClick(category: string) {
    this.selectedCategory = category;
  }

  handleBackToCategories() {
    this.selectedCategory = null;
    this.selectedConnectionType = null;
  }

  handleBackToConnections() {
    this.showNewConnection = false;
    this.selectedCategory = null;
    this.selectedConnectionType = null;
  }

  handleConnectionTypeSelect(type: string) {
    this.selectedConnectionType = type;
  }

 categories = [
    { name: 'Relational Database', icon: '🛢️', description: 'Traditional SQL databases like MySQL, PostgreSQL',count:'5' },
    { name: 'LLM Integrations', icon: '🤖', description: 'AI & Large Language Model integrations',count:'6' },
    { name: 'Multi-dimensional Database', icon: '📊', description: 'OLAP & analytical data stores',count:'2' },
    { name: 'NoSQL Database', icon: '📡', description: 'Document, Key-Value, Graph & Wide-column databases',count:'3' },
    { name: 'File Source', icon: '📂', description: 'CSV, Excel & JSON files',count:'2' },
    { name: 'Integrations', icon: '🔗', description: 'Third-party services',count:'15' }
  ];
  showRelational = false;
  showLLM = false;
  showMultiDim = false;
  showNoSQL = false;
  showFiles = false;
  showIntegrations = false;
  categorySelect(categoryName: string){
    this.selectedCategory = categoryName;
    console.log(this.selectedCategory);
      this.viewNewDbs = false;
      this.showRelational = false;
      this.showLLM = false;
      this.showMultiDim = false;
      this.showNoSQL = false;
      this.showFiles = false;
      this.showIntegrations = false;
        switch (categoryName) {
          case 'Relational Database':
            this.showRelational = true;
            break;
          case 'LLM Integrations':
            this.showLLM = true;
            break;
          case 'Multi-dimensional Database':
            this.showMultiDim = true;
            break;
          case 'NoSQL Database':
            this.showNoSQL = true;
            break;
          case 'Files Source':
            this.showFiles = true;
            break;
          case 'Integrations':
            this.showIntegrations = true;
            break;
  }
  }
  getSafeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
connectionTypes: { [key: string]: { name: string; icon?: string; description: string ;image?:string;svg?:string,disabled?:boolean}[] } = {
  "Relational Database": [
    { name: "MySQL", icon: "🐬", description: "Relational database" },
    { name: "ORACLE", icon: "🏺", description: "Enterprise relational database" },
    { name: "PostgreSQL", icon: "🐘", description: "Advanced open-source relational database" },
    { name: "Microsoft SQL SERVER", icon: "🖥️", description: "Microsoft relational database" },
    { name: "Snow Flake", icon: "❄️", description: "Cloud data warehouse" }
  ],
  "LLM Integrations": [
    { name: "OpenAI", icon: "🤖", description: "AI & language models by OpenAI" },
    { name: "DeepSeek", icon: "🔍", description: "Deep learning & LLM platform" },
    { name: "Gemini", icon: "♊", description: "Google DeepMind Gemini models" },
    { name: "Anthropic", icon: "🌐", description: "Claude AI models", disabled: true },
    { name: "Azure OpenAI", icon: "☁️", description: "Azure-hosted OpenAI models", disabled: true },
    { name: "Meta LLaMA", icon: "🦙", description: "Meta’s LLaMA family of LLMs", disabled: true }
  ],
  "NoSQL Database": [
    { name: "Cassandra", icon: "🌌", description: "Highly scalable NoSQL database", disabled: true },
    { name: "SQLite", icon: "💾", description: "Lightweight embedded database" },
    { name: "MongoDB", icon: "🍃", description: "Document-oriented NoSQL database", disabled: true }
  ],
  "Multi-dimensional Database": [
    { name: "SAP", icon: "🏢", description: "Enterprise resource planning & database", disabled: true },
    { name: "SAP HANA", icon: "⚡", description: "In-memory, column-oriented database" }
  ],
  "File Source": [
    { name: "CSV File", icon: "📑", description: "Comma-separated values file" },
    { name: "Excel File", icon: "📊", description: "Spreadsheet file format" }
  ],
  "Integrations": [
    { name: "xAmplify",icon:"🔗", description: "Business automation platform" },
    { name: "QuickBooks", icon: "💵", description: "Accounting software" },
    { name: "Salesforce", icon: "☁️", description: "CRM platform" },
    { name: "ConnectWise", icon: "🔧", description: "IT management software" },
    { name: "HaloPSA", icon: "🛡️", description: "PSA platform for IT providers" },
    { name: "Pax8", icon: "🌍", description: "Cloud commerce marketplace" },
    { name: "BambooHR", icon: "👥", description: "HR management system" },
    { name: "Jira", icon: "📌", description: "Project management software" },
    { name: "Shopify", icon: "🛍️", description: "E-commerce platform" },
    { name: "Tally", icon: "📒", description: "Accounting & ERP software" },
    { name: "Google Sheets", icon: "📄", description: "Online spreadsheets" },
    { name: "NinjaOne", icon: "🐱‍👤", description: "IT management & automation tool" },
    { name: "Google Analytics", icon: "📈", description: "Web analytics service" },
    { name: "HubSpot", icon: "📢", description: "Marketing & CRM platform" },
    { name: "Immybot", description: "IT automation tool",svg:`<svg width="48" height="47" viewBox="0 0 24 24" aria-label="Immybot icon" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient for bot body -->
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5fd4ff"/>
      <stop offset="1" stop-color="#7b6cff"/>
    </linearGradient>
  </defs>

  <!-- Bot head -->
  <rect x="3" y="5" width="18" height="15" rx="7" fill="url(#g)"/>
  <!-- Antenna nub -->
  <rect x="16.6" y="3" width="2.8" height="4" rx="1.4" fill="url(#g)"/>

  <!-- Visor -->
  <rect x="6.8" y="9" width="10.4" height="7" rx="3.5" fill="#0b0b0e" opacity="0.9"/>

  <!-- Eyes -->
  <circle cx="10" cy="12.5" r="0.9" fill="#ffffff"/>
  <circle cx="14" cy="12.5" r="0.9" fill="#ffffff"/>

  <!-- Smile -->
  <path d="M10.1 14.3c.5.5 1.2.8 1.9.8s1.4-.3 1.9-.8" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>
</svg>`  }
  ]
};
goBackToCategories(){
  this.showRelational = false;
  this.showLLM = false;
  this.showMultiDim = false;
  this.showNoSQL = false;
  this.showFiles = false;
  this.showIntegrations = false;
  this.viewNewDbs = true;
  this.selectedCategory = null;
}

selectedConnection: string | null = null;

selectConnection(connName: string) {
  if(connName === 'xAmplify'){
    !this.iscrossDbSelect ? this.connectxAmplify() : null;
  } else if(connName === 'QuickBooks'){
    !this.iscrossDbSelect ? this.connectQuickBooks() : null;
  } else if(connName === 'Salesforce'){
    !this.iscrossDbSelect ? this.connectSalesforce() : null;
  } else if(connName === 'Jira'){
    !this.iscrossDbSelect ? this.connectJira() : null;
  } else{
    this.selectedConnection = connName;
    this.getSpecificConnections();
    console.log('selected sub category:', this.selectedConnection);
  }
}
model = {
    name: '',
    host: '',
    port: '',
    username: '',
    password: ''
  };
  // existingConnections = [  {
  //   id: 1,
  //   name: "mysql",
  //   displayName: "MySql Production",
  //   type: "mysql",
  //   status: "Connected",
  //   lastUpdated: "2 minutes ago",
  //   description: "Main production database",
  //   host: "prod-db.company.com",
  //   size: "2.4 GB",
  //   icon: "🐬"
  // },
  // {
  //   id: 2,
  //   name: "MySQL",
  //   displayName: "MySQL Analytics",
  //   type: "MySQL",
  //   status: "Connected",
  //   lastUpdated: "10 minutes ago",
  //   description: "Analytics DB for reports",
  //   host: "analytics.company.com",
  //   size: "850 MB",
  //   icon: "🐬"
  // },]as any;
   saveConnection() {
    console.log('Saving connection:', this.model);
    alert('Connection saved!');
  }

  goBackToSubCategories(){
  this.showRelational = false;
  this.showLLM = false;
  this.showMultiDim = false;
  this.showNoSQL = false;
  this.showFiles = false;
  this.showIntegrations = false;
  this.viewNewDbs = false;
  this.selectedConnection = null;
//old
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
  this.tallyToken = '';
  this.tallyTokenError = false;
  this.openAiKey = '';
  this.openAiKeyError = false;
  this.deepSeekKey = '';
  this.deepSeekKeyError = false;
  this.ninjaRMMClientid = '';
  this.ninjaRMMClientSecret = '';
  this.selectedNinjaRMMScopes = [];
  this.hubspotClientId = '';
  this.hubspotClientSecret = '';
  this.selectedHubspotScopes = [];
  this.hubspotRedirectURL = '';
  this.hubspotRedirectURLError = false;
//
     switch (this.selectedCategory) {
          case 'Relational Database':
            this.showRelational = true;
            break;
          case 'LLM Integrations':
            this.showLLM = true;
            break;
          case 'Multi-dimensional Database':
            this.showMultiDim = true;
            break;
          case 'NoSQL Database':
            this.showNoSQL = true;
            break;
          case 'Files Source':
            this.showFiles = true;
            break;
          case 'Integrations':
            this.showIntegrations = true;
            break;
  }
  }
  getConnectionAsset(connName: string) {
  // Find the connection object from connectionTypes
  for (const category in this.connectionTypes) {
    const found = this.connectionTypes[category].find(c => c.name === connName);
    if (found) {
      if (found.icon) return { type: 'icon', value: found.icon };
      if (found.image) return { type: 'image', value: found.image };
      if (found.svg) return { type: 'svg', value: this.sanitizer.bypassSecurityTrustHtml(found.svg) };
    }
  }
  // fallback
  return { type: 'icon', value: '🔗' }; 
}
}
