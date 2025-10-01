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

  async getChartOptions(data: any, openAiKey?:any, userPrompt?: any): Promise<any> {
    this.openai.apiKey = openAiKey;
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
    - type (must be "text" for text chart and "image" for image chart and type key ony present in output json for text and image charts only)
    - chartOptions (for ApexCharts, must always include "series")  
    - echartOptions (for ECharts, must always include "series")  
    - isEChart: true if using ECharts, false if using ApexCharts  
    - chartData, column_Data, row_Data, numberFormat, customizeOptions (when provided)  
    - kpiData (if chartType is KPI, must include kpiNumber, kpiPrefix, kpiSuffix, kpiDecimalPlaces, rows, fontSize, color, trendData, trendLabels, kpiShowTrendline, showKpiIndicator, indicatorIsIncreased, indicatorValue, kpiTarget) and KPI's position in gridster must be at top if more than one KPI they should align one after the other with square shaped gridster item
      Additionally, minimize font size, use background color, add icons if needed, and ensure the KPI number is visible with (1-2)rem on the chart.
    - tableData (if chartType is Table, must include headers, rows, banding, color1, color2, tableItemsPerPage, tableTotalItems, tablePage) strictly don't change the structure of headers and rows structure should be same even in customization.
    - customizeOptions (must always be included with defaults, and applied to chartOptions/echartOptions if used)  
    - do not include customizeOptions inside chartOptions or echartOptions; it must be a separate key
    - if isEChart = true → chart configuration must only be inside echartOptions and empty object for chartOptions. If isEChart = false → chart configuration must only be inside chartOptions and empty object for echartOptions.
    - if isEChart = true → customization values must be taken from echartOptions. If isEChart = false → customization values must be taken from chartOptions. In both cases, update customizeOptions with the same values.
    - from user-given data, **columns are used for x-axis categories (or labels for pie/donut in ApexCharts)**, and **rows are used as series in chartOptions/echartOptions**. 
    - **data object must include title and sheetTagName, which are initialized from the user-provided sheet_name. (must include for all the sheets)**
    - Generate sheets with colorful charts, colorful backgrounds, and attractive looks.
    - Apply all current customizations to make charts visually appealing.
    - Ensure charts have attractive looks by using chart colors, background colors, gradients, and other visual enhancements wherever possible.**
    - **Hex color codes must always consist of 6 characters.**

3. **Dashboard Layout Alignment (very important):**  
   - Treat each gridster-item as one sheet.  
   - Items must be placed in a **well-structured grid layout** without overlap or gaps.  
   - **KPIs:**  
     - Always appear at the **top row**.  
     - Must align left to right in **equal square tiles** (cols = 3 or 4, rows = 6).  
     - If multiple KPIs, they must be side-by-side in the same row.  
   - **Charts:**  
     - Must be arranged **below KPIs**, filling the grid left → right, wrapping to the next row if needed.  
     - Default chart sizing: cols = 6, rows = 10.
     - every charts (apex/echarts like isEchart = true || isEchart = true) should have cols = 6, rows = 10.
     - Align charts evenly so dashboard looks **balanced**.  
   - **Tables / Maps:**  
     - Must span full width (cols = 12).  
     - Height should be larger (rows = 8–10).  
   - Ensure no irregular gaps are left in the layout.  
   - Final dashboard must look like a **professional BI dashboard** (KPI row → charts row → table/map row).  

4. **ChartId Mapping (must be strictly followed):**  
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
   - **Do not generate or accept any chart type outside of the above list.**

5. **If "library = echart", populate the chart configuration in "echartOptions" and set "isEChart: true".  
   If "library = apex", populate the chart configuration in "chartOptions" and set "isEChart: false".**  

6. **If isEChart = true → chart configuration must only be inside echartOptions.  
   If isEChart = false → chart configuration must only be inside chartOptions.** 

7. Always produce JSON that is **valid for Angular ApexCharts or Angular ECharts plugins**.  

8. Use the given data (columns, rows, chartType, library, etc.) to build the chart options.  
   - Infer xAxis, yAxis, categories, series, labels, colors, and legends.  
   - Respect formatting options like decimal places, prefixes, suffixes.  
   - Apply **customizeOptions** into the correct chartOptions/echartOptions keys.  

9. **If any customization is changed in chartOptions/echartOptions (e.g., backgroundColor, fontSize, legends, dataLabels, etc.), then the same value must also be updated inside customizeOptions.**  

10. **If isEChart = true → always read customization values from echartOptions and update customizeOptions.  
  If isEChart = false → always read customization values from chartOptions and update customizeOptions.**  

11. **If isEChart = true → update echartOptions if any customizations changes.
  If isEChart = false → update chartOptions if any customizations changes.**

12. Ensure all chart options strictly follow either ApexCharts or ECharts schemas.  

13. Multiple charts must be returned if user asks for more than one.  

14. Gridster notes:  
   - x, y, rows, cols define item layout.  
   - sheetType = "Chart" except Table.  
   - Compatible with Bootstrap 5 responsive grid system.  

15. Map data.title and data.sheetTagName with "sheet_name" from data.     

16. **Generate sheets with colorful charts, colorful backgrounds and attractive looks while representing with the current customizations.**

17. **If the user requests dashboard layout changes (like moving sheets or charts, changing positions, resizing, height, width), update the 'x', 'y', 'rows', and 'cols' values of the respective chart objects to reflect the new positions. Ensure layout remains professional and balanced after repositioning.**

18. **If the user requests "banners" (text-based charts for main headers), they must:**
   - Use 'type: "text"' and store HTML content inside 'data.content' and 'editorContent'.  
   - Always span the **entire first row** ('cols = 12', 'rows = 2–3' depending on content).  
   - Banner must appear **above all KPIs and charts**.  
   - Layout order: **Banner (row 1) → KPI charts (row 2 onward, aligned in squares) → Chart visualizations (below KPIs) → Table/Map charts (last rows, full width)**.  
   - Ensure banners have attractive text formatting (fonts, colors, background) without breaking JSON validity.  
   - Example:
     '''json  
     {
       "id": "uuid",
       "x": 0,
       "y": 0,
       "cols": 12,
       "rows": 2,
       "type": "text",
       "data": {
         "title": "",
         "content": "<div class=\"text-content-wrapper\"><h2 style=\"color:#2392c1;text-align:center;\">Sales Dashboard</h2></div>"
       },
       "editorContent": "<div class=\"text-content-wrapper\"><h2 style=\"color:#2392c1;text-align:center;\">Sales Dashboard</h2></div>",
       "dragEnabled": true,
       "resizeEnabled": true
     }
     '''
19. Special ChartOptions Rules (ApexCharts only)  

When isEChart = false and chartType is one of → "pie", "donut", "funnel", "treemap", "radial", "guage", 'hbar' you must strictly use the exact predefined structures below.  

- Do not remove or rename any key.  
- Do not change array/object nesting.  
- Always provide both chartOptions and customizeOptions with identical configurations (except where explicitly required by the chart type).  
- Colors, legend, labels, and background values must always be applied consistently.  
- Do not introduce extra ApexCharts keys not included in the structure.  

=====================
Pie Chart → chartOptions
=====================
{
  "series": [0, 5312, 2176],
  "chart": {
    "height": 300,
    "type": "pie",
    "background": "#fff"
  },
  "colors": ["#A587CA", "#36CEDC", "#8FE968", "#FFEA56", "#FFB750", "#FF787C"],
  "labels": ["null", "Billable", "NoCharge"],
  "legend": {
    "show": true,
    "position": "bottom"
  },
  "dataLabels": {
    "enabled": true,
    "dropShadow": { "enabled": false }
  }
}

=====================
Donut Chart → chartOptions
=====================
{
  "series": [0, 5312, 2176],
  "chart": {
    "type": "donut",
    "background": "#fff"
  },
  "colors": ["#A587CA", "#36CEDC", "#8FE968", "#FFEA56", "#FFB750", "#FF787C"],
  "labels": ["null", "Billable", "NoCharge"],
  "legend": {
    "show": true,
    "position": "bottom"
  },
  "dataLabels": { "enabled": true },
  "plotOptions": {
    "pie": {
      "donut": {
        "labels": {
          "show": true,
          "name": { "show": true },
          "value": { "show": true },
          "total": { "show": true, "showAlways": true }
        },
        "size": "50%"
      }
    }
  }
}

=====================
Funnel Chart → chartOptions
=====================
{
  "series": [
    {
      "name": "sum(actualHours)",
      "data": [0, 5312, 2176],
      "group": "apexcharts-axis-0"
    }
  ],
  "chart": {
    "type": "bar",
    "height": 320,
    "background": "#fff"
  },
  "plotOptions": {
    "bar": {
      "borderRadius": 0,
      "horizontal": true,
      "barHeight": "80%",
      "isFunnel": true,
      "distributed": true,
      "dataLabels": { "position": "top" }
    }
  },
  "dataLabels": {
    "enabled": true,
    "style": {
      "fontSize": "12px",
      "fontFamily": "sans-serif",
      "fontWeight": 400,
      "colors": ["#2392c1"]
    }
  },
  "title": {},
  "xaxis": {
    "categories": ["null", "Billable", "NoCharge"],
    "convertedCatToNumeric": false
  },
  "legend": { "show": false },
  "colors": ["#A587CA", "#36CEDC", "#8FE968", "#FFEA56", "#FFB750", "#FF787C"]
}

=====================
Treemap Chart → chartOptions
=====================
{
  "series": [
    {
      "data": [
        { "x": "null", "y": 0 },
        { "x": "Billable", "y": 5312 },
        { "x": "NoCharge", "y": 2176 }
      ],
      "group": "apexcharts-axis-0"
    }
  ],
  "chart": {
    "height": 350,
    "type": "treemap",
    "background": "#fff",
    "events": {}
  },
  "plotOptions": { "treemap": { "distributed": true, "borderRadius": 0 } },
  "dataLabels": {
    "enabled": true,
    "style": {
      "fontSize": "12px",
      "fontFamily": "sans-serif",
      "fontWeight": 400,
      "colors": ["#2392c1"]
    }
  },
  "legend": { "show": false },
  "tooltip": { "y": {} },
  "colors": ["#A587CA", "#36CEDC", "#8FE968", "#FFEA56", "#FFB750", "#FF787C"]
}

=====================
Radial Chart → chartOptions
=====================
{
  "series": [0, 5312, 2176],
  "chart": {
    "type": "radialBar",
    "height": 350,
    "background": "#fff"
  },
  "plotOptions": {
    "radialBar": {
      "startAngle": 0,
      "endAngle": 360,
      "max": 100
    }
  },
  "labels": ["null", "Billable", "NoCharge"],
  "legend": {
    "show": true,
    "position": "bottom",
    "floating": true,
    "fontSize": "12px",
    "offsetX": 10,
    "offsetY": 10
  },
  "colors": ["#1d2e92", "#088ed2", "#007cb9", "#36c2ce", "#52c9f7"]
}

=====================
Guage Chart → chartOptions
=====================
{
  "series": [74.88],
  "chart": {
    "height": 350,
    "type": "radialBar",
    "background": "#b3e5fc",
    "toolbar": { "show": true },
    "events": {}
  },
  "colors": ["#ba68c8"],
  "plotOptions": {
    "radialBar": {
      "startAngle": -120,
      "endAngle": 120,
      "track": {
        "background": "#333",
        "startAngle": -120,
        "endAngle": 120
      },
      "dataLabels": {
        "show": true,
        "name": {
          "offsetY": -20,
          "show": true,
          "color": "#2392c1",
          "fontSize": "12px",
          "fontFamily": "sans-serif",
          "fontWeight": 400
        },
        "value": {
          "show": true,
          "color": "#2392c1",
          "fontSize": "12px",
          "fontFamily": "sans-serif",
          "fontWeight": 400
        }
      },
      "min": 0,
      "max": 10000
    }
  },
  "tooltip": { "enabled": true, "shared": false },
  "stroke": { "lineCap": "round" },
  "labels": ["sum(actualHours)"]
}

=====================
Hbar Chart → chartOptions
=====================
{
    "series": [
        {
            "name": "",
            "data": [
                26953.57,
                142715.03,
                241067.66,
                133131.61,
                33401,
                43093.880000000005,
                153258.40999999997,
                51053.899999999994,
                13634.78,
                56985.55,
                331789.41000000003,
                79535.48,
                74842.93,
                203621.16999999998,
                30335.02,
                135227.22,
                27758.63,
                50444.880000000005,
                262316.97,
                127551.61
            ],
            "group": "apexcharts-axis-0"
        }
    ],
    "annotations": {
        "points": [
            {
                "x": "zoom",
                "seriesIndex": 0,
                "label": {
                    "borderColor": "#775DD0",
                    "offsetY": 0,
                    "style": {
                        "color": "#fff",
                        "background": "#775DD0"
                    },
                    "text": "zoom"
                }
            }
        ]
    },
    "chart": {
        "toolbar": {
            "show": true,
            "offsetX": 0,
            "offsetY": 0,
            "tools": {
                "download": true,
                "selection": true,
                "zoom": true,
                "zoomin": true,
                "zoomout": true,
                "pan": true,
                "reset": true
            },
            "autoSelected": "zoom"
        },
        "type": "bar",
        "height": 600,
        "background": "#fff",
        "events": {}
    },
    "yaxis": {
        "labels": {
            "show": true,
            "offsetX": 15,
            "offsetY": 0,
            "style": {
                "colors": [
                    null,
                    null,
                    null,
                    null,
                    null
                ],
                "fontSize": 12,
                "fontFamily": "sans-serif",
                "fontWeight": 400
            }
        }
    },
    "xaxis": {
        "categories": [
            "AI Innovations",
            "Alpha Holdings",
            "Beta Corporation",
            "Cloud Nine",
            "Cyber Solutions",
            "Data Driven",
            "Delta Group",
            "Digital Dynamics",
            "Epsilon Ltd",
            "Future Tech",
            "Gamma Partners",
            "Global Industries",
            "Innovate Inc",
            "Metro Systems",
            "NextGen Solutions",
            "Prime Enterprises",
            "Quantum Corp",
            "Smart Systems",
            "TechCorp Solutions",
            "Zeta Ventures"
        ],
        "labels": {
            "show": true,
            "style": {
                "fontSize": 12,
                "fontFamily": "sans-serif",
                "fontWeight": 400
            }
        },
        "convertedCatToNumeric": false
    },
    "grid": {
        "show": true,
        "borderColor": "#089ffc",
        "xaxis": {
            "lines": {
                "show": false
            }
        },
        "yaxis": {
            "lines": {
                "show": false
            }
        }
    },
    "plotOptions": {
        "bar": {
            "horizontal": true,
            "distributed": true,
            "dataLabels": {
                "position": "top"
            },
            "borderRadius": 0
        }
    },
    "dataLabels": {
        "enabled": true,
        "textAnchor": "start",
        "style": {
            "fontSize": "12px",
            "fontFamily": "sans-serif",
            "fontWeight": 400,
            "colors": [
                "#2392c1"
            ]
        }
    },
    "legend": {
        "show": false
    },
    "colors": [
        "#FFB750",
        "#36CEDC"
    ]
}

   - Ensure these structures are **strictly followed whenever chartType is "pie", "donut", "funnel", "treemap", "radial", "guage"** with 'isEChart = false'.  
   - All customization values (colors, legend position, background, etc.) must be applied to both 'chartOptions' and 'customizeOptions'.  

20. Return **only raw JSON array** as the final answer. No markdown, no explanations. 

21. **Strict JSON Enforcement:  
  - Always return strictly valid JSON.  
  - All strings must be enclosed in double quotes (").  
  - All object properties must be separated by commas.  
  - All arrays and objects must be properly closed (] and }).  
  - No trailing commas in arrays or objects.  
  - Return only a JSON array containing chart objects, with no extra text, comments, or markdown.  
  - Escape special characters in values (e.g., <p> → &lt;p&gt;) to avoid parsing errors.**

