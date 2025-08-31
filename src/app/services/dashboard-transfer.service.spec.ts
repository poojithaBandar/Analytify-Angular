import { DashboardTransferService } from './dashboard-transfer.service';

describe('DashboardTransferService', () => {
  let service: DashboardTransferService;

  beforeEach(() => {
    service = new DashboardTransferService({} as any, {} as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateChartOptions', () => {
    it('should update Apex treemap options', () => {
      const chartOptions: any = { series: [{ data: [] }] };
      const result = service.updateChartOptions(
        chartOptions,
        18,
        true,
        ['A', 'B'],
        [{ name: 'val', data: [10, 20] }]
      );
      expect(result.series[0].data).toEqual([
        { x: 'A', y: 10 },
        { x: 'B', y: 20 }
      ]);
    });

    it('should update Apex radial options', () => {
      const chartOptions: any = {};
      const result = service.updateChartOptions(
        chartOptions,
        20,
        true,
        ['A', 'B'],
        [{ name: 'val', data: [20, 40] }]
      );
      expect(result.series).toEqual([50, 100]);
      expect(result.labels).toEqual(['A', 'B']);
      expect(result.plotOptions.radialBar.max).toBe(40);
      const tooltipValue = result.tooltip.y.formatter(null, { seriesIndex: 1 });
      expect(tooltipValue).toBe(40);
    });

    it('should update ECharts treemap options', () => {
      const chartOptions: any = { series: [{ data: [] }] };
      const result = service.updateChartOptions(
        chartOptions,
        18,
        false,
        ['A', 'B'],
        [{ name: 'val', data: [10, 20] }]
      );
      expect(result.series[0].data).toEqual([
        { name: 'A', value: 10 },
        { name: 'B', value: 20 }
      ]);
    });
  });
});
