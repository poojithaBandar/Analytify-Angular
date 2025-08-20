import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbCarouselConfig, NgbCarouselModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsightsButtonComponent } from '../insights-button/insights-button.component';
import { ViewTemplateDrivenService } from '../view-template-driven.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../shared/services/loader.service';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [NgbModule,NgbCarouselModule,NgApexchartsModule,CommonModule,FormsModule,InsightsButtonComponent,NgSelectModule,TimeAgoPipe],
  templateUrl: './landingpage.component.html',
  providers: [NgbCarouselConfig],
  styleUrl: './landingpage.component.scss'
})

export class LandingpageComponent implements OnInit {
radialOptions : any = {};
treemapOptions : any = {};
barOptions: any = {};
searchDbName:any
userSheetsList :any[] =[];
savedDashboardList: any[] =[];
demoDashboardList: any[] =[];
connectionList:any[]=[];
savedQueryList:any[]=[];
showAllSheets = true;
showAllDasboards = true;
showAllSavedQueries = true;
wholeSearch:any
viewDatabbses = false;
viewSheets = false;
viewDashboardList = false;
viewCustomSql = false;
roleDetails = [] as any;
selectedRoleIds = [] as any;
selectedRoleIdsToNumbers = [] as any;
usersOnSelectedRole =[] as any;
selectedUserIds = [] as any;
selectedUserIdsToNumbers = [] as any;
dashboardPropertyTitle :any;
dashboardPropertyId:any;
dashboardId :any;
createUrl =false;
shareAsPrivate = false;
shareAsProtected = false;
protectedEmails: string[] = [];
UrlCopy:string | null = null;
publicUrl:any;
port:any;
host:any;
publishedDashboard = false;
testVariableToChange! : string ;
totalDashbaords:any;
totalSheets:any;
totalQueries:any;
totalDatabases:any;
features = [
  {
    icon: 'bi-funnel-fill',
    title: 'World-Class Query Builder',
    description: 'Drag-and-drop or SQL — build powerful queries with ease.',
    gradient: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)' // Light blue to pale blue
  },
  {
    icon: 'bi-robot',
    title: 'AI-Enhanced Analytics',
    description: 'Uncover trends and anomalies with machine learning insights.',
    gradient: 'linear-gradient(135deg, #f6d365, #fda085)' // Yellow to coral
  },
  {
    icon: 'bi-bar-chart-steps',
    title: 'Drill Down & Through Charts',
    description: 'Navigate from summary to detail across datasets effortlessly.',
    gradient: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)' // Pink to light blue
  },
  {
    icon: 'bi-diagram-3',
    title: 'Multi-Dataset Dashboards',
    description: 'Combine multiple data sources in a single, unified dashboard.',
    gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)' // Cream to peach
  },
  {
    icon: 'bi-code-slash',
    title: 'Open Source Flexibility',
    description: 'Fully customizable and transparent for dev teams.',
    gradient: 'linear-gradient(135deg, #fddb92, #d1fdff)' // Light yellow to cyan
  },
  {
    icon: 'bi-box-arrow-in-right',
    title: 'Embeddable SDK Solution',
    description: 'Seamlessly embed dashboards into your own platforms.',
    gradient: 'linear-gradient(135deg, #cfd9df, #e2ebf0)' // Light gray to pale blue
  },
  {
    icon: 'bi-cloud-arrow-down',
    title: 'Cross-Data Source Connection',
    description: 'Analyze data across SQL, NoSQL, APIs, and cloud sources.',
    gradient: 'linear-gradient(135deg, #f6d365, #fda085)' // Yellow to coral
  },
  {
    icon: 'bi-clock-history',
    title: 'Real-Time Data Access',
    description: 'Always stay updated with live, streaming data support.',
    gradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)' // Mint green to sky blue
  },
  {
    icon: 'bi-bar-chart-line',
    title: 'Customizable Visualizations',
    description: 'Create beautiful, themeable charts with full flexibility.',
    gradient: 'linear-gradient(135deg, #fccb90, #d57eeb)' // Peach to purple
  },
  {
    icon: 'bi-graph-up-arrow',
    title: 'AI Adoption Dashboard',
    description: 'Track and measure the impact of AI initiatives at a glance.',
    gradient: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)' // Light blue to pale blue
  },
  {
    icon: 'bi-plug',
    title: 'Smart Dashboards for Business Apps',
    description: 'Dashboards that connect with your tools and enable actions.',
    gradient: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)' // Pink to light blue
  },
  {
    icon: 'bi-lock',
    title: 'Passkey-Protected Sharing',
    description: 'Securely share dashboards via protected access links.',
    gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)' // Cream to peach
  },
  {
    icon: 'bi-arrow-left-right',
    title: 'Data Source Switching',
    description: 'Easily switch between sources with zero reconfiguration.',
    gradient: 'linear-gradient(135deg, #fddb92, #d1fdff)' // Light yellow to cyan
  },
  {
    icon: 'bi-lightbulb',
    title: 'GenBI Insights Summary',
    description: 'AI-generated summaries provide executive-level clarity.',
    gradient: 'linear-gradient(135deg, #cfd9df, #e2ebf0)' // Light gray to pale blue
  },
  {
    icon: 'bi-envelope-fill',
    title: 'Email Alerts for Key Actions',
    description: 'Get notified instantly when critical events happen.',
    gradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)' // Mint green to sky blue
  }
];

