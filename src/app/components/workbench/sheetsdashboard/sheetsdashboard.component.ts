import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import {CompactType, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterModule, GridsterPush, GridType} from 'angular-gridster2';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ApexOptions, ChartComponent, ChartType, NgApexchartsModule } from 'ng-apexcharts';
import ApexCharts from 'apexcharts';
type DashboardItem = GridsterItem & { 
  data?: { title: string, content: string }, 
  chartOptions?: ApexOptions
  initCallback?: (item: GridsterItem, itemComponent: GridsterItemComponent) => void 
};
@Component({
  selector: 'app-sheetsdashboard',
  standalone: true,
  imports: [NgbModule,CommonModule,ResizableModule,GridsterModule,MatCardModule,MatGridListModule,CommonModule,GridsterItemComponent,NgxEchartsModule,NgApexchartsModule  ],
  templateUrl: './sheetsdashboard.component.html',
  styleUrl: './sheetsdashboard.component.scss'
})
export class SheetsdashboardComponent {
  // options!: GridsterConfig;
  // dashboard!: CustomGridsterItem[];

  // ngOnInit() {
  //   this.options = {
  //     draggable: {
  //       enabled: true
  //     },
  //     resizable: {
  //       enabled: true
  //     }
  //   };

  //   this.dashboard = [
  //     { cols: 2, rows: 1, y: 0, x: 0, title: 'Widget 1', content: 'Content 1' },
  //     { cols: 2, rows: 2, y: 0, x: 2, title: 'Widget 2', content: 'Content 2' },
  //     { cols: 1, rows: 1, y: 0, x: 4, title: 'Widget 3', content: 'Content 3' }
  //   ];
  // }

  // options: any;
  // dashboardItems: any[];
  options!: GridsterConfig;
  dashboard!: Array<GridsterItem & { data?: any,   chartOptions?: ApexOptions,  chartInstance?: ApexCharts

  }>;
  itemToPush!: GridsterItemComponent;
  @ViewChildren(GridsterItemComponent) GridsterItemComponent!: QueryList<GridsterItemComponent>;
  @ViewChild('gridster') gridster!: any; // Adjust the type as needed

  
  ngOnInit() {  

    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      pushItems: true,
      draggable: {
        enabled: true,
        
      },
      resizable: {
        enabled: true,

      }
    };

