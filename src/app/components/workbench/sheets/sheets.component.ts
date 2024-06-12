import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
  constructor(private workbechService:WorkbenchService,private route:ActivatedRoute){   
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
  columnsData(){
    const obj={
      "db_id":this.databaseId,
      "queryset_id":this.qrySetId,
  }
    this.workbechService.getColumnsData(obj).subscribe({next: (responce:any) => {
          console.log(responce);
          this.tableColumnsData = responce;
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
      const obj={
          "database_id":this.databaseId,
          "queryset_id":this.qrySetId,
          "col":this.draggedColumnsData,
          "row":this.draggedRowsData,
          "filter_id": []
      }
    this.workbechService.getDataExtraction(obj).subscribe({next: (responce:any) => {
          console.log(responce);
          this.tablePreviewColumn = responce.data[0].col;
          this.tablePreviewRow = responce.data[0].row;
          console.log(this.tablePreviewColumn);
          console.log(this.tablePreviewRow);
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
      if(this.chartsRowData.length >0){
        this.enableDisableCharts();
        this.createSvg();
        this.drawBars(this.chartsData);
        this.createSvgPie();
        this.createColors();
        this.drawChartPie();
        this.lineChart();
        this.areaChart();
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
 
  columndrop(event: CdkDragDrop<string[]>){
    console.log(event)
    let item: any = event.previousContainer.data[event.previousIndex];
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
    this.draggedColumnsData.push([this.schemaName,this.tableName,this.table_alias,element.column,element.data_type,""])
    this.dataExtraction();
  }
  rowdrop(event: CdkDragDrop<string[]>){
    let item: any = event.previousContainer.data[event.previousIndex];
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
    this.draggedRowsData.push([this.schemaName,this.tableName,this.table_alias,element.column,element.data_type,""])
    console.log(this.draggedRowsData);
    this.dataExtraction();
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
  area = false;
  line = false;
  pie = false;
  chartDisplay(table:boolean,bar:boolean,area:boolean,line:boolean,pie:boolean,chartId:any){
    this.table = table;
    this.bar=bar;
    this.area=area;
    this.line=line;
    this.pie=pie;
    this.chartId = chartId;
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
  tabtitle:string = '';

  addSheet() {
    if(this.tabtitle != ''){
       this.tabs.push(this.tabtitle);
    }else{
      const index = this.tabs.length + 1;
       this.tabs.push('Sheet ' +index);
    }
    this.tabtitle = '';
   
  }
  sheetNameChange(event:any){
    console.log(event)

  }
  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
  onChange(event:any){
  console.log(event)
  this.sheetName = event.tab.textLabel;
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
sheetSave(){
  if(this.table && this.chartId == 1){
   this.saveTableData =  this.tableData;
   this.savedisplayedColumns = this.displayedColumns;
  }
  if(this.bar && this.chartId == 6){
    this.saveBar = this.chartsData;
  }
  if(this.pie && this.chartId == 24){
    this.savePie = this.chartsData;
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

    "bar":this.saveBar,

    "pie":this.savePie,

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
        this.chartsData = this.sheetResponce.results.bar;
        this.createSvg();
        this.drawBars(this.chartsData);
        this.bar = true;
        this.table = false;
          this.pie = false;
          this.line = false;
          this.area = false;
       }
       if(responce.chart_id == "24"){
        this.chartsData = this.sheetResponce.results.pie;
        this.createSvgPie();
        this.createColors();
        this.drawChartPie();
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
}