fixedColors = [
  '#1d2e92', // darkest
  '#007cb8',
  '#088ed1',
  '#36c1ce',
  '#52c9f6',
  '#8fe3fa'  // lightest
];

@ViewChild('propertiesModal') propertiesModal : any;
@ViewChild('sampleDashboardPropertiesModal') sampleDashboardPropertiesModal : any;


constructor(private router:Router,private workbechService:WorkbenchService,private templateService:ViewTemplateDrivenService,public modalService:NgbModal,private cdr: ChangeDetectorRef,private toasterservice:ToastrService,private loaderService : LoaderService){
  localStorage.setItem('QuerySetId', '0');
  localStorage.setItem('customQuerySetId', '0');
  this.viewDatabbses=this.templateService.viewDtabase();
  this.viewSheets = this.templateService.viewSheets();
  this.viewDashboardList = this.templateService.viewDashboard();
  this.viewCustomSql = this.templateService.viewCustomSql();
}

ngOnInit(){
  // const colors = this.normalizeColors(this.baseColors);

  this.loaderService.hide();
  if(this.viewDatabbses){
    this.getDbConnectionList();
  }if(this.viewSheets){
    this.getuserSheets();
  }if(this.viewDashboardList){
    this.getuserDashboardsList();
  }if(this.viewCustomSql){
  this.getSavedQueries();
  }
  this.getHostAndPort();
  this.getChartMetrics();
}
barChartData:any =[]
heatmapData:any=[]
radiaBarData:any=[]
recentActivityData:any = [];
loading = true;
getChartMetrics(){
  this.workbechService.getChartMetricsLandingPage().subscribe({
    next:(data)=>{
      console.log(data);
      this.barChartData = data.bar_chart
      this.heatmapData = data.tree_chart
      this.radiaBarData = data.radial_bar_chart
      this.recentActivityData = data.activity_list.slice(0, 5)
      if(this.barChartData?.data){
          setTimeout(() => {
          this.barOptions = this.buildBar();
          this.loading = false; // hide skeleton after chart data ready
        }, 1500);
      }
      if(this.heatmapData){
        setTimeout(() => {
        this.treemapOptions = this.buildTreeMap();
          this.loading = false; // hide skeleton after chart data ready
        }, 1500);
          console.log('treemap',this.treemapOptions);
      }
      if(this.radiaBarData){
        this.radialOptions = this.buildRadial();
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
private buildTreeMap(){
  // return {
  //   tooltip: {
  //     formatter: (p: any) => {
  //       const path = p.treePathInfo?.slice(1).map((n: any) => n.name).join(' / ');
  //       return `${path}: <b>${p.value}</b>`;
  //     }
  //   },
  //   series: [
  //     {
  //       name: '',
  //       type: 'treemap',
  //       roam: false,
  //       nodeClick: 'zoomToNode',          // click a parent to drill in
  //       breadcrumb: { show: true },
  //       // Labels
  //       label: { show: true, formatter: '{b}' },     // leaf labels
  //       upperLabel: { show: true, height: 22 },      // parent labels
  //       itemStyle: { borderColor: '#fff' },
  //       // Visuals per depth
  //       levels: [
  //         { itemStyle: { borderWidth: 1, borderColor: '#e5e7eb', gapWidth: 6 } },                     // level 1
  //         { colorSaturation: [0.25, 0.85], itemStyle: { gapWidth: 3, borderColorSaturation: 0.7 } },  // level 2
  //         { itemStyle: { gapWidth: 2 } }                                                               // level 3+
  //       ],
  //       // ---- Hierarchical data ----
  //       data: [
  //         {
  //           name: 'Postgres',
  //           children: [
  //             { name: 'Querysets',  value: 50 },
  //             { name: 'Sheets',     value: 100 },
  //             { name: 'Dashboards', value: 10 }
  //           ]
  //         },
  //         {
  //           name: 'QuickBooks',
  //           children: [
  //             { name: 'Querysets',  value: 25 },
  //             { name: 'Sheets',     value: 50 },
  //             { name: 'Dashboards', value: 10 }
  //           ]
  //         },
  //         {
  //           name: 'Postgres4',
  //           children: [
  //             { name: 'Querysets',  value: 50 },
  //             { name: 'Sheets',     value: 100 },
  //             { name: 'Dashboards', value: 10 }
  //           ]
  //         },
  //         {
  //           name: 'QuickBooks3',
  //           children: [
  //             { name: 'Querysets',  value: 25 },
  //             { name: 'Sheets',     value: 50 },
  //             { name: 'Dashboards', value: 10 }
  //           ]
  //         },{
  //           name: 'Postgres2',
  //           children: [
  //             { name: 'Querysets',  value: 50 },
  //             { name: 'Sheets',     value: 100 },
  //             { name: 'Dashboards', value: 10 }
  //           ]
  //         },
  //         {
  //           name: 'QuickBooks1',
  //           children: [
  //             { name: 'Querysets',  value: 25 },
  //             { name: 'Sheets',     value: 50 },
  //             { name: 'Dashboards', value: 10 }
  //           ]
  //         },
  //         {
  //           name: 'MongoDB',
  //           children: [
  //             { name: 'Querysets',  value: 30 },
  //             { name: 'Sheets',     value: 60 },
  //             { name: 'Dashboards', value: 5 }
  //           ]
  //         },
  //         {
  //           name: 'Salesforce',
  //           children: [
  //             { name: 'Querysets',  value: 22 },
  //             { name: 'Sheets',     value: 40 },
  //             { name: 'Dashboards', value: 8 }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // };
  const hasData = this.heatmapData && this.heatmapData.length > 0;
  const seriesData =
  this.heatmapData && this.heatmapData.length
    ? this.heatmapData.map((item: any) => ({
        x: item.name,
        y: item.data?.connection_count || 0
      }))
    : [
        { x: "No Data ", y: 20 },
        { x: "No Data ", y: 10 },
        { x: "No Data ", y: 15 },
        { x: "No Data ", y: 25 },
        { x: "No Data ", y: 10 }
      ];
  return {
   series: [{ data: seriesData }],
  
    chart: {
      height: 350,
      type: "treemap"
    },
    title: {
      text: "Basic Treemap"
    },tooltip: {
    enabled: true,
    custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
      const point = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

        if (!hasData || point?.x === "Empty") {
        return "";
      }

      return `
        <div style="padding:5px;">
          <strong>${point.x}</strong><br/>
          Connected: ${point.y}<br/>
        </div>
      `;
    }
  },

  noData: {
    text: "No Data to Display",
    align: "center",
    verticalAlign: "middle",
    style: {
      color: "#999",
      fontSize: "16px",
      fontFamily: "Arial, sans-serif"
    }
  },
    colors: this.heatmapData && this.heatmapData.length > 0
    ? ["#1ab7ea", "#0084ff", "#39539E", "#0077B5", "#1ab7ea"] // normal colors
    : ["#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3"],
  };
  }
/** RadialBar showing connections split (e.g., 20 total: 10/5/3/2) */
private buildRadial() {


    const hasData = this.radiaBarData && this.radiaBarData.data && this.radiaBarData.data.length > 0;
  const originalValues = hasData ? this.radiaBarData.data : [0, 0, 0, 0];

  let labels = hasData
    ? this.radiaBarData.queryset_name || []
    : ["No Data", "No Data", "No Data", "No Data"];
    labels = labels.slice(0,3)
  // const labels = this.radiaBarData?.datasource || [];
  // const values = this.radiaBarData?.data || [];

  const values = hasData
    ? this.radiaBarData.data
    : [0, 0, 0, 0];
    const total = values.reduce((a: any, b: any) => a + b, 0);
    let normalizedValues = values.map((val:any) => Math.ceil((val / total) * 100));
    normalizedValues = normalizedValues.slice(0,3)
  return {
    series: normalizedValues,
    chart: {
      height: 310,
      width: '100%',
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        track: {
          background: "#e0e0e0", // grey background for remaining arc
          strokeWidth: "100%",
          margin: 10 // gap between arcs
        },
        hollow: {
          margin: 5,
          size: "20%",
          background: "transparent",
          image: undefined
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            show: false
          }
        }
      }
    },
    colors:hasData ? ["#1ab7ea", "#0084ff", "#39539E", "#0077B5","#1ab7ea"] :["#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3"] ,
    labels: labels,
    legend: {
      show: true,
      floating: true,
      fontSize: "12px",
      position: "left",
      offsetX: 10,
      offsetY: 10,
      markers: { show: false },
      labels: {
        useSeriesColors: true
      },
      formatter: function(seriesName: any, opts: any) {
        const idx = opts.seriesIndex;
        const original = originalValues[idx] ?? 0;
        const trimmed = seriesName.length > 6 ? seriesName.substring(0, 6) + ".." : seriesName;
        return `${trimmed}: ${original}`;
      },
      itemMargin: {
        horizontal: 3
      }
    },
      tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, w }: any) {
        // const val = series[seriesIndex];
        const label = w.globals.labels[seriesIndex];
        const original = originalValues[seriesIndex] ?? 0;
        if (!hasData || original   === 0) {
          return "";
        }

        return `
          <div style="padding:5px;background:#fff">
            <strong>${label}</strong><br/>
            Dashboards: ${original}<br/>
          </div>
        `;
      }
    },
    noData: {
      text: "No Data to Display",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#999",
        fontSize: "16px",
        fontFamily: "Arial, sans-serif"
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false
          }
        }
      }
    ]
  };
  
  
}