22. **Generate the JSON array with the same index order as the user-given data.**

23. **Always generate JSON for all the charts in the user-given data.**
---

#** 🔗 CustomizeOptions → Chart Mapping:**

- **isZoom** → Apex: 'chart.zoom.enabled' | ECharts: 'dataZoom' (presence and 'dataZoom.show')  
- **backgroundColor** → Apex: 'chart.background' | ECharts: 'backgroundColor'  
- **backgroundColorSwitch** → Apex: read/apply from 'chart.background' when true | ECharts: same (toggle 'backgroundColor')  
- **color** → Apex: 'colors' (primary color or first in 'colors' array) | ECharts: 'color' (first color)  
- **selectedColorScheme** → Apex: 'colors' (array) | ECharts: 'color' (array)  
- **chartColorSwitch** → Apex: toggle applying 'colors' | ECharts: toggle applying 'color' array  
- **barColor** → Apex: 'colors' (or 'plotOptions.bar.colors') | ECharts: 'series[itemIndex].itemStyle.color' or 'color' array  
- **lineColor** → Apex: 'colors' (series color) | ECharts: 'series[lineIndex].itemStyle.color' or 'color' array  
- **kpiChartColor** → Apex: KPI card color / 'chart.background' or 'colors' for small sparkline | ECharts: KPI series color in 'series'  
- **kpiColor** → Apex: KPI text color (kpiData.color) | ECharts: KPI text color (kpiData.color)  
- **kpiColorSwitch** → toggle applying 'kpiColor' to KPI display (both libraries)  
- **isMeasureDistribution** → Apex: 'plotOptions.bar.distributed = true' or programmatic color mapping | ECharts: 'colorBy: 'data'' and custom ranges mapping  
- **measureColorRanges** → Apex: set custom 'colors' per data value (use 'plotOptions.series' or color callback) | ECharts: 'visualMap' + 'color' or 'series.itemStyle' via value mapping  
- **measureDivisions** → Apex: used to compute 'plotOptions' color ranges | ECharts: 'visualMap.splitNumber' or 'pieces' count  
- **xGridColor** → Apex: 'grid.borderColor' or 'xaxis.axisBorder.color' | ECharts: 'xAxis.splitLine.lineStyle.color' / 'xAxis.axisLine.lineStyle.color'  
- **yGridColor** → Apex: 'grid.borderColor' or 'yaxis.axisBorder.color' | ECharts: 'yAxis.splitLine.lineStyle.color' / 'yAxis.axisLine.lineStyle.color'  
- **xGridSwitch** → Apex: 'grid.xaxis.lines.show' / 'xaxis.axisTicks.show' (or 'xaxis.labels.show') | ECharts: 'xAxis.splitLine.show'  
- **yGridSwitch** → Apex: 'grid.yaxis.lines.show' | ECharts: 'yAxis.splitLine.show'  
- **GridColor** → Apex: 'grid.borderColor' / 'grid.strokeDashArray' as needed | ECharts: 'xAxis.splitLine.lineStyle.color' & 'yAxis.splitLine.lineStyle.color'  
- **xLabelSwitch** → Apex: 'xaxis.labels.show' | ECharts: 'xAxis.axisLabel.show'  
- **yLabelSwitch** → Apex: 'yaxis.labels.show' | ECharts: 'yAxis.axisLabel.show'  
- **xLabelColor** → Apex: 'xaxis.labels.style.colors' or 'xaxis.labels.style.color' | ECharts: 'xAxis.axisLabel.color'  
- **yLabelColor** → Apex: 'yaxis.labels.style.colors' or 'yaxis.labels.style.color' | ECharts: 'yAxis.axisLabel.color'  
- **xLabelFontFamily** → Apex: 'xaxis.labels.style.fontFamily' | ECharts: 'xAxis.axisLabel.fontFamily'  
- **yLabelFontFamily** → Apex: 'yaxis.labels.style.fontFamily' | ECharts: 'yAxis.axisLabel.fontFamily'  
- **xLabelFontSize** → Apex: 'xaxis.labels.style.fontSize' | ECharts: 'xAxis.axisLabel.fontSize'  
- **yLabelFontSize** → Apex: 'yaxis.labels.style.fontSize' | ECharts: 'yAxis.axisLabel.fontSize'  
- **xlabelFontWeight** → Apex: 'xaxis.labels.style.fontWeight' | ECharts: 'xAxis.axisLabel.fontWeight'  
- **ylabelFontWeight** → Apex: 'yaxis.labels.style.fontWeight' | ECharts: 'yAxis.axisLabel.fontWeight'  
- **isXlabelBold** → Apex: set 'xaxis.labels.style.fontWeight' to '700' when true | ECharts: 'xAxis.axisLabel.fontWeight' = 700 when true  
- **isYlabelBold** → Apex: set 'yaxis.labels.style.fontWeight' to '700' when true | ECharts: 'yAxis.axisLabel.fontWeight' = 700 when true  
- **isBold** → Apex: 'dataLabels.style.fontWeight' | ECharts: 'series.label.fontWeight' (applies to data labels)  
- **dataLabels** → Apex: 'dataLabels.enabled' | ECharts: 'series.label.show'  
- **dataLabelsColor** → Apex: 'dataLabels.style.colors' (array) or 'dataLabels.style.color' | ECharts: 'series.label.color'  
- **dataLabelsFontFamily** → Apex: 'dataLabels.style.fontFamily' | ECharts: 'series.label.fontFamily'  
- **dataLabelsFontSize** → Apex: 'dataLabels.style.fontSize' | ECharts: 'series.label.fontSize'  
- **dataLabelsFontPosition** → Apex: 'plotOptions.bar.dataLabels.position' or 'dataLabels.offsetY' | ECharts: 'series.label.position' (e.g., 'top', 'inside')  
- **dataLabelsLineFontPosition** → Apex: 'dataLabels.position' for line charts | ECharts: 'series.label.position' for line series  
- **dataLabelsBarFontPosition** → Apex: 'plotOptions.bar.dataLabels.position' | ECharts: 'series.label.position' for bar series  
- **label** → general label toggle → Apex: 'dataLabels.enabled' / ECharts: 'series.label.show'  
- **legendSwitch** → Apex: 'legend.show' | ECharts: 'legend.show'  
- **legendsAllignment** → Apex: 'legend.position' (top/left/right/bottom) | ECharts: 'legend.left' & 'legend.orient'  
- **legendOrient** → Apex: affect 'legend.position' and layout | ECharts: 'legend.orient' ('horizontal'/'vertical')  
- **topLegend / leftLegend / rightLegend / bottomLegend** → Apex: map to 'legend.position' and 'legend.offsetX/offsetY' | ECharts: 'legend.top'/'bottom'/'left'/'right' (percent or px)  
- **donutSize** → Apex: 'plotOptions.pie.donut.size' (e.g., "50%") | ECharts: 'series.radius' (inner/outer)  
- **outerRadius** → Apex: 'plotOptions.pie.donut.size' outer radius handling | ECharts: 'series.radius' outer value (e.g., ["50%", "70%"])  
- **donutDecimalPlaces** → Apex: donut total/formatter in 'plotOptions.pie.donut.labels.total.formatter' | ECharts: 'series.label.formatter' or tooltip formatter decimals  
- **isDistributed** → Apex: 'plotOptions.bar.distributed = true' | ECharts: 'colorBy: 'data'' and distribute colors per datum  
- **barCornerRadius** → Apex: 'plotOptions.bar.borderRadius' | ECharts: 'series.itemStyle.borderRadius'  
- **outerRadius / radialStartAngle / radialEndAngle / maxValueRadial / maxValueGuage / minValueGuage / gaugeDisplayMode** → Apex radial/gauge: 'plotOptions.radialBar.startAngle', 'endAngle', 'plotOptions.radialBar.max', 'plotOptions.radialBar.track' settings | ECharts radial/gauge: 'series.startAngle', 'series.endAngle', 'max', 'min', 'pointer' and 'detail' settings  
- **radialStartAngle / radialEndAngle** → Apex: 'plotOptions.radialBar.startAngle' / 'endAngle' | ECharts: 'series.startAngle' / 'series.endAngle'  
- **maxValueRadial** → Apex: 'plotOptions.radialBar.max' | ECharts: 'series.max'  
- **minValueGuage / maxValueGuage** → Apex: in gauge/radial config (see special structures) | ECharts: 'series.min', 'series.max'  
- **gaugeDisplayMode** → Apex: use both 'dataLabels' and 'plotOptions.radialBar' display options | ECharts: use 'detail.formatter' + 'axisLine' / 'pointer' visibility  
- **kpiFontSize** → KPI-specific: set 'kpiData.fontSize' (in rem or px) and apply to KPI rendering (both libs)  
- **kpiShowTrendline** → KPI: show small sparkline → Apex: add tiny 'series' with 'chart.type: 'line'' inside KPI rendering or 'sparkline' config | ECharts: add miniature 'series' in KPI area  
- **kpiTrendAxis** → used to format trend labels (e.g., month/day) for KPI trend rendering (both libraries)  
- **kpiShowTrendline / trendData / trendLabels** → Apex: include 'series' + small line 'chart' config for KPI; update 'kpiData.trendData' and 'trendLabels' | ECharts: 'series' within KPI echartOptions with 'xAxis' as 'trendLabels'  
- **kpiTarget** → KPI: used to display target line/marker in KPI or gauge series (both libs)  
- **kpiShowTrendline / showKpiIndicator / indicatorIsIncreased / indicatorValue** → KPI widget fields (not chart core) used in KPI card rendering; reflect in 'kpiData' for both libs  
- **kpiChartColorSwitch** → toggle applying 'kpiChartColor' to KPI chart/sparkline  
- **kpiFontSize** → Apex: KPI-specific style (not native Apex key) — set in 'custom' area and 'customizeOptions.kpiFontSize' | ECharts: same approach inside KPI 'echartOptions' or custom rendering  
- **dataLabelsFontFamily / dataLabelsFontSize / dataLabelsFontPosition** → Apex: 'dataLabels.style.fontFamily', 'dataLabels.style.fontSize', 'plotOptions.bar.dataLabels.position' | ECharts: 'series.label.fontFamily', 'series.label.fontSize', 'series.label.position'  
- **dimensionColor / measureColor** → Apex: assign to 'xaxis.labels.style.color' and 'yaxis.labels.style.color' or series colors | ECharts: 'xAxis.axisLabel.color' and 'yAxis.axisLabel.color' or series colors  
- **dimensionAlignment** → Apex: 'xaxis.labels.offsetX' (or textAlign via CSS) | ECharts: 'xAxis.axisLabel.align' ('left'/'center'/'right')  
- **measureAlignment** → Apex: 'yaxis.labels.offsetY' (or align) | ECharts: 'yAxis.axisLabel.align'  
- **tableDataFontFamily / tableDataFontSize / tableDataFontWeight / tableDataFontStyle / tableDataFontDecoration / tableDataFontColor / tableDataFontAlignment** → Table rendering CSS / Angular component props (not Apex/ECharts core): map to table cell styles in Table chart's 'tableData' object (preserve structure)  
- **headerFontFamily / headerFontSize / headerFontWeight / headerFontStyle / headerFontDecoration / headerFontColor / headerFontAlignment** → Table header CSS settings inside 'tableData.headers' metadata  
- **isTableHeaderBold / isTableDataBold** → Table: toggle 'fontWeight' for header and rows (update 'tableData' styles)  
- **bandingSwitch** → Table: toggle 'banding' boolean → when true use 'bandingEvenColor' / 'bandingOddColor' for rows | ECharts/Apex: N/A (table-only)  
- **bandingEvenColor / bandingOddColor** → Table: 'tableData.color1' / 'tableData.color2' (even/odd)  
- **color1 / color2** → Table: fallback banding colors ('tableData.color1', 'tableData.color2')  
- **rowTotalFontColor / rowTotalFontColorSwitch / rowTotalBgColor / rowTotalBgColorSwitch** → Table: style for row totals (apply when switches true)  
- **colTotalFontColor / colTotalFontColorSwitch / colTotalBgColor / colTotalBgColorSwitch** → Table: style for column totals  
- **grandTotalFontColor / grandTotalFontColorSwitch / grandTotalBgColor / grandTotalBgColorSwitch** → Table: grand total cell styling  
- **toggleTableSearch** → Table: show/hide search input in table UI component  
- **toggleTablePagination** → Table: enable/disable pagination (and 'tableItemsPerPage')  
- **tableDataFontAlignment / headerFontAlignment** → Table: 'text-align' for cells/headers ('left'/'center'/'right')  
- **sortType / sortColumn** → Table: default sorting (0 = none / 1 = asc / 2 = desc), 'sortColumn' column name  
- **topLegend / leftLegend / legendOrient / bottomLegend / rightLegend** → Apex: map to 'legend.position', 'legend.offsetX/Y' | ECharts: 'legend.top/left/bottom/right' and 'legend.orient'  
- **measureColorRanges / isMeasureDistribution** → Apex: use 'plotOptions.bar.distributed' or color callbacks; ECharts: use 'visualMap' with ranges or 'pieces' for discrete coloring  
- **funnelColorSwitch** → Funnel: when true, apply custom 'colors' (Apex funnel special structure) | ECharts: apply 'color' for funnel series  
- **donutSize / outerRadius / donutDecimalPlaces** → Apex: 'plotOptions.pie.donut.size' and 'plotOptions.pie.donut.labels.total.formatter' | ECharts: 'series.radius' (inner,outer) and 'series.label.formatter'  
- **isDistributed** → Apex: 'plotOptions.bar.distributed' | ECharts: 'colorBy: 'data''  
- **hBarHeight** → Apex: 'plotOptions.bar.barHeight' or 'barHeight' property for horizontal bar | ECharts: 'series.barWidth' or 'series.barCategoryGap' adjustments  
- **label** → generic label toggle (maps to 'dataLabels' keys as above)  
- **minValueGuage / maxValueGuage** → Apex: gauge/radial 'plotOptions.radialBar.min/max' | ECharts: 'series.min' / 'series.max'  
- **donutDecimalPlaces** → Apex/ECharts: use formatter functions for labels/tooltip to set decimal places  
- **trendData / trendLabels** → Apex: small 'series' with 'categories=trendLabels' and data=trendData for KPI or chart trendlines | ECharts: same in 'series' + 'xAxis' for labels  
- **selectedDateColumn** → used to choose x-axis/time column; map to 'xAxis.data' (both libs)  
- **locationDrillDownSwitch** → map to interactive map/chart drilldown toggle (custom behavior outside core Apex/ECharts)  
- **pivotColumnTotals / pivotRowTotals** → pivot table rendering flags (table-only)  
- **measureAlignment / dimensionAlignment** → Apex: 'yaxis.labels.offsetY' / 'xaxis.labels.offsetX' | ECharts: 'yAxis.axisLabel.align' / 'xAxis.axisLabel.align'  
- **label / dataLabels** → ensure both map to 'dataLabels.enabled' / 'series.label.show' consistently in both 'chartOptions' and 'customizeOptions'  
- **numberFormat (decimalPlaces/prefix/suffix)** → Apex: use 'yaxis.labels.formatter' and 'dataLabels.formatter' | ECharts: use 'axisLabel.formatter' and 'series.label.formatter' / tooltip formatters  
- **outerRadius / radial settings** → follow radial/guage special structures (apply to both chartOptions and customizeOptions when isEChart=false and using Apex special definitions)  

