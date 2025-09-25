import { Injectable } from '@angular/core';
import OpenAI from 'openai';

interface SheetPayload {
  id: string;
  x: number;
  y: number;
  rows: number;
  cols: number;
  sheetType: string;
  chartType: string;
  chartId?: number;
  isEChart: boolean;
  data?: {
    title?: string;
    sheetTagName?: string;
  };
  chartOptions?: Record<string, any>;
  echartOptions?: Record<string, any>;
  customizeOptions?: Record<string, any>;
  column_Data?: any[];
  row_Data?: any[];
  chartData?: any[];
  numberFormat?: Record<string, any>;
  kpiData?: Record<string, any> | null;
}

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  constructor() { }

  private openai = new OpenAI({
    apiKey: '',  //
    dangerouslyAllowBrowser: true,  // Only for testing
  });

  private readonly defaultCustomizeOptions = {
    backgroundColor: '#ffffff',
    color: '#2392c1',
    selectedColorScheme: ['#1d2e92', '#088ed2'],
    isMeasureDistribution: false,
    xLabelSwitch: true,
    yLabelSwitch: true,
    xLabelFontSize: 12,
    yLabelFontSize: 12,
    xLabelFontFamily: 'sans-serif',
    yLabelFontFamily: 'sans-serif',
    xlabelFontWeight: 400,
    ylabelFontWeight: 400,
    dimensionAlignment: 'center',
    measureAlignment: 'center',
    gridColor: '#e0e0e0',
    xGridSwitch: true,
    yGridSwitch: true,
    barCornerRadius: 4,
    dataLabels: true,
    dataLabelsFontSize: 12,
    dataLabelsFontFamily: 'sans-serif',
    dataLabelsColor: '#2392c1',
    isBold: false,
    dataLabelsFontPosition: 'top',
    legendSwitch: true,
    legendsAllignment: 'bottom',
    donutSize: 70,
    donutDecimalPlaces: 2,
  };

  private layoutCache = new Map<string, any>();

  private readonly chartTypeToId: Record<string, number> = {
    table: 1,
    hstacked: 2,
    'horizontal stacked': 2,
    hgrouped: 3,
    'bar-line': 4,
    'stacked-bar': 5,
    bar: 6,
    'side-bar': 7,
    'multi-line': 8,
    pivot: 9,
    donut: 10,
    calendar: 11,
    radar: 12,
    line: 13,
    area: 17,
    pie: 24,
    kpi: 25,
    'heat map': 26,
    funnel: 27,
    gauge: 28,
    map: 29,
    'world map': 29,
  };

  async getChartOptions(data: any, userPrompt?: any): Promise<any> {
    const sheets = this.buildSheetPayload(data);
    const prompt = typeof userPrompt === 'string' ? userPrompt.trim() : '';
    const cacheKey = this.buildCacheKey(sheets, prompt);

    if (this.layoutCache.has(cacheKey)) {
      return this.clone(this.layoutCache.get(cacheKey));
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: this.buildSystemPrompt(),
        },
        {
          role: 'user',
          content: JSON.stringify({
            sheets,
            prompt,
          }),
        },
      ],
    });

    const content = this.extractContent(response);

    try {
      const layout = JSON.parse(content);
      const hydrated = this.hydrateLayout(layout);
      this.layoutCache.set(cacheKey, hydrated);
      return this.clone(hydrated);
    } catch (err) {
      console.error('❌ Failed to parse chart options', err, content);
      throw err;
    }
  }

  private buildSheetPayload(data: any): SheetPayload[] {
    const sheets: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.sheets)
      ? data.sheets
      : [];

    return sheets.map((sheet: any, index: number) => {
      const id = typeof sheet?.id === 'string' && sheet.id ? sheet.id : `sheet-${index}`;
      const chartType = sheet?.chartType ?? sheet?.chart_type ?? 'bar';
      const chartId = sheet?.chartId ?? sheet?.chart_id ?? this.chartTypeToId[String(chartType).toLowerCase()];
      const isEChart = sheet?.isEChart ?? sheet?.library === 'echart';
      const grid = {
        x: Number.isFinite(sheet?.x) ? Number(sheet.x) : 0,
        y: Number.isFinite(sheet?.y) ? Number(sheet.y) : Math.floor(index / 2) * 8,
        rows: Number.isFinite(sheet?.rows) ? Number(sheet.rows) : sheet?.h ?? 8,
        cols: Number.isFinite(sheet?.cols) ? Number(sheet.cols) : sheet?.w ?? 6,
      };

      return {
        id,
        x: grid.x,
        y: grid.y,
        rows: grid.rows,
        cols: grid.cols,
        sheetType: sheet?.sheetType ?? 'Chart',
        chartType,
        chartId,
        isEChart: Boolean(isEChart),
        data: sheet?.data ?? {
          title: sheet?.sheet_name ?? 'Untitled Chart',
          sheetTagName: sheet?.data?.sheetTagName ?? `<p>${sheet?.sheet_name ?? 'Untitled Chart'}</p>`,
        },
        chartOptions: sheet?.chartOptions ?? {},
        echartOptions: sheet?.echartOptions ?? {},
        customizeOptions: sheet?.customizeOptions ?? this.defaultCustomizeOptions,
        column_Data: sheet?.column_Data ?? sheet?.columns ?? [],
        row_Data: sheet?.row_Data ?? sheet?.rows ?? [],
        chartData: sheet?.chartData ?? [],
        numberFormat: sheet?.numberFormat ?? {
          decimalPlaces: 2,
          prefix: '',
          suffix: '',
        },
        kpiData: sheet?.kpiData ?? null,
      } satisfies SheetPayload;
    });
  }

  private hydrateLayout(layout: any): any[] {
    if (!Array.isArray(layout)) {
      throw new Error('LLM response must be an array');
    }

    return layout.map((item: any) => ({
      ...item,
      customizeOptions: {
        ...this.defaultCustomizeOptions,
        ...(item?.customizeOptions ?? {}),
      },
    }));
  }

  private buildCacheKey(sheets: SheetPayload[], prompt: string): string {
    return JSON.stringify({ sheets, prompt });
  }

  private buildSystemPrompt(): string {
    return `You convert sheet metadata into a Gridster layout JSON array for an Angular dashboard.
Requirements:
- Always respond with a raw JSON array (no Markdown).
- Each item must include: id, x, y, rows, cols, sheetType, chartType, chartId, isEChart, chartOptions, echartOptions, data, chartData, column_Data, row_Data, numberFormat, customizeOptions, kpiData (when applicable).
- Respect existing ids and grid positions when provided.
- Keep KPI tiles square and aligned at the top rows when multiple KPIs exist.
- If isEChart=true use echartOptions only; if false use chartOptions only.
- When prompt asks for updates, modify only relevant charts.
- Always supply customizeOptions and numberFormat. Use provided defaults when values are missing.
- Apply chart instructions such as "2 charts per row" or "change bar to pie" using the Gridster coordinates.
- Use chartId mapping already supplied in the payload. If missing, infer based on chartType.
- Ensure JSON is syntactically valid.`;
  }

  private extractContent(response: OpenAI.Chat.Completions.ChatCompletion): string {
    let content = response.choices[0].message?.content || '';
    content = content.replace(/```json|```/g, '').trim();
    content = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    return content;
  }

  private clone<T>(value: T): T {
    if (typeof structuredClone === 'function') {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  }
}
