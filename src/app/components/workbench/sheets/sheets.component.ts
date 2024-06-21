import { Component } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/sharedmodule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkbenchService } from '../../workbench/workbench.service';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import * as d3 from 'd3';
import type { EChartsOption } from 'echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {FormControl} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
interface TableRow {
  [key: string]: any;
}


@Component({
  selector: 'app-sheets',
  standalone: true,
  imports: [SharedModule,NgSelectModule,NgbModule,FormsModule,ReactiveFormsModule,
    CdkDropListGroup, CdkDropList, CdkDrag,NgApexchartsModule,MatTabsModule,MatFormFieldModule,MatInputModule],
  templateUrl: './sheets.component.html',
  styleUrl: './sheets.component.scss'
})
export class SheetsComponent {
  tableColumnsData = [] as any;
  draggedtables = [] as any;
  draggedColumns = [] as any;
  draggedRows = [] as any;
  dimentions = [] as any;
  measurments = [] as any;
  columnData = [] as any;
  rowData = [] as any;
  tableName: any;
  schemaName: any;
  table_alias: any;
  draggedColumnsData = [] as any;
  draggedRowsData = [] as any;
  tablePreviewColumn = [] as any;
  tablePreviewRow = [] as any;
  tableData: TableRow[] = [];
  displayedColumns: string[] = [];
  chartEnable = true;
  dimensionExpand = false;
 /* private data = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];*/

  //Bar
  public svg: any;
  public margin = 50;
  public width = 750 - (this.margin * 2);
  public height = 350 - (this.margin * 2);
  //Pie
  public widthPie = 600;
  public heightPie = 300;
  // The radius of the pie chart is half the smallest side
  public radius = Math.min(this.width, this.height) / 2 - this.margin;
  public colors:any;
  public chartsData = [] as any;
  chartsColumnData = [] as any;
  chartsRowData = [] as any;
  public lineChartOptions!: Partial<EChartsOption>;
  chartOptions:any;
  chartOptions1:any;
  sheetName = "Sheet 1";
  databaseId:any;
  qrySetId:any;
  chartsEnableDisable = [] as any;
  chartId = 1;
  sheetResponce = [] as any;
  SheetIndex = 0;
  chartOptions2:any;
  chartOptions3:any;
  chartOptions4:any;
  chartOptions6:any;
  chartOptions5:any;
  DimetionMeasure = [] as any;
  sheetEnable = false;
  filterValues:any;
  filterId = [] as any;
  sidebysideBarColumnData = [] as any;
  sidebysideBarRowData = [] as any;
  constructor(private workbechService:WorkbenchService,private route:ActivatedRoute,private modalService: NgbModal){   
    if (route.snapshot.params['id1'] && route.snapshot.params['id2'] ) {
    this.databaseId = +atob(route.snapshot.params['id1']);
    this.qrySetId = +atob(route.snapshot.params['id2'])
    }
  }