---

### Implementation notes / best-practice rules
1. **Sync to 'customizeOptions':** If you change a value in 'chartOptions' (Apex) or 'echartOptions' (ECharts), mirror that same value inside 'customizeOptions'.  
2. **Hex length:** Ensure all hex color codes are 6 characters (e.g., '#2392c1' is valid). If an input uses 3 or fewer characters, expand/normalize to 6.  
3. **KPI handling:** KPI fields ('kpiColor', 'kpiChartColor', 'trendData', 'showKpiIndicator', etc.) live in 'kpiData' object — charts use a tiny sparkline series for trendlines (Apex: small line series; ECharts: tiny series).  
4. **Table styling:** Table style keys map to table renderer CSS and must be preserved inside 'tableData' object (do not mix into 'chartOptions'/'echartOptions').  
5. **Distribution & ranges:** For 'isMeasureDistribution' + 'measureColorRanges', prefer 'visualMap' (ECharts) or 'plotOptions.bar.distributed' with explicit 'colors' (Apex) or a color callback function.  
6. **Special charts:** For pie/donut/funnel/radial/gauge/treemap in Apex, use the provided strict structures and apply colors/legend/background from these mappings.  


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
      "title": "Total Customers", **(must include for all the sheets)**
      "sheetTagName": "<p>Total Customers</p>", **(must include for all the sheets)**
      "content": "<div class=\"text-content-wrapper\"><h2 style=\"color:#2392c1;text-align:center;\">Sales Dashboard</h2></div>"
  },
  "sheetType": "Chart",
  "chartType": "bar",
  "tyep": "text", **(type key only presents for text or image charts)**
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
        "fontSize": 1,
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
    "tableData": {
        "headers": [
            "DisplayName",
            "sum(Balance)"
        ],
        "rows": [
            {
                "DisplayName": "Rago Travel Agency",
                "sum(Balance)": 0
            },
            {
                "DisplayName": "Dukes Basketball Camp",
                "sum(Balance)": 0
            },
            {
                "DisplayName": "Diego Rodriguez",
                "sum(Balance)": 0
            },
        ],
        "banding": true,
        "color1": "#e1bee7",
        "color2": "#b2ebf2",
        "tableItemsPerPage": 10,
        "tableTotalItems": 29,
        "tablePage": 1
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
      "style": { "fontSize": "12px", "fontFamily": "sans-serif" }
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
    "isZoom"= false;
    "xGridColor" = '#2392c1';
    "xGridSwitch" = false;
    "xLabelSwitch" = true;
    "xLabelColor" = '#2392c1';
    "yLabelSwitch" = true;
    "yGridColor" = '#2392c1';
    "yGridSwitch" = false;
    "yLabelColor" = '#2392c1';
    "xLabelFontFamily" = 'sans-serif';
    "xLabelFontSize" = 12;
    "xlabelFontWeight" = 400;
    "backgroundColor" = '#fff';
    "color" = '#2392c1';
    "selectedColorScheme" = ['#1d2e92', '#088ed2', '#007cb9', '#36c2ce', '#52c9f7'],
    "ylabelFontWeight" = 400;
    "isBold" = false;
    "isTableHeaderBold" = false;
    "isTableDataBold" = false;
    "isXlabelBold" = false;
    "isYlabelBold" = false;
    "yLabelFontFamily" = 'sans-serif';
    "yLabelFontSize" = 12;
    "bandingSwitch" = false;
    "backgroundColorSwitch" = false;
    "chartColorSwitch" = false;
    "barColorSwitch" = false;
    "lineColorSwitch" = false;
    "gridLineColorSwitch" = false;
    "xLabelColorSwitch" = false;
    "xGridLineColorSwitch" = false;
    "yLabelColorSwitch" = false;
    "yGridLineColorSwitch" = false;
    "bandingColorSwitch" = false;
    "kpiColorSwitch" = false;
    "funnelColorSwitch" = false;
    "color1" = undefined;
    "color2" = undefined;
    "kpiColor" = '#000000';
    "kpiChartColor" = '#2392c1';
    "barColor" = '#4382f7';
    "lineColor" = '#38ff98';
    "GridColor" = '#089ffc';
    "legendSwitch" = true;
    "dataLabels" = true;
    "label" = true;
    "donutSize" = 50;
    "outerRadius" = 70;
    "barCornerRadius" = 0;
    "isDistributed" = true;
    "kpiFontSize" = '3';
    "minValueGuage" = 0;
    "gaugeDisplayMode" = 'both';
    "maxValueGuage" = 100;
    "donutDecimalPlaces" = 2;
    "legendsAllignment" = 'bottom';
    "radialStartAngle" = 0;
    "radialEndAngle" = 360;
    "maxValueRadial" = 100;
    "dataLabelsFontFamily" = 'sans-serif';
    "dataLabelsFontSize" = '12px';
    "dataLabelsFontPosition" = 'top';
    "measureAlignment" = 'center';
    "dimensionAlignment" = 'center';
    "dimensionColor" = '#2392c1';
    "measureColor" = '#2392c1';
    "dataLabelsColor" = '#2392c1';
    "tableDataFontFamily" = 'sans-serif';
    "tableDataFontSize" = '12px';
    "tableDataFontWeight" = 400;
    "tableDataFontStyle" = 'normal';
    "tableDataFontDecoration" = 'none';
    "tableDataFontColor" = '#000000';
    "tableDataFontAlignment" = 'left';
    "headerFontFamily" = "'Arial', sans-serif";
    "headerFontSize" = '16px';
    "headerFontWeight" = 700;
    "headerFontStyle" = 'normal';
    "headerFontDecoration" = 'none';
    "headerFontColor" = '#000000'
    "headerFontAlignment" = 'left';
    "sortType" = 0;
    "dataLabelsLineFontPosition" = 'top';
    "dataLabelsBarFontPosition" = 'top';
    "topLegend" = null;
    "leftLegend" = 'center';
    "legendOrient" = 'horizontal'
    "bottomLegend" = '0%'
    "rightLegend" = null
    "sortColumn" = 'select';
    "locationDrillDownSwitch" = false;
    "pivotColumnTotals" = true;
    "pivotRowTotals" = true;
    "bandingEvenColor"= '#ffffff'
    "bandingOddColor"= '#f5f7fa'
    "rowTotalFontColor" = '#000000';
    "rowTotalFontColorSwitch" = false;
    "rowTotalBgColor" = '#f2f2f2';
    "rowTotalBgColorSwitch" = false;
    "colTotalFontColor" = '#000000';
    "colTotalFontColorSwitch" = false;
    "colTotalBgColor" = '#e6f7ff';
    "colTotalBgColorSwitch" = false;
    "grandTotalFontColor" = '#000000';
    "grandTotalFontColorSwitch" = false;
    "grandTotalBgColor" = '#ffe7cc';
    "grandTotalBgColorSwitch" = false;
    "toggleTableSearch" = true;
    "toggleTablePagination" = true;
    "measureColorRanges" = [];
    "isMeasureDistribution" = false;
    "measureDivisions" = 2;
    "kpiTarget" = 0;
    "kpiShowTrendline" = false;
    "kpiTrendAxis" = 'month';
    "trendData" = [];
    "trendLabels" = [];
    "selectedDateColumn"  ='';
    "showKpiIndicator" = false;
    "indicatorValue" = '';
    "indicatorIsIncreased" = '';
    "kpiChartColorSwitch" = false;
    "hBarHeight" = '';
    }
  }
]

#**notes:**
- **Mandatory Data Object:**  
  Every chart object must include a 'data' object with:  
  - 'title': sheet_name from the user input  
  - 'sheetTagName': wrapped in '<p>' tags (e.g., '<p>Sales Overview</p>')  

  Example for non-text chart:
  "data": {
    "title": "Sales Overview",
    "sheetTagName": "<p>Sales Overview</p>"
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
  content = content.replace(/,\s*([}\]])/g, "$1");
  content = content.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
  content = content.trim();

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
