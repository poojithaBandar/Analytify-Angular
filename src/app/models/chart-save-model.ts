export interface AxisConfig {
  xAxis: any;
  yAxis: any;
  type: 'single' | 'dual';
}

export interface ChartSaveModel {
  axisConfig: AxisConfig;
  savedChartOptions: any;
}