  ngOnInit(): void {
    this.columnsData();
  }
  toggleSubMenu(menu: any) {
    menu.expanded = !menu.expanded;
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
}

private drawBars(data: any[]): void {
  // Create the X-axis band scale
  console.log(data)
  const x = d3.scaleBand()
  .range([0, this.width])
  .domain(data.map(d => d.col))
  .padding(0.2);

  // Draw the X-axis on the DOM
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

  // Create the Y-axis band scale
  const y = d3.scaleLinear()
  .domain([0, 10])
  .range([this.height, 0]);

  // Draw the Y-axis on the DOM
  this.svg.append("g")
  .call(d3.axisLeft(y));

  // Create and fill the bars
  this.svg.selectAll("bars")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d: any) => x(d.col))
  .attr("y", (d: any) => y(d.row))
  .attr("width", x.bandwidth())
  .attr("height", (d: any) => this.height - y(d.row))
  .attr("fill", "#d04a35");
}
private createSvgPie(): void {
  this.svg = d3.select("figure#pie")
  .append("svg")
  .attr("width", this.widthPie)
  .attr("height", this.heightPie)
  .append("g")
  .attr(
    "transform",
    "translate(" + this.widthPie / 2 + "," + this.heightPie / 2 + ")"
  );
}
private createColors(): void {
  this.colors = d3.scaleOrdinal()
  .domain(this.chartsData.map((d:any) => d.row.toString()))
  .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
}
private drawChartPie(): void {
  // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.row));

  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(this.chartsData))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(this.radius)
  )
  .attr('fill', (d: any, i: any) => (this.colors(i)))
  .attr("stroke", "#121926")
  .style("stroke-width", "1px");

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(100)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(this.chartsData))
  .enter()
  .append('text')
  .text((d: any)=> d.data.col)
  .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);
}
barChart(){
  this.chartOptions3 = {
    series: [
      {
        name: '',
        data: this.chartsRowData,
      },
    ],
    chart: {
      toolbar: {
        show: false
      },
      height: 385,
      type: 'bar',
      foreColor: '#9aa0ac',
    },
    grid: {
      show: false,      // you can either change hear to disable all grids
      xaxis: {
        lines: {
          show: false  //or just here to disable only x axis grids
         }
       },  
      yaxis: {
        lines: { 
          show: false  //or just here to disable only y axis
         }
       },   
    },
    plotOptions: {
      bar: {
        dataLabels: {
          hideOverflowingLabels:false,
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val + '';
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#9aa0ac'],
      },
    },
    fill: {
      type: 'gradient',
    },
    xaxis: {
      categories: this.chartsColumnData,
      position: 'bottom',
      labels: {
        rotate:0,
        // offsetY: 0,
        trim: true,
        // minHeight: 40,
        hideOverlappingLabels: false,
        style: {
          colors: '#9aa0ac',
          
        },
      //   formatter: (value) => {
      //     return (value && value.split(' ')[1][1] === '0' ? value : '');
      // }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: false,
        offsetY: -35,
      },

    },

    // fill: {
    //   type: 'gradient',
    //   gradient: {
    //     shade: 'light',
    //     type: 'horizontal',
    //     shadeIntensity: 0.25,
    //     gradientToColors: undefined,
    //     inverseColors: true,
    //     opacityFrom: 1,
    //     opacityTo: 1,
    //     stops: [50, 0, 100, 100],
    //   },
    // },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val: number) {
          return val + '$';
        },
      },
    },
    title: {
      text: '',
      offsetY: 10,
      align: 'center',
      style: {
        color: '#9aa0ac',
      },
    },
    // tooltip: {
    //   theme: 'dark',
    //   marker: {
    //     show: true,
    //   },
    //   x: {
    //     show: true,
    //   },
    // },
  };
}
pieChart(){
  this.chartOptions4={
    series: this.chartsRowData,
    chart: {
        height: 300,
        type: 'pie',
    },
    colors: ["#00a5a2", "#31d1ce", "#f5b849", "#49b6f5", "#e6533c"],
    labels: this.chartsColumnData,
    legend: {
        position: "bottom"
    },
    dataLabels: {
        dropShadow: {
            enabled: false
        }
    },
    };
}
lineChart(){
  this.chartOptions={
    series: [{
        name: "",
        data: this.chartsRowData
    }],
   
        chart: {
            height: 200,
            type: 'line',
            reponsive: true,
            zoom: {
                enabled: false
            },
            events: {
                mounted: (chart:any) => {
                  chart.windowResizeHandler();
                }
              },
        },
        colors: ['#00a5a2'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight',
            width: 3,
        },
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
        },
        title: {
            text: '',
            align: 'left',
            style: {
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#8c9097'
            },
        },
        xaxis: {
            categories: this.chartsColumnData,
            labels: {
                show: true,
                style: {
                    colors: "#8c9097",
                    fontSize: '11px',
                    fontWeight: 600,
                    cssClass: 'apexcharts-xaxis-label',
                },
            }
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    colors: "#8c9097",
                    fontSize: '11px',
                    fontWeight: 600,
                    cssClass: 'apexcharts-yaxis-label',
                },
            }
        }
    
}
}
areaChart(){
  this.chartOptions1 = {
    series: [
      {
        name: "",
        data: this.chartsRowData,
      },
    ],
    chart: {
      type: "area",
      height: 200,
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    subtitle: {
      text: "",
      align: "left",
      style: {
        fontSize: "11px",
        fontWeight: "normal",
        color: "#8c9097",
      },
    },
    grid: {
      borderColor: "rgba(119, 119, 142, 0.05)",
    },
    labels: this.chartsColumnData,
    title: {
      text: "",
      align: "left",
      style: {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#8c9097",
      },
    },
    colors: ["#00a5a2"],
    xaxis: {
      type: "",
      labels: {
        show: true,
        style: {
          colors: "#8c9097",
          fontSize: "11px",
          fontWeight: 600,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    yaxis: {
      opposite: true,
      labels: {
        show: true,
        style: {
          colors: "#8c9097",
          fontSize: "11px",
          fontWeight: 600,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    legend: {
      horizontalAlign: "left",
    },
  };
}
sidebysideBar(){
  this.chartOptions2 = {
    series: this.sidebysideBarRowData,
    colors:['#00a5a2','#0dc9c5','#f43f63'],
    chart: {
      type: 'bar',
      height: 320,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        // endingShape: "rounded"
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories:this.sidebysideBarColumnData[0]?.data,
      
    },
    yaxis: {
      title: {
        text: '$ (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: string) {
          return '$ ' + val + ' thousands';
        },
      },
    },
    grid: {
      borderColor: "rgba(119, 119, 142, 0.05)",
    },
  };
}
stockedBar(){
  this.chartOptions6 = {
    series: this.sidebysideBarRowData,
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    xaxis: {
      type: "category",
      categories: this.sidebysideBarColumnData[0]?.data,
    },
    legend: {
      position: "right",
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  };
}
barLineChart(){
  this.chartOptions5 = {
    series: [
      {
        name: this.sidebysideBarRowData[0]?.name,
        type: "column",
        data: this.sidebysideBarRowData[0]?.data
      },
      {
        name: this.sidebysideBarRowData[1]?.name,
        type: "line",
        data: this.sidebysideBarRowData[1]?.data,
      }
    ],
    colors:['#00a5a2','#31d1ce'],
    chart: {
      height: 350,
      type: "line"
    },
    grid: {
      borderColor: "rgba(119, 119, 142, 0.05)",
    },
    stroke: {
      width: [0, 4]
    },
    title: {
      text: "",
      style: {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#8c9097",
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1]
    },
    labels: this.sidebysideBarColumnData[0]?.data,
    xaxis: {
      type: ""
    },
    yaxis: [
      {
        title: {
          text: "",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097",
          },
        }
      },
      {
        opposite: true,
        title: {
          text: "",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097",
          },
        }
      }
    ]
    
  };
}
/*private createLineChart(): void {
  const data = this.chartsData.map((d:any) => ({
    col: d.col,
    row: +d.row
  }));

  const element = document.querySelector('.chart-container');

  if (!element) return;

  const svg = d3.select(element)
    .append('svg')
    .attr('width', 600)
    .attr('height', 400);

  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = +svg.attr('width') - margin.left - margin.right;
  const height = +svg.attr('height') - margin.top - margin.bottom;
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scalePoint()
    .domain(data.map((d:any) => d.col))
    .range([0, width]);

  const y = d3.scaleLinear().range([height, 0]);

  const line = d3.line<{ col: string, row: number }>()
  .x(d => x(d.col)!)
  .y(d => y(d.row));

  y.domain([0, d3.max(data, (d:any) => d.row) as any]);

  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  g.append('g')
    .call(d3.axisLeft(y));

  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', line);

  g.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('cx', (d:any) => {
      const xValue = x(d.col);
      if (xValue === undefined) throw new Error("x value is undefined");
      return xValue;
    })
    .attr('cy', (d: any) => y(d.row))
    .attr('r', 5)
    .attr('fill', 'steelblue');
}*/
tableDimentions = [] as any;
tableMeasures = [] as any;
  columnsData(){
    const obj={
      "db_id":this.databaseId,
      "queryset_id":this.qrySetId,
  }
    this.workbechService.getColumnsData(obj).subscribe({next: (responce:any) => {
          console.log(responce);
          this.tableColumnsData = responce;
          this.tableDimentions = responce.dimensions;
          this.tableMeasures = responce.measures;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }

  dataExtraction(){
    this.tablePreviewColumn = [];
    this.tablePreviewRow = [];
    this.tableData = [];
    this.chartsData = [];
    this.displayedColumns = [];
    this.chartsColumnData = [];
    this.chartsRowData = [];
    this.sidebysideBarColumnData = [];
    this.sidebysideBarRowData = [];
      const obj={
          "database_id":this.databaseId,
          "queryset_id":this.qrySetId,
          "col":this.draggedColumnsData,
          "row":this.draggedRowsData,
          "filter_id": this.filterId,
          "datasource_querysetid":null
      }
    this.workbechService.getDataExtraction(obj).subscribe({next: (responce:any) => {
          console.log(responce);
          this.tablePreviewColumn = responce.data[0].col;
          this.tablePreviewRow = responce.data[0].row;
          console.log(this.tablePreviewColumn);
          console.log(this.tablePreviewRow);
          this.tablePreviewColumn.forEach((res:any) => {
            let obj={
              name: res.column,
              data: res.result_data
            }
            this.sidebysideBarColumnData.push(obj);
          });
          this.tablePreviewRow.forEach((res:any) => {
            let obj={
              name: res.column,
              data: res.result_data
            }
            this.sidebysideBarRowData.push(obj);
          });
          console.log(this.sidebysideBarColumnData)
          console.log(this.sidebysideBarRowData);
          let rowCount:any;
         if(this.tablePreviewColumn[0]?.result_data?.length){
           rowCount = this.tablePreviewColumn[0]?.result_data?.length;
         }else{
           rowCount = this.tablePreviewRow[0]?.result_data?.length;
         }
          //const rowCount = this.tablePreviewRow[0]?.result_data?.length;
          // Extract column names
          this.displayedColumns = this.tablePreviewColumn.map((col:any) => col.column).concat(this.tablePreviewRow.map((row:any) => row.column));
          // Create table data
          for (let i = 0; i < rowCount; i++) {
            const row: TableRow = {};
            this.tablePreviewColumn.forEach((col:any) => {
              row[col.column] = col.result_data[i];
            });
            this.tablePreviewRow.forEach((rowData:any) => {
              row[rowData.column] = rowData.result_data[i];
            });
            this.tableData.push(row);
         
        }
      console.log(this.tableData);
      this.tablePreviewColumn.forEach((col:any) => {
        this.chartsColumnData = col.result_data;
      });
      this.tablePreviewRow.forEach((rowData:any) => {
        this.chartsRowData = rowData.result_data;
      });
      console.log(this.chartsColumnData)
      console.log(this.chartsRowData)
      const length = Math.min(this.chartsColumnData.length, this.chartsRowData.length);
      for (let i = 0; i < length; i++) {
        const aa = { col: this.chartsColumnData[i], row: this.chartsRowData[i] };
        this.chartsData.push(aa);
      }
      console.log(this.chartsData)
      if(this.chartsRowData.length >0){
        this.enableDisableCharts();
       // this.createSvg();
       // this.drawBars(this.chartsData);
        this.barChart();
        //this.createSvgPie();
        //this.createColors();
        //this.drawChartPie();
        this.pieChart();
        this.lineChart();
        this.areaChart();
        this.sidebysideBar();
        this.stockedBar();
        this.barLineChart();
      }
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  
   
  }
 
  tableNameMethod(schemaname:any,tablename:any,tableAlias:any){
    this.schemaName = '';
    this.tableName = '';
    this.table_alias = '';
  this.schemaName = schemaname;
  this.tableName = tablename;
  this.table_alias = tableAlias;
  }
  storeColumnData = [] as any;
  storeRowData = [] as any;
  columndrop(event: CdkDragDrop<string[]>){
    console.log(event)
    let item: any = event.previousContainer.data[event.previousIndex];
    this.storeColumnData.push(event.previousContainer.data); 
    // this.storeColumnData[0].forEach((element:any) => {
     // if(element.column === item.column){
        let copy: any = JSON.parse(JSON.stringify(item));
        let element: any = {};
        for (let attr in copy) {
          if (attr == 'title') {
            element[attr] = copy[attr];
          } else {
            element[attr] = copy[attr];
          }
        }
        this.draggedColumns.splice(event.currentIndex, 0, element);
        //this.draggedColumnsData.push([this.schemaName,this.tableName,this.table_alias,element.column,element.data_type,""])
        this.draggedColumnsData.push([element.column,element.data_type,""])
    
        this.dataExtraction();
     // }else{
        console.log("Can't Accept")
     // }

   // });
    
  }
  rowdrop(event: CdkDragDrop<string[]>){
    let item: any = event.previousContainer.data[event.previousIndex];
   // this.storeRowData.push(event.previousContainer.data); 
    //this.storeRowData[0].forEach((element:any) => {
    //  if(element.column === item.column){
        let copy: any = JSON.parse(JSON.stringify(item));
        let element: any = {};
        for (let attr in copy) {
          if (attr == 'title') {
            element[attr] = copy[attr];
          } else {
            element[attr] = copy[attr];
          }
        }
        this.draggedRows.splice(event.currentIndex, 0, element);
        //this.draggedRowsData.push([this.schemaName,this.tableName,this.table_alias,element.column,element.data_type,""])
        this.draggedRowsData.push([element.column,element.data_type,""])
        console.log(this.draggedRowsData);
        this.dataExtraction();
      //}else{
        console.log("Can't Accept")
      //}
   // });

  }
   drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  dragStartedColumn(index:any){
    this.draggedColumns.splice(index, 1);
   this.draggedColumnsData.splice(index, 1);
   this.dataExtraction();
  }
  dragStartedRow(index:any){
   this.draggedRows.splice(index, 1);
   this.draggedRowsData.splice(index, 1);
   this.dataExtraction();
  }
  rightArrow(){
    console.log(this.draggedColumns.length)
    if(this.draggedColumns.length == 6){

    }else{
   const columnNext =  this.draggedColumns.length;
    for (let i = 7; i < columnNext; i++) {
      this.draggedColumns[i];
    }
    console.log(this.draggedColumns)
  }
  }
  table = true;
  bar = false;
  sidebyside = false;
  area = false;
  line = false;
  pie = false;
  stocked = false;
  barLine = false;
  chartDisplay(table:boolean,bar:boolean,area:boolean,line:boolean,pie:boolean,sidebysideBar:boolean,stocked:boolean,barLine:boolean,chartId:any){
    this.table = table;
    this.bar=bar;
    this.area=area;
    this.line=line;
    this.pie=pie;
    this.sidebyside = sidebysideBar;
    this.chartId = chartId;
    this.stocked = stocked;
    this.barLine = barLine;
    this.dataExtraction();
  }
  enableDisableCharts(){
    console.log(this.draggedColumnsData);
    console.log(this.draggedRowsData);
    const obj={
        "db_id":this.databaseId,
        "col":this.draggedColumnsData,
        "row":this.draggedRowsData,
  }
    this.workbechService.getChartsEnableDisable(obj).subscribe({next: (responce:any) => {
          console.log(responce);
          this.chartsEnableDisable = responce;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }
  tabs = ['Sheet 1'];
  selected = new FormControl(0);
 // tabtitle:string = '';

  addSheet() {
    this.sheetName = '';
    if(this.sheetName != ''){
       this.tabs.push(this.sheetName);
    }else{
      this.sheetEnable = true;
      const index = this.tabs.length + 1;
       this.tabs.push('Sheet ' +index);
       this.sheetName = 'Sheet ' +index;
       console.log(this.sheetName)
    }
   
  }
  sheetNameChange(name:any){
    this.tabs[this.SheetIndex] = name;
  }
  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
  onChange(event:any){
  console.log(event)
  this.SheetIndex = event.index;
  this.sheetName = event.tab.textLabel;
  if(this.sheetEnable){
    this.saveTableData = [] ;
    this.savedisplayedColumns = [];
    this.saveBar = [];
    this.savePie = [];
    this.lineYaxis = [];
    this.lineXaxis = [];
    this.areaYaxis = [];
    this.areaXaxis = [];
    this.draggedColumns = [];
    this.draggedRows = [];
    this.tablePreviewColumn = [];
    this.tablePreviewRow = [];
    this.tableData = [];
    this.displayedColumns = [];
    this.chartsData = [];
    this.chartsRowData = [];
    this.chartsColumnData = [];
    this.draggedColumnsData = [];
    this.draggedRowsData = [];
    this.table = true;
    this.bar = false;
    this.pie = false;
    this.line = false;
    this.area = false;
   
  }
  this.sheetRetrive();
   
  }
  saveTableData = [] as any;
  savedisplayedColumns = [] as any;
  saveBar = [] as any;
  savePie = [] as any;
  lineYaxis = [] as any;
  lineXaxis = [] as any;
  areaYaxis = [] as any;
  areaXaxis = [] as any;
  barXaxis = [] as any;
  pieXaxis = [] as any;
sheetSave(){
  if(this.table && this.chartId == 1){
   this.saveTableData =  this.tableData;
   this.savedisplayedColumns = this.displayedColumns;
  }
  if(this.bar && this.chartId == 6){
    this.saveBar = this.chartsRowData;
    this.barXaxis = this.chartsColumnData;
  }
  if(this.pie && this.chartId == 24){
    this.savePie = this.chartsRowData;
    this.pieXaxis = this.chartsColumnData
  }
  if(this.line && this.chartId == 13){
    this.lineYaxis = this.chartsRowData;
    this.lineXaxis = this.chartsColumnData;
  }
  if(this.area && this.chartId == 17){
    this.areaYaxis = this.chartsRowData;
    this.areaXaxis = this.chartsColumnData;
  }
console.log("Sheet Save")
const obj={
  "chart_id": this.chartId,
  "queryset_id":this.qrySetId,
  "server_id": this.databaseId,
  "sheet_name": this.sheetName,
  "data":{
  "columns": this.draggedColumns,
  "rows": this.draggedRows,
  "results": {
    "tableData":this.saveTableData,
    "tableColumns":this.savedisplayedColumns,

    "barYaxis":this.saveBar,
    "barXaxis":this.barXaxis,
   
    "pieYaxis":this.savePie,
    "pieXaxis":this.pieXaxis,

    "lineYaxis":this.lineYaxis,
    "lineXaxis": this.lineXaxis,

    "areaYaxis":this.areaYaxis,
    "areaXaxis":this.areaXaxis
  },
}
}
this.workbechService.sheetSave(obj).subscribe({next: (responce:any) => {
    console.log(responce);
  },
  error: (error) => {
    console.log(error);
  }
}
)
  }
sheetRetrive(){
  const obj={
  "queryset_id":this.qrySetId,
  "server_id": this.databaseId,
  "sheet_name": this.sheetName,
}
  this.workbechService.sheetGet(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        this.sheetResponce = responce.sheet_data;
        this.draggedColumns=this.sheetResponce.columns;
        this.draggedRows = this.sheetResponce.rows;
        if(responce.chart_id == "1"){
          this.tableData = this.sheetResponce.results.tableData;
          this.displayedColumns = this.sheetResponce.results.tableColumns;
          this.table = true;
          this.bar = false;
          this.pie = false;
          this.line = false;
          this.area = false;
        }
       if(responce.chart_id == "6"){
        this.chartsRowData = this.sheetResponce.results.barYaxis;
        this.chartsColumnData = this.sheetResponce.results.barXaxis;
       this.barChart();
        this.bar = true;
        this.table = false;
          this.pie = false;
          this.line = false;
          this.area = false;
       }
       if(responce.chart_id == "24"){
        this.chartsRowData = this.sheetResponce.results.pieYaxis;
        this.chartsColumnData = this.sheetResponce.results.pieXaxis;
        this.pieChart();
        this.bar = false;
        this.table = false;
          this.pie = true;
          this.line = false;
          this.area = false;
       }
       if(responce.chart_id == "13"){
        this.chartsRowData = this.sheetResponce.results.lineYaxis;
        this.chartsColumnData = this.sheetResponce.results.lineXaxis;
        this.lineChart();
        this.bar = false;
        this.table = false;
          this.pie = false;
          this.line = true;
          this.area = false;
       }
       if(responce.chart_id == "17"){
        this.chartsRowData = this.sheetResponce.results.areaYaxis;
        this.chartsColumnData = this.sheetResponce.results.areaXaxis;
        this.areaChart();
        this.bar = false;
        this.table = false;
          this.pie = false;
          this.line = false;
          this.area = true;
       }
      },
      error: (error) => {
        console.log(error);
      }
    }
  )
  }
  filterName:any
  filterType:any;
  openSuperScaled(modal: any,data:any) {
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
    });
    this.filterName = data.column;
    this.filterType = data.data_type;
    this.filterDataGet();
  }
  filterData = [] as any;
  filter_id: any;
  filterDataGet(){
    const obj={
      "database_id" :this.databaseId,
      "query_set_id":this.qrySetId,
      "type_of_filter" : "sheet",
      "datasource_queryset_id" :null,
      "col_name":this.filterName,
       "data_type":this.filterType,
       "format_date":""
}
  this.workbechService.filterPost(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        this.filterData = responce.col_data;
        this.filter_id = responce.filter_id;
      },
      error: (error) => {
        console.log(error);
      }
    }
  )
  }
  filterDataArray = [] as any;
  filterCheck(data:any){
   console.log(data)
   this.filterDataArray.push(data);
  }
  filterDataPut(){
    const obj={
    "filter_id": this.filter_id,
    "database_id": this.databaseId,
    "queryset_id": this.qrySetId,
    "type_of_filter":"sheet",
    "datasource_querysetid" : null,
    "range_values": [],
    "select_values":this.filterDataArray
}
  this.workbechService.filterPut(obj).subscribe({next: (responce:any) => {
        console.log(responce);
        this.filterId.push(responce.filter_id);
        this.DimetionMeasure.push(this.filterName);
        this.dataExtraction();
      },
      error: (error) => {
        console.log(error);
      }
    }
  )
  }
}
