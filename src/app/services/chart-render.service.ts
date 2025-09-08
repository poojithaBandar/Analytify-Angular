import { Injectable } from '@angular/core';

export interface ChartFlags {
  table: boolean;
  bar: boolean;
  area: boolean;
  line: boolean;
  pie: boolean;
  sidebysideBar: boolean;
  stocked: boolean;
  barLine: boolean;
  horizentalStocked: boolean;
  grouped: boolean;
  multiLine: boolean;
  donut: boolean;
  radar: boolean;
  kpi: boolean;
  heatMap: boolean;
  funnel: boolean;
  guage: boolean;
  map: boolean;
  calendar: boolean;
  pivotTable: boolean;
  treemap: boolean;
  radial: boolean;
  sunburst: boolean;
}

export interface ChartConfig {
  chartType: string;
  flags: ChartFlags;
}

@Injectable({ providedIn: 'root' })
export class ChartRenderService {
  private baseFlags: ChartFlags = {
    table: false,
    bar: false,
    area: false,
    line: false,
    pie: false,
    sidebysideBar: false,
    stocked: false,
    barLine: false,
    horizentalStocked: false,
    grouped: false,
    multiLine: false,
    donut: false,
    radar: false,
    kpi: false,
    heatMap: false,
    funnel: false,
    guage: false,
    map: false,
    calendar: false,
    pivotTable: false,
    treemap: false,
    radial: false,
    sunburst: false,
  };

  private chartConfigMap: Record<number, ChartConfig> = {
    6: { chartType: 'bar', flags: { ...this.baseFlags, bar: true } },
    17: { chartType: 'area', flags: { ...this.baseFlags, area: true } },
    13: { chartType: 'line', flags: { ...this.baseFlags, line: true } },
    24: { chartType: 'pie', flags: { ...this.baseFlags, pie: true } },
    7: { chartType: 'sidebyside', flags: { ...this.baseFlags, sidebysideBar: true } },
    5: { chartType: 'stocked', flags: { ...this.baseFlags, stocked: true } },
    4: { chartType: 'barline', flags: { ...this.baseFlags, barLine: true } },
    2: { chartType: 'hstocked', flags: { ...this.baseFlags, horizentalStocked: true } },
    3: { chartType: 'hgrouped', flags: { ...this.baseFlags, grouped: true } },
    8: { chartType: 'multiline', flags: { ...this.baseFlags, multiLine: true } },
    10: { chartType: 'donut', flags: { ...this.baseFlags, donut: true } },
    12: { chartType: 'radar', flags: { ...this.baseFlags, radar: true } },
    26: { chartType: 'heatmap', flags: { ...this.baseFlags, heatMap: true } },
    27: { chartType: 'funnel', flags: { ...this.baseFlags, funnel: true } },
    28: { chartType: 'guage', flags: { ...this.baseFlags, guage: true } },
    29: { chartType: 'map', flags: { ...this.baseFlags, map: true } },
    11: { chartType: 'calendar', flags: { ...this.baseFlags, calendar: true } },
    18: { chartType: 'treemap', flags: { ...this.baseFlags, treemap: true } },
    20: { chartType: 'radial', flags: { ...this.baseFlags, radial: true } },
    19: { chartType: 'sunburst', flags: { ...this.baseFlags, sunburst: true } },
  };

  getChartConfig(chartId: number): ChartConfig | undefined {
    return this.chartConfigMap[chartId];
  }
}
