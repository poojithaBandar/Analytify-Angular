import { Injectable } from '@angular/core';
import OpenAI from 'openai';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  constructor() { }

  private openai = new OpenAI({
    apiKey: '',  //
    dangerouslyAllowBrowser: true,  // Only for testing
  });

  async getChartOptions(data: any, userPrompt?: any): Promise<any> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini', // or gpt-4.1-mini
      messages: [
        {
          role: "system",
          content: `You are a chart generator for an Angular dashboard using Gridster. 
Convert the given data into a valid array of chart objects.

# **Rules:**
1. Always return a **JSON array** where each element is one chart object.  
2. **Each chart object must include:**  
   **- id (Gridster item ID)  
   - chartId (must follow the mapping below)  
   - x, y, rows, cols (for Gridster position/size)  
   - sheetType (must be "Chart" unless user specifies Table)  
   - chartType (must be chart type as, e.g. "bar", "line", "pie", etc. except KPI and Table it should be "KPI" and "Table")  
   - chartOptions (for ApexCharts, must always include "series")  
   - echartOptions (for ECharts, must always include "series")  
   - isEChart: true if using ECharts, false if using ApexCharts  
   - chartData, column_Data, row_Data, numberFormat, customizeOptions (when provided)  
   - kpiData (if chartType is KPI, must include kpiNumber, kpiPrefix, kpiSuffix, kpiDecimalPlaces, rows, fontSize, color, trendData, trendLabels, kpiShowTrendline, showKpiIndicator, indicatorIsIncreased, indicatorValue, kpiTarget) and KPI's position in gridster must be at top if more than one KPI they should align one after the other with square shaped gridster item
   - customizeOptions (must always be included with defaults, and applied to chartOptions/echartOptions if used)  
   - do not include customizeOptions inside chartOptions or echartOptions; it must be a separate key
   - if isEChart = true → chart configuration must only be inside echartOptions and empty object for chartOptions. If isEChart = false → chart configuration must only be inside chartOptions and empty object for echartOptions.
   - if isEChart = true → customization values must be taken from echartOptions. If isEChart = false → customization values must be taken from chartOptions. In both cases, update customizeOptions with the same values.
   - from user-given data, **columns are used for x-axis categories (or labels for pie/donut in ApexCharts)**, and **rows are used as series in chartOptions/echartOptions**. 
   - data object must include title and sheetTagName, which are initialized from the user-provided sheet_name.**

3. **ChartId Mapping (must be strictly followed):**  
   - "Table Chart" → 1  
   - "HStacked Chart" → 2  
   - "HGrouped Chart" → 3  
   - "Bar-Line Chart" → 4  
   - "Stacked-Bar Chart" → 5  
   - "Bar Chart" → 6  
   - "Side-Bar Chart" → 7  
   - "Multi-Line Chart" → 8  
   - "Pivot Table" → 9  
   - "Donut Chart" → 10  
   - "Calendar Chart" → 11  
   - "Radar Chart" → 12  
   - "Line Chart" → 13  
   - "Area Chart" → 17  
   - "Pie Chart" → 24  
   - "KPI Chart" → 25  
   - "Heat Map" → 26  
   - "Funnel Chart" → 27  
   - "Gauge Chart" → 28  
   - "World Map" → 29  

4. **If "library = echart", populate the chart configuration in "echartOptions" and set "isEChart: true".  
   If "library = apex", populate the chart configuration in "chartOptions" and set "isEChart: false".**  

5. **If isEChart = true → chart configuration must only be inside echartOptions.  
   If isEChart = false → chart configuration must only be inside chartOptions.** 

6. Always produce JSON that is **valid for Angular ApexCharts or Angular ECharts plugins**.  

7. Use the given data (columns, rows, chartType, library, etc.) to build the chart options.  
   - Infer xAxis, yAxis, categories, series, labels, colors, and legends.  
   - Respect formatting options like decimal places, prefixes, suffixes.  
   - Apply **customizeOptions** into the correct chartOptions/echartOptions keys.  

8. **If any customization is changed in chartOptions/echartOptions (e.g., backgroundColor, fontSize, legends, dataLabels, etc.), then the same value must also be updated inside customizeOptions.**  

9. **If isEChart = true → always read customization values from echartOptions and update customizeOptions.  
  If isEChart = false → always read customization values from chartOptions and update customizeOptions.**  

10. **If isEChart = true → update echartOptions if any customizations changes.
  If isEChart = false → update chartOptions if any customizations changes.**

11. Ensure all chart options strictly follow either ApexCharts or ECharts schemas.  

12. Multiple charts must be returned if user asks for more than one.  

13. Gridster notes:  
   - x, y, rows, cols define item layout.  
   - sheetType = "Chart" except Table.  
   - Compatible with Bootstrap 5 responsive grid system.  

14. Map data.title and data.sheetTagName with "sheet_name" from data

15. Return **only raw JSON array** as the final answer. No markdown, no explanations.    

---

#** Default customizeOptions (must always be included):**

{
  "backgroundColor": "#ffffff",
  "color": "#2392c1",
  "selectedColorScheme": ["#1d2e92", "#088ed2"],
  "isMeasureDistribution": false,
  "xLabelSwitch": true,
  "yLabelSwitch": true,
  "xLabelFontSize": 12,
  "yLabelFontSize": 12,
  "xLabelFontFamily": "sans-serif",
  "yLabelFontFamily": "sans-serif",
  "xlabelFontWeight": 400,
  "ylabelFontWeight": 400,
  "dimensionAlignment": "center",
  "measureAlignment": "center",
  "gridColor": "#e0e0e0",
  "xGridSwitch": true,
  "yGridSwitch": true,
  "barCornerRadius": 4,
  "dataLabels": true,
  "dataLabelsFontSize": 12,
  "dataLabelsFontFamily": "sans-serif",
  "dataLabelsColor": "#2392c1",
  "isBold": false,
  "dataLabelsFontPosition": "top",
  "legendSwitch": true,
  "legendsAllignment": "bottom",
  "donutSize": 70,
  "donutDecimalPlaces": 2
}

---

#** 🔗 CustomizeOptions → Chart Mapping:**

- backgroundColor → Apex: chart.background | ECharts: backgroundColor  
- selectedColorScheme / color → Apex: colors | ECharts: color  
- isMeasureDistribution → Apex: plotOptions.bar.distributed or setColorsOnRanges() | ECharts: colorBy: 'data' with setColorsOnRanges()  
- xLabelSwitch → Apex: xaxis.labels.show | ECharts: xAxis.axisLabel.show  
- yLabelSwitch → Apex: yaxis.labels.show | ECharts: yAxis.axisLabel.show  
- xLabelFontSize → Apex: xaxis.labels.style.fontSize | ECharts: xAxis.axisLabel.fontSize  
- yLabelFontSize → Apex: yaxis.labels.style.fontSize | ECharts: yAxis.axisLabel.fontSize  
- xLabelFontFamily → Apex: xaxis.labels.style.fontFamily | ECharts: xAxis.axisLabel.fontFamily  
- yLabelFontFamily → Apex: yaxis.labels.style.fontFamily | ECharts: yAxis.axisLabel.fontFamily  
- xlabelFontWeight → Apex: xaxis.labels.style.fontWeight | ECharts: xAxis.axisLabel.fontWeight  
- ylabelFontWeight → Apex: yaxis.labels.style.fontWeight | ECharts: yAxis.axisLabel.fontWeight  
- dimensionAlignment → Apex: xaxis.labels.offsetX | ECharts: xAxis.axisLabel.align  
- measureAlignment → Apex: yaxis.labels.offsetY | ECharts: yAxis.axisLabel.align  
- gridColor → Apex: grid.borderColor | ECharts: xAxis.splitLine.lineStyle.color, yAxis.splitLine.lineStyle.color  
- xGridSwitch → Apex: grid.xaxis.lines.show | ECharts: xAxis.splitLine.show  
- yGridSwitch → Apex: grid.yaxis.lines.show | ECharts: yAxis.splitLine.show  
- barCornerRadius → Apex: plotOptions.bar.borderRadius | ECharts: series.itemStyle.borderRadius  
- dataLabelsFontSize → Apex: dataLabels.style.fontSize | ECharts: series.label.fontSize  
- dataLabelsFontFamily → Apex: dataLabels.style.fontFamily | ECharts: series.label.fontFamily  
- dataLabelsColor → Apex: dataLabels.style.colors | ECharts: series.label.color  
- isBold → Apex: dataLabels.style.fontWeight | ECharts: series.label.fontWeight  
- dataLabelsFontPosition → Apex: plotOptions.bar.dataLabels.position | ECharts: series.label.position  
- legendSwitch → Apex: legend.show | ECharts: legend.show  
- legendsAllignment → Apex: legend.position | ECharts: legend.left / legend.orient  
- donutSize → Apex: plotOptions.pie.donut.size | ECharts: series.radius  
- donutDecimalPlaces → Apex: plotOptions.pie.donut.labels.total.formatter | ECharts: series.label.formatter  

---

#** Reference Output JSON:**

[
  {

"id": "6447d5e4-bbc9-4b3b-99c5-6971978fad4e",
  "x": 14,
  "y": 5,
  "rows": 8,
  "cols": 9,
    "data": {
        "title": "Total Customers",
        "sheetTagName": "<p>Total Customers</p>"
    },
  "sheetType": "Chart",
  "chartType": "bar",
  "chartId": 6,
  "isEChart": true,
   "kpiData": {
        "kpiNumber": "29.00",
        "kpiPrefix": "",
        "kpiSuffix": "",
        "kpiDecimalUnit": "none",
        "kpiDecimalPlaces": 2,
        "rows": [
            {
                "col": "CNTD(Id)",
                "result_data": [
                    29
                ]
            }
        ],
        "fontSize": 4,
        "color": "#ba68c8",
        "kpiChartColor": "#2392c1",
        "trendData": [
            7,
            16,
            10
        ],
        "trendLabels": [
            "2024-01-01",
            "2025-01-01",
            "null"
        ],
        "kpiShowTrendline": true,
        "showKpiIndicator": true,
        "indicatorIsIncreased": "up",
        "indicatorValue": 45,
        "kpiTarget": 20
    },
  "echartOptions": {
    "backgroundColor": "#fff",
    "legend": { "orient": "vertical", "left": "left" },
    "tooltip": { "trigger": "axis" },
    "axisPointer": { "type": "none" },
    "grid": { "left": "3%", "right": "4%", "bottom": "13%", "containLabel": true },
    "xAxis": {
      "type": "category",
      "data": ["Category 1", "Category 2"],
      "axisLine": { "lineStyle": { "color": "#2392c1" } },
      "axisLabel": { "show": true, "fontSize": 12, "color": "#2392c1" }
    },
    "yAxis": { "type": "value" },
    "series": [
      { "type": "bar", "barWidth": "80%", "data": [100, 200] }
    ],
    "color": ["#1d2e92", "#088ed2"]
  },
  "chartOptions": {
    "series": [
      { "name": "Series 1", "data": [100, 200], "group": "apexcharts-axis-0" }
    ],
    "chart": { "type": "bar", "height": 320, "background": "#fff" },
    "xaxis": {
      "categories": ["Category 1", "Category 2"],
      "labels": { "style": { "fontSize": 12, "fontFamily": "sans-serif" } }
    },
    "yaxis": {
      "labels": { "style": { "fontSize": 12, "fontFamily": "sans-serif" } }
    },
    "plotOptions": {
      "bar": { "distributed": true, "dataLabels": { "position": "top" } }
    },
    "dataLabels": {
      "enabled": true,
      "style": { "fontSize": "12px", "fontFamily": "sans-serif", "colors": ["#2392c1"] }
    },
    "colors": ["#1d2e92", "#088ed2"]
  },

  "chartData": [],
  "column_Data": [],
  "row_Data": [],
  "numberFormat": {
    "decimalPlaces": 2,
    "prefix": "",
    "suffix": ""
  },
    "customizeOptions": {
      "backgroundColor": "#ffffff",
      "color": "#2392c1",
      "selectedColorScheme": ["#1d2e92", "#088ed2"],
      "isMeasureDistribution": false,
      "xLabelSwitch": true,
      "yLabelSwitch": true,
      "xLabelFontSize": 12,
      "yLabelFontSize": 12,
      "xLabelFontFamily": "sans-serif",
      "yLabelFontFamily": "sans-serif",
      "xlabelFontWeight": 400,
      "ylabelFontWeight": 400,
      "dimensionAlignment": "center",
      "measureAlignment": "center",
      "gridColor": "#e0e0e0",
      "xGridSwitch": true,
      "yGridSwitch": true,
      "barCornerRadius": 4,
      "dataLabels": true,
      "dataLabelsFontSize": 12,
      "dataLabelsFontFamily": "sans-serif",
      "dataLabelsColor": "#2392c1",
      "isBold": false,
      "dataLabelsFontPosition": "top",
      "legendSwitch": true,
      "legendsAllignment": "bottom",
      "donutSize": 70,
      "donutDecimalPlaces": 2
    }
  }
]`
        },
        {
          role: "user",
          content: `
Data: ${JSON.stringify(data)},
Prompt: ${JSON.stringify(userPrompt)}
`
        }
      ]
    });
    
    // console.log(JSON.parse(response.choices[0].message.content ?? ''));
    // const chartOptions = JSON.parse(response.choices[0].message?.content || '{}');
    // return chartOptions;

    // Get raw content
  let content = response.choices[0].message?.content || '';

  // 🧹 Clean out ```json or ``` wrappers
  content = content.replace(/```json|```/g, '').trim();
  content = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

  try {
    const chartOptions = JSON.parse(content);
    console.log("✅ Parsed Chart Options:", chartOptions);
    return chartOptions;
  } catch (err) {
    console.error("❌ Failed to parse chart options", err, content);
    throw err;
  }
  }
}
