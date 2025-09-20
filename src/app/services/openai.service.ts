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

#**Rules:**
1. Always return a **JSON array** where each element is one chart object.  
2. **Each chart object must include:**  
   - id (Gridster item ID)  
   - chartId (must follow the mapping below)  
   - x, y, rows, cols (for Gridster position/size)  
   - sheetType (must be "Chart" unless user specifies KPI, Pivot, or Table)  
   - chartType (bar, line, pie, etc.)  
   - chartOptions (for ApexCharts, must always include "series")  
   - echartOptions (for ECharts, must always include "series")  
   - isEChart: true if using ECharts, false if using ApexCharts  
   - chartData, column_Data, row_Data, numberFormat, customizeOptions (when provided)  

3. ChartId Mapping (must be strictly followed):  
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

4. **If "library = "echart"", populate the chart configuration in "echartOptions" and set "isEChart: true".  
   If "library = "apex"", populate the chart configuration in "chartOptions" and set "isEChart: false".**

5. Always produce JSON that is **valid for Angular ApexCharts or Angular ECharts plugins**.  

6. Use the given data (columns, rows, chartType, library, etc.) to build the chart options.  
   - Infer xAxis, yAxis, categories, series, labels, colors, and legends.  
   - Respect formatting options like decimal places, prefixes, suffixes.  

7. Ensure all chart options strictly follow either ApexCharts or ECharts schemas.  

8. Multiple charts must be returned if user asks for more than one.  

9. Gridster notes:  
   - x, y, rows, cols define item layout.  
   - sheetType = "Chart" except for explicitly KPI, Pivot, or Table.  
   - Compatible with Bootstrap 5 responsive grid system.  

10. Return **only raw JSON array** as the final answer. No markdown, no explanations.  

---

# Reference Output JSON (for guidance only):

{
  "id": "6447d5e4-bbc9-4b3b-99c5-6971978fad4e",
  "x": 14,
  "y": 5,
  "rows": 8,
  "cols": 9,
  "sheetType": "Chart",
  "chartType": "bar",
  "chartId": 6,
  "isEChart": true,

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
  "customizeOptions": {}
}
`
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
