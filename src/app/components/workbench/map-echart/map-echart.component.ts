import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import * as echarts from 'echarts';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';

@Component({
  selector: 'app-map-echart',
  standalone: true,
  imports: [NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: echarts }),
    },
  ],
  templateUrl: './map-echart.component.html',
  styleUrl: './map-echart.component.scss'
})
export class MapEchartComponent {
  eMapChartOptions: any;
  @Input() chartRowData! : any;
  @Input() chartColumnData! : any;
  constructor(private http: HttpClient){
    
  }
  ngOnInit(){
    this.loadMapData();
  }
  
  initChart(): void {
    // this.eMapChartOptions = {
    //   title: {
    //     text: 'USA Population Estimates (2012)',
    //     subtext: 'Data from www.census.gov',
    //     sublink: 'http://www.census.gov/popest/data/datasets.html',
    //     left: 'right'
    //   },
    //   tooltip: {
    //     trigger: 'item',
    //     showDelay: 0,
    //     transitionDuration: 0.2
    //   },
    //   visualMap: {
    //     left: 'right',
    //     min: 500000,
    //     max: 38000000,
    //     inRange: {
    //       color: [
    //         '#313695',
    //         '#4575b4',
    //         '#74add1',
    //         '#abd9e9',
    //         '#e0f3f8',
    //         '#ffffbf',
    //         '#fee090',
    //         '#fdae61',
    //         '#f46d43',
    //         '#d73027',
    //         '#a50026'
    //       ]
    //     },
    //     text: ['High', 'Low'],
    //     calculable: true
    //   },
    //   toolbox: {
    //     show: true,
    //     //orient: 'vertical',
    //     left: 'left',
    //     top: 'top',
    //     feature: {
    //       dataView: { readOnly: false },
    //       restore: {},
    //       saveAsImage: {}
    //     }
    //   },
    //   series: [
    //     {
    //       name: 'USA PopEstimates',
    //       type: 'map',
    //       roam: true,
    //       map: 'USA',
    //       emphasis: {
    //         label: {
    //           show: true
    //         }
    //       },
    //       data: [
    //         { name: 'Alabama', value: 4822023 },
    //         { name: 'Alaska', value: 731449 },
    //         { name: 'Arizona', value: 6553255 },
    //         { name: 'Arkansas', value: 2949131 },
    //         { name: 'California', value: 38041430 },
    //         { name: 'Colorado', value: 5187582 },
    //         { name: 'Connecticut', value: 3590347 },
    //         { name: 'Delaware', value: 917092 },
    //         { name: 'District of Columbia', value: 632323 },
    //         { name: 'Florida', value: 19317568 },
    //         { name: 'Georgia', value: 9919945 },
    //         { name: 'Hawaii', value: 1392313 },
    //         { name: 'Idaho', value: 1595728 },
    //         { name: 'Illinois', value: 12875255 },
    //         { name: 'Indiana', value: 6537334 },
    //         { name: 'Iowa', value: 3074186 },
    //         { name: 'Kansas', value: 2885905 },
    //         { name: 'Kentucky', value: 4380415 },
    //         { name: 'Louisiana', value: 4601893 },
    //         { name: 'Maine', value: 1329192 },
    //         { name: 'Maryland', value: 5884563 },
    //         { name: 'Massachusetts', value: 6646144 },
    //         { name: 'Michigan', value: 9883360 },
    //         { name: 'Minnesota', value: 5379139 },
    //         { name: 'Mississippi', value: 2984926 },
    //         { name: 'Missouri', value: 6021988 },
    //         { name: 'Montana', value: 1005141 },
    //         { name: 'Nebraska', value: 1855525 },
    //         { name: 'Nevada', value: 2758931 },
    //         { name: 'New Hampshire', value: 1320718 },
    //         { name: 'New Jersey', value: 8864590 },
    //         { name: 'New Mexico', value: 2085538 },
    //         { name: 'New York', value: 19570261 },
    //         { name: 'North Carolina', value: 9752073 },
    //         { name: 'North Dakota', value: 699628 },
    //         { name: 'Ohio', value: 11544225 },
    //         { name: 'Oklahoma', value: 3814820 },
    //         { name: 'Oregon', value: 3899353 },
    //         { name: 'Pennsylvania', value: 12763536 },
    //         { name: 'Rhode Island', value: 1050292 },
    //         { name: 'South Carolina', value: 4723723 },
    //         { name: 'South Dakota', value: 833354 },
    //         { name: 'Tennessee', value: 6456243 },
    //         { name: 'Texas', value: 26059203 },
    //         { name: 'Utah', value: 2855287 },
    //         { name: 'Vermont', value: 626011 },
    //         { name: 'Virginia', value: 8185867 },
    //         { name: 'Washington', value: 6897012 },
    //         { name: 'West Virginia', value: 1855413 },
    //         { name: 'Wisconsin', value: 5726398 },
    //         { name: 'Wyoming', value: 576412 },
    //         { name: 'Puerto Rico', value: 3667084 }
    //       ]
    //     }
    //   ]
    // };

    const mergedArray = this.chartColumnData.map((name : any, index : number) => {
      // Create an object with 'name' and 'age' using the values from both arrays
      return {
        name: name,  // Take the value from array1
        value: this.chartRowData[index]  // Take the corresponding value from array2
      };
    });
    const minData = Math.min(...this.chartRowData);

// Find the maximum value
const maxData = Math.max(...this.chartRowData);
    
    this.eMapChartOptions = {
      tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2
          },
      visualMap: {
        min: minData,
        max: maxData,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        inRange: {
          // color: ['#e0ffff', '#006edd', '#ff0000']
         color: ['lightskyblue', 'yellow', 'orangered']
        //  color: [
         
        //     '#4575b4',
        //     '#74add1',
        //     '#abd9e9',
        //     '#e0f3f8',
        //     '#ffffbf',
        //     '#fee090',
        //     '#fdae61',
        //     '#f46d43',
        //     '#d73027',
        //     '#a50026'
        //   ]  // Color gradient for map areas
        }
      },
      series: [{
        type: 'map',
        map: 'world',
          // Use the registered map name
        roam: true,  
        emphasis: {
                  label: {
                    show: true
                  }
                },  // Allow zooming and panning
        itemStyle: {
          emphasis: {
            areaColor: '#a7f1f8'  // Highlight color on hover
          }
        },
        
    
        data: mergedArray
      }]
    };

    // Set the options on the chart
  }
  loadMapData(): void {
    // Load the GeoJSON for the world map from assets
    this.http.get('./assets/maps/world.json').subscribe((geoJson: any) => {
      echarts.registerMap('world', geoJson);  // Register the map data

      // Initialize the chart after the map is registered
      this.initChart();
    });
    // this.http.get('./assets/maps/USA.json').subscribe((geoJson: any) => {
    //   echarts.registerMap('USA', geoJson,{
    //     Alaska: {
    //       left: -131,
    //       top: 25,
    //       width: 15
    //     },
    //     Hawaii: {
    //       left: -110,
    //       top: 28,
    //       width: 5
    //     },
    //     'Puerto Rico': {
    //       left: -76,
    //       top: 26,
    //       width: 2
    //     }
    //   });  // Register the map data

    //   // Initialize the chart after the map is registered
    //   this.initChart();
    // });
  }
}