private buildBar() {
  const allZero =
    this.barChartData?.data &&
    this.barChartData.data.every((val: number) => val === 0);
  const rankedColors = !allZero ? this.getColorByValueRank(this.barChartData?.data, this.fixedColors) :  ["#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3"];

  // ✅ If all values are 0 → use dummy grey bars
  const seriesData = allZero
    ? [10, 15, 10, 19, 14, 12] // dummy values to render outline
    : this.barChartData.data;

  const categories = this.barChartData?.months || [];

  
  return {
    series: [
      {
        name: "Created Dashboards",
        data: seriesData
      }
    ],
    chart: {
      type: 'bar',
      height: 350,
      width: '100%',
      toolbar: { show: true },
      animations: {
        enabled: true,  // Enable animation
        easing: 'easeinout',  // Type of easing (easein, easeout, easeinout)
        speed: 800,  // Duration of the animation in ms
        animateGradually: {
          enabled: true,
          delay: 150  // Delay before starting the animation
        },
        dynamicAnimation: {
          enabled: true,  // Enable dynamic animation
          speed: 350  // Speed of dynamic animation for data updates
        }
      }

    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => allZero ? "" : val
      },
      x: {
        formatter: (val: string) => allZero ? "No Data" : val
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        // columnWidth: '55%',
        borderRadiusApplication: 'around',
        borderRadius: 20,
        distributed: true, 
                // endingShape: "rounded", // Important for rounded ends
        // dataLabels: {
        //     position: 'top' // top, center, bottom
        // }

      }
    },
    colors: rankedColors,
    fill: {
      type: ['solid', 'solid', 'solid', 'solid', 'pattern', 'pattern', 'pattern'],
      pattern: {
        style: 'slantedLines', // Stripe pattern
        width: 6,
        height: 6,
        strokeWidth: 2
      }
    },
    dataLabels: { enabled: !allZero },
    xaxis: {
      categories: categories,
      show: false,          // Hides Y-axis labels
      axisBorder: { show: false },  // Hides Y-axis border line
      axisTicks: { show: false }  }
    ,
    yaxis: {show: false,          // Hides Y-axis labels
    axisBorder: { show: false },  // Hides Y-axis border line
    axisTicks: { show: false } } ,
    grid: {
  show: false,
  xaxis: {
    lines: {
      show: false
    }
  },
  yaxis: {
    lines: {
      show: false
    }
  }
},
legend: {
  show: false,  // Show the legend

},
  };
}

