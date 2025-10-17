import { TestBed } from '@angular/core/testing';
import { ChartRenderService } from './chart-render.service';

describe('ChartRenderService', () => {
  let service: ChartRenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartRenderService);
  });

  it('should map chart id 18 to treemap', () => {
    const config = service.getChartConfig(18);
    expect(config).toBeTruthy();
    expect(config?.chartType).toBe('treemap');
    expect(config?.flags.treemap).toBeTrue();
  });

  it('should map chart id 21 to wordcloud', () => {
    const config = service.getChartConfig(21);
    expect(config).toBeTruthy();
    expect(config?.chartType).toBe('wordcloud');
    expect((config as any).flags.wordcloud).toBeTrue();
  });

  it('should map chart id 19 to scatter', () => {
    const config = service.getChartConfig(19);
    expect(config).toBeTruthy();
    expect(config?.chartType).toBe('scatter');
    expect((config as any).flags.scatter).toBeTrue();
  });
});
