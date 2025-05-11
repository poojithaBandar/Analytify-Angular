import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InsightApexComponent } from '../insight-apex/insight-apex.component';
import { InsightEchartComponent } from '../insight-echart/insight-echart.component';
import { WorkbenchService } from '../workbench.service';

@Component({
  selector: 'app-sheet-sdk',
  standalone: true,
  imports: [CommonModule, InsightApexComponent, InsightEchartComponent],
  templateUrl: './sheet-sdk.component.html',
  styleUrl: './sheet-sdk.component.scss'
})
export class SheetSdkComponent {
  sheetId = '';                                                                                                       
      chartType = '';                                                                                                     
      config: any;                                                                                                        
      data: any;                                                                                                          
      loading = true;                                                                                                     
      error: string | null = null;                                                                                        
  clientId!: string;
  sheetToken!: string      
  isApexChart : boolean = false;                                                                                                      
  chartOptions: any;
  embedFilters: any;
      constructor(                                                                                                        
        private route: ActivatedRoute,                                                                                    
        private workbenchService: WorkbenchService                                                                               
      ) {}                                                                                                                
                                                                                                                          
    ngOnInit(): void {                                                                                                 

        this.sheetToken = this.route.snapshot.params['sheetToken'];
        this.clientId = this.route.snapshot.params['clientId'];
        this.route.queryParams.subscribe(params => {
          const rawFilters = params['filters'];
          if (rawFilters) {
            try {
              this.embedFilters = JSON.parse(rawFilters);
              console.log('Filters object:', this.embedFilters);
              // Expected output: { name: ['US', 'UK'], idList: [3, 4] }
            } catch (e) {
              console.error('Error parsing filters:', e);
            }
          }
        });
        let accessToken = this.route.snapshot.params['token'];
        const userToken = { Token: accessToken,};
        localStorage.setItem('currentUser', JSON.stringify(userToken));                                                         
          if (this.sheetToken) {   
            let sheetPayload = {sheet_token : this.sheetToken}
            this.workbenchService.fetchSheetId(sheetPayload).subscribe({                                                         
              next: (data:any) => {                                                                                                  
                this.sheetId = data.dashboard_id;      
                this.fetchData();                                                                       
              },                                                                                                              
              error: (err : any) => {                                                                                                 
                console.error(err);                                                                                           
                this.error = 'Failed to load chart data';                                                                     
                this.loading = false;                                                                                         
              }                                                                                                               
            });                                                                                                                                                                                                                                                                                             
          } else {                                                                                                        
            this.error = 'Sheet Token is required';                                                                          
            this.loading = false;                                                                                         
          }                                                                                                                                                                                                                           
      }  
      
      setChartType(chartId: number){
        switch (chartId) {
          case 6:
            this.chartType = 'bar';
            break;
          case 24:
            this.chartType = 'pie';
            break;
          case 11:
            this.chartType = 'line';
            break;
          case 17:
            this.chartType = 'area';
            break;
          case 7:
            this.chartType = 'sidebyside';
            break;
          case 5:
            this.chartType = 'stocked';
            break;
          case 2:
            this.chartType = 'hstocked';
            break;
          case 3:
            this.chartType = 'hgrouped';
            break;
          case 8:
            this.chartType = 'multiline';
            break;
          case 10:
            this.chartType = 'donut';
            break;
          case 27:
            this.chartType = 'funnel';
            break;
          case 28:
            this.chartType = 'guage';
            break;

          case 4:
            this.chartType = 'barline';
            break;

          case 26:
            this.chartType = 'heatmap';
            break;


        }
      }
                                                                                                                          
  fetchData(): void {
    this.loading = true;
    let filterKeys;
    let filterValues;
    let payload;
    if (this.embedFilters) {
      filterKeys = Object.keys(this.embedFilters);
      filterValues = Object.values(this.embedFilters);
      payload = {
        "filter_name": filterKeys,
        "sheet_id": this.sheetId,
        "input_list": filterValues
      }
    } else {
      let payload = { "sheet_id": this.sheetId };
    }
    this.workbenchService.getSheetSdkData(payload).subscribe({
      next: (data: any) => {
        console.log(data);
        this.isApexChart = data.sheet_retrieve_data.sheet_data.isApexChart;
        this.chartOptions = data.sheet_retrieve_data.sheet_data.savedChartOptions;
        this.setChartType(data.sheet_retrieve_data.chart_id)
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Failed to load chart data';
        this.loading = false;
      }
    });
  }       
}
