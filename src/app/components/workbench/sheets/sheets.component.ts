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
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexTitleSubtitle,
  ApexFill,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexGrid,
  ApexTheme,
  ApexResponsive,
} from 'ng-apexcharts';
import * as d3 from 'd3';
interface TableRow {
  [key: string]: any;
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart?: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  xaxis?: ApexXAxis;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  stroke?: ApexStroke;
  legend?: ApexLegend;
  title?: ApexTitleSubtitle;
  colors?: string[];
  grid?: ApexGrid;
  markers?: ApexMarkers;
  labels: string[];
  theme?: ApexTheme;
  responsive: ApexResponsive[];
};
@Component({
  selector: 'app-sheets',
  standalone: true,
  imports: [SharedModule,NgSelectModule,NgbModule,FormsModule,ReactiveFormsModule,CdkDropListGroup, CdkDropList, CdkDrag],
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
  rowdataPreview = [] as any;
  tableData: TableRow[] = [];
  displayedColumns: string[] = [];
  public barChartOptions!: Partial<ChartOptions>

  private data = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];
  //Bar
  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  //Pie
  private widthPie = 750;
  private heightPie = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors:any;
  chartsData = [] as any;
  constructor(private workbechService:WorkbenchService){   
  }

  ngOnInit(): void {
    this.columnsData();
    this.createSvg();
    this.drawBars(this.data);
    this.createSvgPie();
    this.createColors();
    this.drawChartPie();
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
  .domain(data.map(d => d.Framework))
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
  .domain([0, 200000])
  .range([this.height, 0]);

  // Draw the Y-axis on the DOM
  this.svg.append("g")
  .call(d3.axisLeft(y));

  // Create and fill the bars
  this.svg.selectAll("bars")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d: any) => x(d.Framework))
  .attr("y", (d: any) => y(d.Stars))
  .attr("width", x.bandwidth())
  .attr("height", (d: any) => this.height - y(d.Stars))
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
  .domain(this.data.map(d => d.Stars.toString()))
  .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
}
private drawChartPie(): void {
  // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.Stars));

  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
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
  .data(pie(this.data))
  .enter()
  .append('text')
  .text((d: any)=> d.data.Framework)
  .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);
}
  columnsData(){
    const obj={
      "db_id":"182",
      "queryset_id":"254",
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
    this.rowdataPreview = [];
    this.tableData = [];
      const obj={
          "database_id":182,
          "queryset_id":254,
          "col":this.draggedColumnsData,
          "row":this.draggedRowsData,
          "filter_id": [60]
      }
    this.workbechService.getDataExtraction(obj).subscribe({next: (responce:any) => {
          console.log(responce);
          this.tablePreviewColumn = responce.data[0].col;
          this.tablePreviewRow = responce.data[0].row;
          console.log(this.tablePreviewColumn);
          console.log(this.tablePreviewRow);
          this.chartsData= responce.data[0].col;
          console.log(this.chartsData)
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
          console.log()
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
     
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
    this.enableDisableCharts();
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
  barChartDisplay(){
    alert("bar")
  }
  enableDisableCharts(){
    this.draggedColumnsData;
    this.draggedRowsData;
    const obj={
        "db_id":"182",
        "col":this.draggedColumnsData,
  }
    this.workbechService.getChartsEnableDisable(obj).subscribe({next: (responce:any) => {
          console.log(responce);
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }
}