getColorByValueRank(values: number[], colorPalette: string[]): string[] {
  const sorted = [...values].map((val, index) => ({ val, index }))
                            .sort((a, b) => b.val - a.val); // descending
  const colorByIndex = new Array(values.length);

  sorted.forEach((item, i) => {
    colorByIndex[item.index] = colorPalette[i]; // map based on rank
  });

  return colorByIndex;
}


getHostAndPort(): void {
  const { hostname, port } = window.location;
  this.host = hostname;
  this.port = port;
  console.log('port',this.port,'host',this.host)
}
totalSearch(){
  this.getuserSheets();
  this.getuserDashboardsList();
  this.getSavedQueries();
}
getDbConnectionList(){
  const Obj ={
    search : this.searchDbName
  }
  if(Obj.search === '' || Obj.search === null){
    delete Obj.search;
  }
  this.workbechService.getdatabaseConnectionsList(Obj).subscribe({
    next:(data)=>{
      this.connectionList = data.sheets
      console.log('jdhcvjsh',this.connectionList);
      this.totalDatabases = data.connection_count
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
getuserSheets(){
  const Obj ={
    search:this.wholeSearch,
    page_count:'12'
  }
  if(Obj.search === '' || Obj.search === null || Obj.search === ' '){
    delete Obj.search;
  }
  this.workbechService.getUserSheetListPut(Obj).subscribe(
    {
      next:(data:any) =>{
        this.userSheetsList=data?.sheets
        console.log(this.userSheetsList)
        this.totalSheets = data.total_items;
      },
      error:(error:any)=>{
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
getuserDashboardsList(){
  const Obj ={
    search:this.wholeSearch,
    page_count:'12'

  }
  if(Obj.search === ' ' || Obj.search === null || Obj.search === ''){
    delete Obj.search;
  }
  this.workbechService.getuserDashboardsListput(Obj).subscribe(
    {
      next:(data:any) =>{
        this.savedDashboardList=data.sheets;
        this.demoDashboardList = data.sample_dashboards;
        console.log(this.savedDashboardList)
        this.totalDashbaords = data.total_items;
      },
      error:(error:any)=>{
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
getSavedQueries(){
  const Obj ={
    search : this.wholeSearch,
    page_count:'12'

  }
  if(Obj.search === ' ' || Obj.search === null || Obj.search === ''){
    delete Obj.search;
  }
  this.workbechService.getSavedQueryList(Obj).subscribe({
    next:(data)=>{
      console.log(data);
      this.savedQueryList = data?.sheets;
      this.totalQueries = data.total_items;
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
viewDashboard(serverId:any,querysetId:any,dashboardId:any){
  // const encodedServerId = btoa(serverId.toString());
  // const encodedQuerySetId = btoa(querysetId.toString());
  this.loaderService.show();
  const encodedDashboardId = btoa(dashboardId.toString());

  this.router.navigate(['/analytify/home/sheetsdashboard/'+encodedDashboardId])
}
viewSheet(serverId:any,querysetId:any,sheetId:any){
  this.loaderService.show();
  const encodedQuerySetId = btoa(querysetId.toString());
  const encodedSheetId = btoa(sheetId.toString());

  // if (serverId === null || serverId ==='') {
  //   const encodedFileId = btoa(fileId.toString());
  //   this.router.navigate(['/insights/home/fileId/sheets/'+encodedFileId+'/'+encodedQuerySetId+'/'+encodedSheetId])

  // }
  //  if(fileId === null || fileId === ''){
    const encodedServerId = btoa(serverId.toString());
    this.router.navigate(['/analytify/home/sheets/'+encodedServerId+'/'+encodedQuerySetId+'/'+encodedSheetId])

  // }
 
}

 sheetsRoute(){
    this.loaderService.show();
    this.router.navigate(['/analytify/sheets'])  
  }
  newConnections(){
    this.loaderService.show();
    this.router.navigate(['analytify/datasources/new-connections']) 
  }
  goToConnections(){
    this.router.navigate(['analytify/datasources/view-connections']) 

  }
  getTablesFromConnectedDb(dbId:any){
    // const encodedId = btoa(id.toString());
    // this.router.navigate(['/insights/database-connection/tables/'+encodedId]);
    this.loaderService.show();
    // if(dbId === null){
    //   const encodedId = btoa(fileId.toString());
    //   this.router.navigate(['/insights/database-connection/files/tables/'+encodedId]);
    //   }
      // if(fileId === null){
        const encodedId = btoa(dbId.toString());
        this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
        // }
  }
  deleteDashboard(dashboardId:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result)=>{
      if(result.isConfirmed){
        this.workbechService.deleteDashboard(dashboardId)
        .subscribe(
          {
            next:(data:any) => {
              console.log(data);      
              if(data){
                // Swal.fire({
                //   icon: 'success',
                //   title: 'Deleted!',
                //   text: 'Dashboard Deleted Successfully',
                //   width: '400px',
                // })
                this.toasterservice.success('Dashboard Deleted Successfullyy','success',{ positionClass: 'toast-top-right'});
              }
              this.getuserDashboardsList();
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
      }})
  }
  deleteSheet(serverId:any,qurysetId:any,sheetId:any){
    const obj ={
      sheet_id:sheetId,
    }
    this.workbechService.deleteSheetMessage(obj)
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
                const idToPass =serverId 
                this.workbechService.deleteSheet(idToPass,qurysetId,sheetId)
                .subscribe(
                  {
                    next:(data:any) => {
                      console.log(data);      
                      if(data){
                        // Swal.fire({
                        //   icon: 'success',
                        //   title: 'Deleted!',
                        //   text: 'Sheet Deleted Successfully',
                        //   width: '400px',
                        // })
                        this.toasterservice.success('Sheet Deleted Successfully','success',{ positionClass: 'toast-top-right'});
                      }
                      this.getuserSheets();
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


  deleteSavedQuery(qrysetId:any){
    const obj ={
      queryset_id:qrysetId,
    }
    this.workbechService.deleteSavedQueryMessage(obj)
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
                this.workbechService.deleteSavedQuery(qrysetId)
                .subscribe(
                  {
                    next:(data:any) => {
                      console.log(data);      
                      if(data){
                        // Swal.fire({
                        //   icon: 'success',
                        //   title: 'Deleted!',
                        //   text: 'Query Deleted Successfully',
                        //   width: '400px',
                        // })
                        this.toasterservice.success('Query Deleted Successfully','success',{ positionClass: 'toast-top-right'});
                      }
                      this.getSavedQueries();
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

  viewAllSheets(){
    this.router.navigate(['/analytify/sheets-dashboard']) 

  }
  viewAllDashboards(){
    this.router.navigate(['/analytify/dashboards']) 

  }
  viewAllSavedQueries(){
    this.router.navigate(['/analytify/saved-queries']) 

  }
  gotoSavedQuery(dbId:any,qrySetId:any,isCustomSql:boolean,dsQrySetId:any){
    if(isCustomSql){ 
    // if(fileId === null){
    const encodedServerId = btoa(dbId.toString());
    const encodedQuerySetId = btoa(qrySetId.toString());

    this.router.navigate(['analytify/database-connection/savedQuery/'+encodedServerId+'/'+encodedQuerySetId])
    // }
    // if(dbId === null){
    //   const encodedFileId = btoa(fileId.toString());
    //   const encodedQuerySetId = btoa(qrySetId.toString());
  
    //   this.router.navigate(['insights/database-connection/savedQuery/fileId/'+encodedFileId+'/'+encodedQuerySetId])
    // }

  }
  else{
    const encodeddbId = btoa(dbId?.toString());
    const encodedqurysetId = btoa(qrySetId.toString());
    // const encodedFileId = btoa(fileId?.toString());
    // this.router.navigate(['/insights/database-connection/sheets/'+encodeddbId+'/'+encodedqurysetId])

    const idToPass = encodeddbId;
    const fromSource = 'dbId';

    const encodedDsQuerySetId = dsQrySetId === null || dsQrySetId === undefined 
  ? btoa('null') 
  : btoa(dsQrySetId.toString()); 
   this.router.navigate(['/analytify/database-connection/sheets/'+idToPass+'/'+encodedqurysetId+'/'+encodedDsQuerySetId])
  }
  }
  // gotoSavedQuery(dbId:any,qrySetId:any,fileId:any){
  //   // const encodedServerId = btoa(dbId.toString());
  //   // const encodedQuerySetId = btoa(qrySetId.toString());

  //   // this.router.navigate(['insights/database-connection/savedQuery/'+encodedServerId+'/'+encodedQuerySetId])
  //   this.loaderService.show();
  //   if(fileId === null){
  //     const encodedServerId = btoa(dbId.toString());
  //     const encodedQuerySetId = btoa(qrySetId.toString());
  
  //     this.router.navigate(['insights/database-connection/savedQuery/dbId/'+encodedServerId+'/'+encodedQuerySetId])
  //     }
  //     if(dbId === null){
  //       const encodedFileId = btoa(fileId.toString());
  //       const encodedQuerySetId = btoa(qrySetId.toString());
    
  //       this.router.navigate(['insights/database-connection/savedQuery/fileId/'+encodedFileId+'/'+encodedQuerySetId])
  //     }
  // }
  loadNewDashboard(){
    this.loaderService.show();
    this.router.navigate(['/analytify/sheetsdashboard'])
    }
  viewSampleDashbaordPropertiesTab(name: any, dashboardId: any) {
    this.modalService.open(this.sampleDashboardPropertiesModal);
    this.dashboardPropertyTitle = name;
    this.dashboardPropertyId = dashboardId;
    this.dashboardId = dashboardId;
    this.publishedDashboard = false;
  }
  viewPropertiesTab(name :any,dashboardId:any){
  this.modalService.open(this.propertiesModal);
  this.getRoleDetailsDshboard();
  this.dashboardPropertyTitle = name;
  this.dashboardPropertyId = dashboardId;
  this.dashboardId = dashboardId;
  this.publishedDashboard = false;
  this.shareAsPrivate = false;
  this.applyButtonEnableOnEditUser = false;
  this.getAddedDashboardProperties();
  }

  applyButtonEnableOnEditUser = false;

  getAddedDashboardProperties(){
    this.workbechService.getAddedDashboardProperties(this.dashboardId).subscribe({
      next:(data)=>{
        this.selectedRoleIds = Array.isArray(data?.roles) ? data.roles.map((role: any) => role.id): [];
        this.selectedUserIds = data?.users?.map((user:any)=>user.user_id);
        console.log('savedrolesandusers',data);
        // this.selectedRoleIdsToNumbers = data.roles?.map((role:any) => role.id);
        // this.selectedUserIdsToNumbers = data.users?.map((user:any) => user.user_id);
        this.selectedRoleIdsToNumbers =  (this.selectedRoleIds || []).map((id: string) => Number(id));;
        this.selectedUserIdsToNumbers = (this.selectedUserIds || []).map((id: string) => Number(id));
        console.log('Loaded selected roles:', this.selectedRoleIds);
        console.log('Loaded selected users:', this.selectedUserIds);
        if(this.selectedRoleIds.length > 0){
          this.getUsersforRole();
        }
        if(this.selectedUserIds.length > 0){
          this.applyButtonEnableOnEditUser = true;
        }
       },
      error:(error)=>{
        console.log(error);
        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-top-right'});
        this.selectedUserIds = [];
        this.selectedRoleIds = [];
      }
    }) 
  }

getRoleDetailsDshboard(){
  this.workbechService.getRoleDetailsDshboard().subscribe({
    next:(data)=>{
      console.log('dashboardroledetails',data);
      this.roleDetails = data;
      // this.getUsersforRole();
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
getUsersforRole(){
  const obj ={
    role_ids:this.selectedRoleIdsToNumbers
  }
  this.workbechService.getUsersOnRole(obj).subscribe({
    next:(data)=>{
      this.usersOnSelectedRole = data
      console.log('usersOnselecetdRoles',data);
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
///share publish
sharePublish(value:any){
console.log(value);
this.testVariableToChange = value;
if(value === 'public'){
  this.createUrl = true;
  this.shareAsProtected = false;
  this.shareAsPrivate = false
  const publicDashboardId = btoa(this.dashboardId.toString());
  this.publicUrl = 'https://'+this.host+':'+this.port+'/public/dashboard/'+publicDashboardId
  this.publishDashboard();
} else if(value === 'private'){
  this.createUrl = false;
  this.shareAsPrivate = true;
  this.shareAsProtected = false;
  this.publishedDashboard = false;
  if(this.selectedUserIds.length > 0){
    this.applyButtonEnableOnEditUser = true;
  }
} else if(value === 'protected'){
  this.createUrl = false;
  this.shareAsPrivate = false;
  this.shareAsProtected = true;
  this.publishedDashboard = false;
  this.applyButtonEnableOnEditUser = false;
}
}
// copyUrl(): void {
//   navigator.clipboard.writeText(this.publicUrl).then(() => {
//     console.log(this.publicUrl);
//     this.toasterservice.success('Link Copied','success',{ positionClass: 'toast-center-center'})
//     // setTimeout(() => this.publicUrl = null, 3000); // Clear message after 3 seconds
//   }).catch(err => {
//     console.error('Could not copy text: ', err);
//     this.publicUrl = 'Failed to copy message.';
//   });
// }

copyUrl(): void {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(this.publicUrl).then(() => {
      console.log(this.publicUrl);
      this.toasterservice.success('Link Copied', 'success', { positionClass: 'toast-center-center' });
    }).catch(err => {
      console.error('Could not copy text: ', err);
      this.fallbackCopyTextToClipboard(this.publicUrl);
    });
  } else {
    // Fallback if navigator.clipboard is not available
    this.fallbackCopyTextToClipboard(this.publicUrl);
  }
}

fallbackCopyTextToClipboard(text: string): void {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';  // Avoid scrolling to bottom
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      this.toasterservice.success('Link Copied', 'success', { positionClass: 'toast-center-center' });
    } else {
      console.error('Fallback: Could not copy text');
    }
  } catch (err) {
    console.error('Fallback: Unable to copy', err);
  }
  document.body.removeChild(textArea);
}
  onRolesChange(selected: number[]) {
    this.selectedRoleIds = selected
    this.selectedRoleIdsToNumbers = selected.map(value => Number(value));
    console.log(this.selectedRoleIds);
    if (this.selectedRoleIds.length === 0) {
      this.selectedUserIds = [];
      this.selectedUserIdsToNumbers = [];
      return;
    } 
    const obj = { role_ids: this.selectedRoleIdsToNumbers };

    this.workbechService.getUsersOnRole(obj).subscribe({
      next: (data) => {
        console.log('Updated users for selected roles:', data);
        this.usersOnSelectedRole = data;
        const validUserIds = new Set(data.map((user: { user_id: any; }) => String(user.user_id)));  
  
        const prevSelectedUsers = [...this.selectedUserIds]; // Backup for debugging
        this.selectedUserIds = this.selectedUserIds.filter((userId: any) =>
          validUserIds.has(String(userId)) // Convert to string for safe comparison
        );
  
        this.selectedUserIdsToNumbers = this.selectedUserIds.map((value: any) => Number(value));
        
        // Debugging logs
        console.log('Previous selected users:', prevSelectedUsers);
        console.log('Valid user IDs after role change:', [...validUserIds]);
        console.log('Filtered selected users:', this.selectedUserIds);
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: error.error.message,
          width: '400px',
        });
      }
    });
  }
getSelectedUsers(selected: number[]){
  this.selectedUserIds = selected;
  this.selectedUserIdsToNumbers = this.selectedUserIds.map((value: any) => Number(value));
  console.log(this.selectedUserIds)
  
  // this.selectedUserIds = selected
  }

saveDashboardProperties(){
  if(this.shareAsProtected){
    this.applyProtectedEmails();
    return;
  }
  const obj ={
    dashboard_id:this.dashboardId,
    role_ids:this.selectedRoleIdsToNumbers,
    user_ids:this.selectedUserIdsToNumbers
  }
  this.workbechService.saveDashboardProperties(obj).subscribe({
    next:(data)=>{
      console.log('properties save',data);
      this.modalService.dismissAll();
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Done!',
      //   text: data.message,
      //   width: '400px',
      // })
      this.toasterservice.success(data.message,'success',{ positionClass: 'toast-top-right'});
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

publishDashboard(){
  this.workbechService.publishDashbord(this.dashboardPropertyId).subscribe({
    next:(data)=>{
      console.log(data);
      this.toasterservice.success('Dashboard Published','success',{ positionClass: 'toast-center-center'})
      this.publishedDashboard = true;
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

uploadProtectedCSV(event: any){
  const file = event.target.files[0];
  if(!file){ return; }
  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result as string;
    const lines = text.split(/\r?\n/).slice(1);
    lines.forEach(l => { const e = l.trim(); if(e){ this.protectedEmails.push(e); } });
  };
  reader.readAsText(file);
}

applyProtectedEmails(){
  if(!this.protectedEmails.length){ return; }
  const emails = this.protectedEmails
    .map((e: any) => typeof e === 'string' ? e : e.label || e.value || '')
    .filter((e) => !!e);
  const obj = {
    dashboard_id: this.dashboardId,
    encrypted_dahboard_id: btoa(String(this.dashboardId)),
    emails_ids: emails
  };
  this.workbechService.generateProtectedLink(obj).subscribe({
    next: ()=>{ this.toasterservice.success('Emails Sent Successfully.','success'); },
    error: ()=>{}
  });
}
gotoConfigureEmailAlerts(id:any){
const encodedDatabaseId = btoa(id.toString());
this.router.navigate(['/analytify/configure-page/email/sheet/'+encodedDatabaseId])
}
gotoConfigureEmailAlertsDashbaord(id:any){
    const encodedDatabaseId = btoa(id.toString());

this.router.navigate(['/analytify/configure-page/email/dashboard/'+encodedDatabaseId])
}

emptyDashboardProperties(){
  this.shareAsProtected = false;
  this.shareAsPrivate = false;
  this.protectedEmails = [];
  this.selectedRoleIds = [];
  this.selectedUserIds = [];
}
getTotalSummary(): string {
  if (!this.radiaBarData || !this.radiaBarData.data) {
    return "No dashboards created";
  }
  const bardata = this.radiaBarData.data.slice(0,3);
  const lablename = this.radiaBarData.queryset_name.slice(0,3);

  const total = bardata.reduce((a: number, b: number) => a + b, 0);
  const datasets = lablename.length || 0;

  return `${total} dashboards created across ${datasets} dataset${datasets > 1 ? 's' : ''}`;
}
getDatasetBreakdown() {
  if (!this.radiaBarData || !this.radiaBarData.data) {
    return [];
  }
  const bardata = this.radiaBarData.data.slice(0,3);
  const lablename = this.radiaBarData.queryset_name.slice(0,3);
  return lablename.map((name: string, i: number) => ({
    name,
    count: bardata[i] ?? 0
  }));
}
}
