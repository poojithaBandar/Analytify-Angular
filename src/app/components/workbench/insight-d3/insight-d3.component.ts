import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-insight-d3',
  standalone: true,
  templateUrl: './insight-d3.component.html',
  styleUrl: './insight-d3.component.scss'
})
export class InsightD3Component implements OnChanges {
  @Input() chartType!: string;
  @Input() chartsRowData: any;
  @Input() chartsColumnData: any;
  @Input() dualAxisColumnData: any;
  @Input() dualAxisRowData: any;
  @Input() tablePreviewRow: any;

  @Input() xGridSwitch: boolean = true;
  @Input() yGridSwitch: boolean = true;
  @Input() xLabelSwitch: boolean = true;
  @Input() yLabelSwitch: boolean = true;
  @Input() xLabelFontFamily: string = 'inherit';
  @Input() xLabelFontSize: number = 12;
  @Input() xlabelFontWeight: string | number = 'normal';
  @Input() yLabelFontFamily: string = 'inherit';
  @Input() yLabelFontSize: number = 12;
  @Input() ylabelFontWeight: number = 400;
  @Input() backgroundColor: string = '#ffffff';
  @Input() color: string = 'steelblue';
  @Input() barColor: string = '';
  @Input() lineColor: string = '';
  @Input() areaColor: string = '';
  @Input() gridColor: string = '#e0e0e0';
  @Input() legendSwitch: boolean = true;
  @Input() dataLabels: boolean = false;
  @Input() label: any;
  @Input() donutSize: number = 0;
  @Input() isDistributed: boolean = false;
  @Input() minValueGuage: any;
  @Input() maxValueGuage: any;
  @Input() legendsAllignment: any;
  @Input() dataLabelsFontFamily: string = 'inherit';
  @Input() dataLabelsFontSize: number = 12;
  @Input() dataLabelsFontPosition: any;
  @Input() dataLabelsColor: string = '#000';
  @Input() measureAlignment: any;
  @Input() dimensionAlignment: any;
  @Input() displayUnits: any;
  @Input() decimalPlaces: any;
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() donutDecimalPlaces: any;
  @Input() drillDownIndex: any;
  @Input() draggedDrillDownColumns: any;
  @Input() drillDownObject: any;
  @Input() sortType: any;
  @Input() isSheetSaveOrUpdate: any;
  @Input() dataLabelsBarFontPosition: any;
  @Input() dataLabelsLineFontPosition: any;
  @Input() selectedColorScheme: string[] = [];
  @Input() measureColor: string = '';
  @Input() dimensionColor: string = '';
  @Input() xGridColor: string = '#e0e0e0';
  @Input() xLabelColor: string = '#000';
  @Input() yGridColor: string = '#e0e0e0';
  @Input() yLabelColor: string = '#000';
  @Input() isZoom: boolean = false;
  @Input() isBold: any;

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  ngOnChanges(_changes: SimpleChanges): void {
    this.renderChart();
  }

  private clear(): void {
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();
  }

  private renderChart(): void {
    // this.clear();

    switch (this.chartType) {
      case 'bar':
        this.renderBar();
        break;
      case 'line':
        this.renderLine();
        break;
      case 'area':
        this.renderArea();
        break;
      case 'pie':
      case 'donut':
        this.renderPie();
        break;
      case 'scatter':
      case 'bubble':
        this.renderScatter();
        break;
      default:
        console.warn(`Unsupported chart type: ${this.chartType}`);
    }
  }

  private renderBar(): void {
    const data: number[] = (this.chartsRowData || []) as number[];
    const labels: string[] = (this.chartsColumnData || []) as string[];
    const width = this.chartContainer.nativeElement.clientWidth;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', this.backgroundColor);

    const x = d3
      .scaleBand()
      .domain(labels)
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append('g')
      .attr('fill', this.barColor || this.color || this.selectedColorScheme[0])
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (_d, i) => x(labels[i])!)
      .attr('y', (d: number) => y(d))
      .attr('height', (d: number) => y(0) - y(d))
      .attr('width', x.bandwidth());