    this.dashboard = [
      {cols: 2, rows: 1, y: 0, x: 0, data: { title: 'Card 1', content: 'Content of card 1' },
      chartOptions: {
        ...this.getChartOptions('bar'),
        chart: { type: 'bar', height: 300 } // Example of another chart type
      }
    },
      {cols: 2, rows: 2, y: 0, x: 2,data: { title: 'Card 2', content: 'Content of card 2' },
      chartOptions: {
        ...this.getChartOptions('line'),
        chart: { type: 'line', height: 300 } // Example of another chart type
      }
    },
      // {cols: 1, rows: 1, y: 0, x: 4},
      // {cols: 3, rows: 2, y: 1, x: 4},
      // {cols: 1, rows: 1, y: 4, x: 5},
      // {cols: 1, rows: 1, y: 2, x: 1},
      // {cols: 2, rows: 2, y: 5, x: 5},
      // {cols: 2, rows: 2, y: 3, x: 2},
      // {cols: 2, rows: 1, y: 2, x: 2},
      // {cols: 1, rows: 1, y: 3, x: 4},
      // {cols: 1, rows: 1, y: 0, x: 6}
    ];
  }

  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem($event:any, item:any) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem() {
    this.dashboard.push({x: 0, y: 0, cols: 1, rows: 1,data: { title: 'New Card', content: 'New card content' }, 
    chartOptions: this.getChartOptions('bar')});
  }

  initItem(item: GridsterItem, itemComponent: GridsterItemComponent) {
    this.itemToPush = itemComponent;
  }

  // pushItem() {
  //   const itemToPush = this.dashboard[0]; // Assuming you want to push the first item
  //   const itemComponent = this.getItemComponent(itemToPush); // Retrieve the GridsterItemComponent

  //   if (!itemComponent) return;
  //   const push = new GridsterPush(this.itemToPush); // init the service
  //   this.itemToPush.$item.rows += 4; // move/resize your item
  //   if (push.pushItems(push.fromNorth)) { // push items from a direction
  //     push.checkPushBack(); // check for items can restore to original position
  //     push.setPushedItems(); // save the items pushed
  //     this.itemToPush.setSize();
  //     this.itemToPush.checkItemChanges(this.itemToPush.$item, this.itemToPush.item);
  //     this.updateChartDimensions(itemToPush);
  //     this.updateCardData(itemToPush);
  //     this.updateChartData(itemToPush);
  //   } else {
  //     this.itemToPush.$item.rows -= 4;
  //     push.restoreItems(); // restore to initial state the pushed items
  //   }
  //   push.destroy(); // destroy push instance
  //   // similar for GridsterPushResize and GridsterSwap
  // }

  pushItem() {
    // 
    const itemToPush = this.dashboard[0];
    const gridsterItemComponent = this.getItemComponent(itemToPush);

    if (!gridsterItemComponent) return;

    const push = new GridsterPush(gridsterItemComponent);
    gridsterItemComponent.$item.rows += 4;
    if (push.pushItems(push.fromNorth)) {
      push.checkPushBack();
      push.setPushedItems();
      gridsterItemComponent.setSize();
      gridsterItemComponent.checkItemChanges(gridsterItemComponent.$item, gridsterItemComponent.item);
      this.updateChartDimensions(itemToPush);
    } else {
      gridsterItemComponent.$item.rows -= 4;
      push.restoreItems();
    }
    push.destroy();
  }

  updateChartDimensions(item: GridsterItem) {
    // Example of updating chart dimensions after resizing
    // const itemComponent = this.getItemComponent(item);
    // if (itemComponent && item['chartInstance']) {
    //   item['chartOptions'].chart.height = itemComponent.$item.rows * 50; // Adjust height based on row span
    //   item['chartInstance'].updateOptions(item['chartOptions']);
    // }
    const gridsterItemComponent = this.getItemComponent(item);
    if (gridsterItemComponent && item['chartInstance']) {
      item['chartOptions'].chart = {
        ...item['chartOptions'].chart,
        width: gridsterItemComponent.el.clientWidth,
        height: gridsterItemComponent.el.clientHeight
      };
      item['chartInstance'].updateOptions(item['chartOptions']);
    }
  }
  updateCardData(item: DashboardItem) {
    // Example of updating card content based on item properties
    if (item.data) {
      item.data.title = `Card ${item.x + 1}`;
      item.data.content = `Content of card ${item.x + 1}`;
    }
  }
  updateChartData(item: DashboardItem) {
    // Example of updating chart data based on item properties
    if (item.chartOptions) {
      item.chartOptions.series = [{
        name: 'Series 1',
        data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100]
      }];
      if (item['chartInstance']) {
        item['chartInstance'].updateOptions(item.chartOptions);
      }
    }
  }
  onResizeStop(item: GridsterItem, itemComponent: GridsterItemComponent) {
    // Handle resize stop event here
    this.updateChartDimensions(item);
  }

  getItemComponent(item: DashboardItem): GridsterItemComponent | undefined {
    return this.GridsterItemComponent.find(cmp => cmp.item === item);
  }
  getChartOptions(chartType: ChartType): ApexOptions {
    return {
      chart: {
        type: chartType,
        height:300
      },
      series: [{
        name: 'Series 1',
        data: [5, 20, 36, 10]
      }],
      xaxis: {
        categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4']
      }
    };
  }
  ngAfterViewInit() {
    // Adjust dimensions after the view initializes
    this.dashboard.forEach(item => this.updateChartDimensions(item));
  }
  onChartInit(event: any, item: DashboardItem) {
    item['chartInstance'] = event.chart;
  }
  resizeChart(item: DashboardItem) {
    this.updateChartDimensions(item);
  }
}
// export interface CustomGridsterItem extends GridsterItem {
//   title: string;
//   content: string;
// }
