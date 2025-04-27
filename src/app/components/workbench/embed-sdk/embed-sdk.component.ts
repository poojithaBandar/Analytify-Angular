import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/sharedmodule';
import { WorkbenchService } from '../workbench.service';

@Component({
  selector: 'app-embed-sdk',
  standalone: true,
  imports: [FormsModule,SharedModule, CommonModule],
  templateUrl: './embed-sdk.component.html',
  styleUrl: './embed-sdk.component.scss'
})
export class EmbedSdkComponent {
  userName!: string;
  apibaseurl!: string;
  disableSDKName : boolean = false;
  displayScript : boolean = false;
  host!: string;
  port!: string;
  selectedDashboardId!: number;
  clientId!: string;
  clientSecret! : string;
  dashboardToken! : string;
  scriptContent!: string;

  constructor(private workbechService: WorkbenchService){

  }

  getHostAndPort(): void {
    const { hostname, port } = window.location;
    this.host = hostname;
    this.port = port;
    this.apibaseurl = 'https://'+this.host+':'+this.port
  }

  getAppDetails(){
    this.workbechService.fetchSDKData().subscribe({
      next: (responce: any) => {
        console.log(responce);
        if(responce && responce[0]){
          this.userName = responce[0].app_name;
          this.apibaseurl = responce[0].redirect_url;
          this.disableSDKName = true;
        } else {
          const currentUser = localStorage.getItem( 'username' );
          this.userName = JSON.parse( currentUser! )['userName'];
          this.getHostAndPort();
        }   
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }

  ngOnInit(){
    this.getAppDetails();
    this.getDashboardsList();
  }

  dashboardList : any[] = [];
  getDashboardsList() {
    this.workbechService.getuserDashboardsList().subscribe({
      next: (responce: any) => {
        console.log(responce);
        this.dashboardList = responce;
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }

  setScriptData(){
    this.scriptContent = `
    import AnalytifySDK from 'https://cdn.jsdelivr.net/gh/Rajashekarreddy24/Analytify-Angular@v1.0.1/dist/analytify-dashboard/esm2022/lib/sdk.mjs';

    const analytify = AnalytifySDK.init({
      appName: '${this.userName}'
      clientId: '${this.clientId}',
      clientSecret: '${this.clientSecret}',
      apiBaseUrl: '${this.apibaseurl}'
    });

    analytify.loadDashboard({
      container: '#dashboard-container',
      dashboardToken: '${this.dashboardToken}',
      width: '100%',
      height: '1000px',
    });
  `;
  }

  submitSDKKeys(){
    let payload = {
      app_name: this.userName,
      redirect_url : this.apibaseurl,
      dashboard_id: this.selectedDashboardId
    }
    this.workbechService.saveSDKData(payload).subscribe({
      next: (data: any) => {
        this.clientId = data.client_id;
        this.clientSecret = data.client_secret;
        this.dashboardToken = data.dashboard_token;
        this.disableSDKName = true;
        this.displayScript = true;
        this.setScriptData();
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }
}