    const xAxis = svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(this.xGridSwitch ? -height + margin.top + margin.bottom : 0));
    xAxis.selectAll('line').attr('stroke', this.xGridColor);
    xAxis.selectAll('text')
      .style('display', this.xLabelSwitch ? null : ('none' as any))
      .attr('font-family', this.xLabelFontFamily)
      .attr('font-size', this.xLabelFontSize)
      .attr('font-weight', this.xlabelFontWeight)
      .attr('fill', this.xLabelColor);

    const yAxis = svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(this.yGridSwitch ? -width + margin.left + margin.right : 0));
    yAxis.selectAll('line').attr('stroke', this.yGridColor);
    yAxis.selectAll('text')
      .style('display', this.yLabelSwitch ? null : ('none' as any))
      .attr('font-family', this.yLabelFontFamily)
      .attr('font-size', this.yLabelFontSize)
      .attr('font-weight', this.ylabelFontWeight)
      .attr('fill', this.yLabelColor);

    if (this.dataLabels) {
      svg
        .append('g')
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', (_d, i) => (x(labels[i])! + x.bandwidth() / 2))
        .attr('y', (d: number) => y(d) - 4)
        .attr('text-anchor', 'middle')
        .attr('font-family', this.dataLabelsFontFamily)
        .attr('font-size', this.dataLabelsFontSize)
        .attr('font-weight', this.isBold ? 'bold' : 'normal')
        .attr('fill', this.dataLabelsColor)
        .text((d: any) => d);
    }
  }

  private renderLine(): void {
    const data: number[] = (this.chartsRowData || []) as number[];
    const labels: string[] = (this.chartsColumnData || []) as string[];
    const width = this.chartContainer.nativeElement.clientWidth;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', this.backgroundColor);

    const x = d3
      .scalePoint()
      .domain(labels)
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<number>()
      .x((d, i) => x(labels[i])!)
      .y(d => y(d));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', this.lineColor || this.color || this.selectedColorScheme?.[0] || 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    const xAxis = svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(this.xGridSwitch ? -height + margin.top + margin.bottom : 0));
    xAxis.selectAll('line').attr('stroke', this.xGridColor);
    xAxis.selectAll('text')
      .style('display', this.xLabelSwitch ? null : ('none' as any))
      .attr('font-family', this.xLabelFontFamily)
      .attr('font-size', this.xLabelFontSize)
      .attr('font-weight', this.xlabelFontWeight)
      .attr('fill', this.xLabelColor);

    const yAxis = svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(this.yGridSwitch ? -width + margin.left + margin.right : 0));
    yAxis.selectAll('line').attr('stroke', this.yGridColor);
    yAxis.selectAll('text')
      .style('display', this.yLabelSwitch ? null : ('none' as any))
      .attr('font-family', this.yLabelFontFamily)
      .attr('font-size', this.yLabelFontSize)
      .attr('font-weight', this.ylabelFontWeight)
      .attr('fill', this.yLabelColor);

    if (this.dataLabels) {
      svg
        .append('g')
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', (_d, i) => x(labels[i])!)
        .attr('y', d => y(d) - 4)
        .attr('text-anchor', 'middle')
        .attr('font-family', this.dataLabelsFontFamily)
        .attr('font-size', this.dataLabelsFontSize)
        .attr('font-weight', this.isBold ? 'bold' : 'normal')
        .attr('fill', this.dataLabelsColor)
        .text((d: any) => d);
    }
  }

  private renderArea(): void {
    const data: number[] = (this.chartsRowData || []) as number[];
    const labels: string[] = (this.chartsColumnData || []) as string[];
    const width = this.chartContainer.nativeElement.clientWidth;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', this.backgroundColor);

    const x = d3
      .scalePoint()
      .domain(labels)
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const area = d3
      .area<number>()
      .x((d, i) => x(labels[i])!)
      .y0(y(0))
      .y1(d => y(d));

    svg
      .append('path')
      .datum(data)
      .attr('fill', this.areaColor || this.color || this.selectedColorScheme?.[0] || 'steelblue')
      .attr('d', area);

    const xAxis = svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(this.xGridSwitch ? -height + margin.top + margin.bottom : 0));
    xAxis.selectAll('line').attr('stroke', this.xGridColor);
    xAxis.selectAll('text')
      .style('display', this.xLabelSwitch ? null : ('none' as any))
      .attr('font-family', this.xLabelFontFamily)
      .attr('font-size', this.xLabelFontSize)
      .attr('font-weight', this.xlabelFontWeight)
      .attr('fill', this.xLabelColor);

    const yAxis = svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(this.yGridSwitch ? -width + margin.left + margin.right : 0));
    yAxis.selectAll('line').attr('stroke', this.yGridColor);
    yAxis.selectAll('text')
      .style('display', this.yLabelSwitch ? null : ('none' as any))
      .attr('font-family', this.yLabelFontFamily)
      .attr('font-size', this.yLabelFontSize)
      .attr('font-weight', this.ylabelFontWeight)
      .attr('fill', this.yLabelColor);

    if (this.dataLabels) {
      svg
        .append('g')
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', (_d, i) => x(labels[i])!)
        .attr('y', d => y(d) - 4)
        .attr('text-anchor', 'middle')
        .attr('font-family', this.dataLabelsFontFamily)
        .attr('font-size', this.dataLabelsFontSize)
        .attr('font-weight', this.isBold ? 'bold' : 'normal')
        .attr('fill', this.dataLabelsColor)
        .text((d: any) => d);
    }
  }

  private renderPie(): void {
    const data = this.chartsRowData || [];
    const labels = this.chartsColumnData || [];
    const width = this.chartContainer.nativeElement.clientWidth;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3
      .scaleOrdinal<string>()
      .range(this.selectedColorScheme.length ? this.selectedColorScheme : (this.selectedColorScheme || d3.schemeCategory10));

    const arc = d3
      .arc<d3.PieArcDatum<number>>()
      .innerRadius(this.chartType === 'donut' ? radius * (this.donutSize || 0.5) : 0)
      .outerRadius(radius);

    const pie = d3.pie<number>().value(d => d);

    const slices = svg
      .selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', (d, i) => color(labels[i]));

    if (this.legendSwitch) {
      const legend = svg
        .append('g')
        .attr('transform', `translate(${radius + 20},${-radius})`);
      labels.forEach((l: string, i: number) => {
        const g = legend.append('g').attr('transform', `translate(0, ${i * 20})`);
        g.append('rect').attr('width', 12).attr('height', 12).attr('fill', color(l));
        g.append('text').attr('x', 16).attr('y', 10).text(l).attr('font-size', 12);
      });
    }
  }

  private renderScatter(): void {
    const data: any[] = this.chartsRowData || [];
    const width = this.chartContainer.nativeElement.clientWidth;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', this.backgroundColor);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d: any) => d[0]) as unknown as [number, number])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d: any) => d[1]) as unknown as [number, number])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(this.xGridSwitch ? -height + margin.top + margin.bottom : 0));
    xAxis.selectAll('line').attr('stroke', this.xGridColor);
    xAxis.selectAll('text')
      .style('display', this.xLabelSwitch ? null : ('none' as any))
      .attr('font-family', this.xLabelFontFamily)
      .attr('font-size', this.xLabelFontSize)
      .attr('font-weight', this.xlabelFontWeight)
      .attr('fill', this.xLabelColor);

    const yAxis = svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(this.yGridSwitch ? -width + margin.left + margin.right : 0));
    yAxis.selectAll('line').attr('stroke', this.yGridColor);
    yAxis.selectAll('text')
      .style('display', this.yLabelSwitch ? null : ('none' as any))
      .attr('font-family', this.yLabelFontFamily)
      .attr('font-size', this.yLabelFontSize)
      .attr('font-weight', this.ylabelFontWeight)
      .attr('fill', this.yLabelColor);

    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => x(d[0]))
      .attr('cy', (d: any) => y(d[1]))
      .attr('r', this.chartType === 'bubble' ? (d: any) => d[2] || 5 : 5)
      .attr('fill', this.color || this.selectedColorScheme?.[0]);
  }
}
