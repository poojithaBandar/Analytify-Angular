import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkbenchService } from '../workbench.service';
import { TemplateDashboardService } from '../../../services/template-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../../shared/sharedmodule';
import { forkJoin } from 'rxjs';

/**
 * Component for importing and exporting dashboards.
 */
@Component({
  selector: 'app-dashboard-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule,SharedModule],
  templateUrl: './dashboard-transfer.component.html',
  styleUrls: ['./dashboard-transfer.component.scss']
})
export class DashboardTransferComponent {
  exportDashboardId! : number;
  importKey = '';
  hierarchyId! : number;
  loadingExport = false;
  exportResultKey = '';
  @ViewChild('sheetcontainer', { read: ViewContainerRef }) container!: ViewContainerRef;

  resultOutput ={
    "sheets": [
        {
            "sheet_id": 16903,
            "sheet_name": "Sheet 1(test_sharing_IHWZHT)_XYA7GE",
            "chart_id": 1,
            "chart_type": "Table",
            "hierarchy_id": 2521,
            "sheet_tag_name": "<p>Sheet 1(test_sharing_IHWZHT)_XYA7GE</p>",
            "sheet_data": {
                "drillDownHierarchy": [],
                "isDrillDownData": false,
                "heirarchyColumnData": [],
                "selectedSortColumnData": null,
                "columns": [
                    {
                        "column": "name",
                        "data_type": "string",
                        "table_name": "company_companies"
                    }
                ],
                "columns_data": [
                    [
                        "name",
                        "string",
                        "",
                        ""
                    ]
                ],
                "rows": [
                    {
                        "column": "id",
                        "data_type": "int64",
                        "type": "sum"
                    }
                ],
                "rows_data": [
                    [
                        "id",
                        "aggregate",
                        "sum",
                        ""
                    ]
                ],
                "pivotMeasure": [],
                "pivotMeasure_Data": [],
                "pivotMeasureValuesData": [],
                "pivotTransformedData": [],
                "col": [
                    {
                        "column": "name",
                        "result_data": []
                    }
                ],
                "row": [
                    {
                        "col": "sum(id)",
                        "result_data": []
                    }
                ],
                "results": {
                    "tableData": [],
                    "tableColumns": [
                        "name",
                        "sum(id)"
                    ],
                    "banding": false,
                    "items_per_page": 10,
                    "total_items": 25,
                    "barYaxis": [],
                    "barXaxis": [],
                    "pieYaxis": [],
                    "pieXaxis": [],
                    "lineYaxis": [],
                    "lineXaxis": [],
                    "areaYaxis": [],
                    "areaXaxis": [],
                    "sidebysideBarYaxis": [],
                    "sidebysideBarXaxis": [],
                    "stokedBarYaxis": [],
                    "stokedBarXaxis": [],
                    "barLineYaxis": [],
                    "barLineXaxis": [],
                    "hStockedYaxis": [],
                    "hStockedXaxis": [],
                    "hgroupedYaxis": [],
                    "hgroupedXaxis": [],
                    "multiLineYaxis": [],
                    "multiLineXaxis": [],
                    "donutYaxis": [],
                    "donutXaxis": [],
                    "decimalplaces": 2,
                    "kpiPrefix": "",
                    "kpiSuffix": "",
                    "kpiDecimalUnit": "none",
                    "kpiDecimalPlaces": 2
                },
                "isApexChart": false,
                "isEChart": true,
                "customizeOptions": {
                    "isZoom": false,
                    "xGridColor": "#2392c1",
                    "xGridSwitch": false,
                    "xLabelSwitch": true,
                    "xLabelColor": "#2392c1",
                    "yLabelSwitch": true,
                    "yGridColor": "#2392c1",
                    "yGridSwitch": false,
                    "yLabelColor": "#2392c1",
                    "xLabelFontFamily": "sans-serif",
                    "xLabelFontSize": 12,
                    "xlabelFontWeight": 400,
                    "labelAlignment": "left",
                    "backgroundColor": "#fcfcfc",
                    "color": "#2392c1",
                    "selectedColorScheme": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "ylabelFontWeight": 400,
                    "isBold": false,
                    "isTableHeaderBold": false,
                    "isTableDataBold": false,
                    "isYlabelBold": false,
                    "isXlabelBold": false,
                    "yLabelFontFamily": "sans-serif",
                    "yLabelFontSize": 12,
                    "bandingSwitch": false,
                    "backgroundColorSwitch": false,
                    "chartColorSwitch": false,
                    "barColorSwitch": false,
                    "lineColorSwitch": false,
                    "gridLineColorSwitch": false,
                    "xLabelColorSwitch": false,
                    "xGridLineColorSwitch": false,
                    "yLabelColorSwitch": false,
                    "yGridLineColorSwitch": false,
                    "bandingColorSwitch": false,
                    "kpiColorSwitch": false,
                    "funnelColorSwitch": false,
                    "kpiColor": "#000000",
                    "barColor": "#4382f7",
                    "lineColor": "#38ff98",
                    "GridColor": "#089ffc",
                    "legendSwitch": true,
                    "dataLabels": true,
                    "label": true,
                    "donutSize": 50,
                    "isDistributed": true,
                    "kpiFontSize": "3",
                    "minValueGuage": 0,
                    "maxValueGuage": 100,
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "legendsAllignment": "bottom",
                    "displayUnits": "none",
                    "suffix": "",
                    "prefix": "",
                    "dataLabelsFontFamily": "sans-serif",
                    "dataLabelsFontSize": "12px",
                    "dataLabelsFontPosition": "top",
                    "measureAlignment": "center",
                    "dimensionAlignment": "center",
                    "tableDataFontFamily": "sans-serif",
                    "tableDataFontSize": "12px",
                    "tableDataFontWeight": 400,
                    "tableDataFontStyle": "normal",
                    "tableDataFontDecoration": "none",
                    "tableDataFontColor": "#000000",
                    "tableDataFontAlignment": "left",
                    "headerFontFamily": "'Arial', sans-serif",
                    "headerFontSize": "16px",
                    "headerFontWeight": 700,
                    "headerFontStyle": "normal",
                    "headerFontDecoration": "none",
                    "headerFontColor": "#000000",
                    "headerFontAlignment": "left",
                    "dimensionColor": "#2392c1",
                    "measureColor": "#2392c1",
                    "dataLabelsColor": "#2392c1",
                    "sortType": 0,
                    "rightLegend": null,
                    "bottomLegend": "0%",
                    "legendOrient": "horizontal",
                    "leftLegend": "center",
                    "topLegend": null,
                    "sortColumn": "select",
                    "locationDrillDownSwitch": false,
                    "isLocationField": false,
                    "KPIDecimalPlaces": 2,
                    "KPIDisplayUnits": "none",
                    "KPIPrefix": "",
                    "KPISuffix": "",
                    "pivotRowTotals": true,
                    "pivotColumnTotals": true,
                    "bandingOddColor": "#f5f7fa",
                    "bandingEvenColor": "#ffffff"
                },
                "numberFormat": {
                    "decimalPlaces": 2,
                    "displayUnits": "none",
                    "prefix": "",
                    "suffix": ""
                }
            },
            "queryset_id": 3729,
            "created_by": 15,
            "sheet_filter_ids": [],
            "sheet_filter_quereyset_ids": "17074",
            "datasource_queryset_id": null,
            "filters_data": [],
            "custom_query": "select  \"name\" AS \"name\" , sum(\"id\") AS \"sum(id)\" from (SELECT \"company_companies\".\"id\" AS \"id\", \"company_companies\".\"identifier\" AS \"identifier\", \"company_companies\".\"name\" AS \"name\", \"company_companies\".\"status.id\" AS \"status.id\", \"company_companies\".\"status.name\" AS \"status.name\", \"company_companies\".\"status._info.status_href\" AS \"status._info.status_href\", \"company_companies\".\"country.id\" AS \"country.id\", \"company_companies\".\"country.name\" AS \"country.name\", \"company_companies\".\"country._info.country_href\" AS \"country._info.country_href\", \"company_companies\".\"phoneNumber\" AS \"phoneNumber\", \"company_companies\".\"website\" AS \"website\", \"company_companies\".\"territory.id\" AS \"territory.id\", \"company_companies\".\"territory.name\" AS \"territory.name\", \"company_companies\".\"territory._info.location_href\" AS \"territory._info.location_href\", \"company_companies\".\"market.id\" AS \"market.id\", \"company_companies\".\"market.name\" AS \"market.name\", \"company_companies\".\"market._info.Market_href\" AS \"market._info.Market_href\", \"company_companies\".\"defaultContact.id\" AS \"defaultContact.id\", \"company_companies\".\"defaultContact.name\" AS \"defaultContact.name\", \"company_companies\".\"defaultContact._info.contact_href\" AS \"defaultContact._info.contact_href\", \"company_companies\".\"dateAcquired\" AS \"dateAcquired\", \"company_companies\".\"annualRevenue\" AS \"annualRevenue\", \"company_companies\".\"timeZoneSetup.id\" AS \"timeZoneSetup.id\", \"company_companies\".\"timeZoneSetup.name\" AS \"timeZoneSetup.name\", \"company_companies\".\"timeZoneSetup._info.timeZoneSetup_href\" AS \"timeZoneSetup._info.timeZoneSetup_href\", \"company_companies\".\"leadFlag\" AS \"leadFlag\", \"company_companies\".\"unsubscribeFlag\" AS \"unsubscribeFlag\", \"company_companies\".\"taxCode.id\" AS \"taxCode.id\", \"company_companies\".\"taxCode.name\" AS \"taxCode.name\", \"company_companies\".\"taxCode._info.taxCode_href\" AS \"taxCode._info.taxCode_href\", \"company_companies\".\"billingTerms.id\" AS \"billingTerms.id\", \"company_companies\".\"billingTerms.name\" AS \"billingTerms.name\", \"company_companies\".\"billToCompany.id\" AS \"billToCompany.id\", \"company_companies\".\"billToCompany.identifier\" AS \"billToCompany.identifier\", \"company_companies\".\"billToCompany.name\" AS \"billToCompany.name\", \"company_companies\".\"billToCompany._info.company_href\" AS \"billToCompany._info.company_href\", \"company_companies\".\"invoiceDeliveryMethod.id\" AS \"invoiceDeliveryMethod.id\", \"company_companies\".\"invoiceDeliveryMethod.name\" AS \"invoiceDeliveryMethod.name\", \"company_companies\".\"deletedFlag\" AS \"deletedFlag\", \"company_companies\".\"mobileGuid\" AS \"mobileGuid\", \"company_companies\".\"isVendorFlag\" AS \"isVendorFlag\", \"company_companies\".\"types[0].id\" AS \"types[0].id\", \"company_companies\".\"types[0].name\" AS \"types[0].name\", \"company_companies\".\"types[0]._info.type_href\" AS \"types[0]._info.type_href\", \"company_companies\".\"site.id\" AS \"site.id\", \"company_companies\".\"site.name\" AS \"site.name\", \"company_companies\".\"site._info.site_href\" AS \"site._info.site_href\", \"company_companies\".\"_info.lastUpdated\" AS \"_info.lastUpdated\", \"company_companies\".\"_info.updatedBy\" AS \"_info.updatedBy\", \"company_companies\".\"_info.dateEntered\" AS \"_info.dateEntered\", \"company_companies\".\"_info.enteredBy\" AS \"_info.enteredBy\", \"company_companies\".\"_info.contacts_href\" AS \"_info.contacts_href\", \"company_companies\".\"_info.agreements_href\" AS \"_info.agreements_href\", \"company_companies\".\"_info.tickets_href\" AS \"_info.tickets_href\", \"company_companies\".\"_info.opportunities_href\" AS \"_info.opportunities_href\", \"company_companies\".\"_info.activities_href\" AS \"_info.activities_href\", \"company_companies\".\"_info.projects_href\" AS \"_info.projects_href\", \"company_companies\".\"_info.configurations_href\" AS \"_info.configurations_href\", \"company_companies\".\"_info.orders_href\" AS \"_info.orders_href\", \"company_companies\".\"_info.documents_href\" AS \"_info.documents_href\", \"company_companies\".\"_info.sites_href\" AS \"_info.sites_href\", \"company_companies\".\"_info.teams_href\" AS \"_info.teams_href\", \"company_companies\".\"_info.reports_href\" AS \"_info.reports_href\", \"company_companies\".\"_info.notes_href\" AS \"_info.notes_href\", \"company_companies\".\"addressLine1\" AS \"addressLine1\", \"company_companies\".\"addressLine2\" AS \"addressLine2\", \"company_companies\".\"city\" AS \"city\", \"company_companies\".\"state\" AS \"state\", \"company_companies\".\"zip\" AS \"zip\", \"company_companies\".\"faxNumber\" AS \"faxNumber\", \"company_companies\".\"accountNumber\" AS \"accountNumber\", \"company_companies\".\"numberOfEmployees\" AS \"numberOfEmployees\", \"company_companies\".\"leadSource\" AS \"leadSource\", \"company_companies\".\"billingContact.id\" AS \"billingContact.id\", \"company_companies\".\"billingContact.name\" AS \"billingContact.name\", \"company_companies\".\"billingContact._info.contact_href\" AS \"billingContact._info.contact_href\", \"company_companies\".\"invoiceToEmailAddress\" AS \"invoiceToEmailAddress\", \"company_companies\".\"billingSite.id\" AS \"billingSite.id\", \"company_companies\".\"billingSite.name\" AS \"billingSite.name\", \"company_companies\".\"billingSite._info.site_href\" AS \"billingSite._info.site_href\" FROM \"swdefdgfb_A23JNM\".\"company_companies\" AS \"company_companies\") temp_table group by  \"name\", \"name\", \"name\" ORDER BY \"name\" ASC NULLS FIRST",
            "sheet_col": [
                " \"name\""
            ],
            "sheet_row": [
                "\"sum(id)\""
            ],
            "col_data": [
                {
                    "column": "name",
                    "orginal_column": "name",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                }
            ],
            "row_data": [
                {
                    "column": "sum(id)",
                    "orginal_column": "id",
                    "data_type": "string",
                    "table_name": "id",
                    "type": ""
                }
            ],
            "sheet_query_data": {
                "columns_data": [
                    {
                        "column": "name",
                        "data": [
                            "Big Design Inc."
                        ]
                    }
                ],
                "rows_data": [
                    {
                        "column": "sum(id)",
                        "data": [
                            4
                        ]
                    }
                ]
            }
        },
        {
            "sheet_id": 16904,
            "sheet_name": "Sheet 2(test_sharing_IHWZHT)_5356LW",
            "chart_id": 6,
            "chart_type": "bar",
            "hierarchy_id": 2521,
            "sheet_tag_name": "<p>Sheet 2(test_sharing_IHWZHT)_5356LW</p>",
            "sheet_data": {
                "drillDownHierarchy": [],
                "isDrillDownData": false,
                "heirarchyColumnData": [],
                "selectedSortColumnData": null,
                "columns": [
                    {
                        "column": "name",
                        "data_type": "string",
                        "table_name": "company_companies"
                    }
                ],
                "columns_data": [
                    [
                        "name",
                        "string",
                        "",
                        ""
                    ]
                ],
                "rows": [
                    {
                        "column": "annualRevenue",
                        "data_type": "int64",
                        "type": "sum"
                    }
                ],
                "rows_data": [
                    [
                        "annualRevenue",
                        "aggregate",
                        "sum",
                        ""
                    ]
                ],
                "pivotMeasure": [],
                "pivotMeasure_Data": [],
                "pivotMeasureValuesData": [],
                "pivotTransformedData": [],
                "col": [
                    {
                        "column": "name",
                        "result_data": []
                    }
                ],
                "row": [
                    {
                        "col": "sum(annualRevenue)",
                        "result_data": []
                    }
                ],
                "results": {
                    "tableData": [],
                    "tableColumns": [],
                    "banding": false,
                    "items_per_page": 10,
                    "total_items": 25,
                    "barYaxis": [
                        2000000,
                        0,
                        72100000,
                        0,
                        0,
                        5000000,
                        800000,
                        0,
                        0,
                        45000000,
                        0,
                        5640000,
                        0,
                        0,
                        0,
                        15000000,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        143000000,
                        3200000,
                        0
                    ],
                    "barXaxis": [
                        "Big Design Inc.",
                        "Black Rooster Inc.",
                        "Blue Light Co.",
                        "BlueWeb Company",
                        "ConnectWise",
                        "Crazy Commerce Co.",
                        "DigitalTorch Inc.",
                        "Endsight",
                        "Future Message Co.",
                        "Green Torch Inc.",
                        "Green Vision Co.",
                        "High Design Co.",
                        "IndigoStrawberry Co.",
                        "InteractiveGoldfish Inc.",
                        "Key Pool Co.",
                        "MagicRooster L.L.C.",
                        "Microsoft",
                        "PinkNetworks L.L.C.",
                        "SolidCommerce Inc.",
                        "ThirstyDesign L.L.C.",
                        "Thompson Lisa",
                        "VioletPixel L.L.C.",
                        "Wild Eagle Inc.",
                        "Yellow Systems L.L.C.",
                        "Your Company"
                    ],
                    "pieYaxis": [],
                    "pieXaxis": [],
                    "lineYaxis": [],
                    "lineXaxis": [],
                    "areaYaxis": [],
                    "areaXaxis": [],
                    "sidebysideBarYaxis": [],
                    "sidebysideBarXaxis": [],
                    "stokedBarYaxis": [],
                    "stokedBarXaxis": [],
                    "barLineYaxis": [],
                    "barLineXaxis": [],
                    "hStockedYaxis": [],
                    "hStockedXaxis": [],
                    "hgroupedYaxis": [],
                    "hgroupedXaxis": [],
                    "multiLineYaxis": [],
                    "multiLineXaxis": [],
                    "donutYaxis": [],
                    "donutXaxis": [],
                    "decimalplaces": 2,
                    "kpiPrefix": "",
                    "kpiSuffix": "",
                    "kpiDecimalUnit": "none",
                    "kpiDecimalPlaces": 2
                },
                "isApexChart": false,
                "isEChart": true,
                "savedChartOptions": {
                    "backgroundColor": "#fff",
                    "legend": {
                        "orient": "vertical",
                        "left": "left"
                    },
                    "toolbox": {
                        "feature": {
                            "magicType": {
                                "show": true,
                                "type": [
                                    "line"
                                ]
                            },
                            "restore": {
                                "show": true
                            },
                            "saveAsImage": {
                                "show": true
                            }
                        }
                    },
                    "tooltip": {
                        "trigger": "axis"
                    },
                    "axisPointer": {
                        "type": "none"
                    },
                    "dataZoom": [
                        {
                            "show": false,
                            "type": "slider"
                        }
                    ],
                    "grid": {
                        "left": "3%",
                        "right": "4%",
                        "bottom": "13%",
                        "containLabel": true
                    },
                    "xAxis": {
                        "type": "category",
                        "data": [],
                        "nameLocation": "left",
                        "splitLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        },
                        "axisLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            }
                        },
                        "axisLabel": {
                            "show": true,
                            "fontFamily": "sans-serif",
                            "fontSize": 12,
                            "fontWeight": 400,
                            "color": "#2392c1",
                            "interval": 0,
                            "padding": [
                                10,
                                0,
                                10,
                                0
                            ],
                            "align": "center"
                        }
                    },
                    "toggleGridLines": true,
                    "yAxis": {
                        "type": "value",
                        "axisLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        },
                        "axisLabel": {
                            "show": true,
                            "fontFamily": "sans-serif",
                            "fontSize": 12,
                            "fontWeight": 400,
                            "color": "#2392c1",
                            "rotate": 0
                        },
                        "splitLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        }
                    },
                    "series": [
                        {
                            "itemStyle": {
                                "borderRadius": 5
                            },
                            "label": {
                                "show": true,
                                "position": "top",
                                "align": "center",
                                "fontFamily": "sans-serif",
                                "fontSize": "12px",
                                "fontWeight": 400,
                                "color": "#2392c1"
                            },
                            "type": "bar",
                            "barWidth": "80%",
                            "data": []
                        }
                    ],
                    "color": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "colorBy": "data"
                },
                "customizeOptions": {
                    "isZoom": false,
                    "xGridColor": "#2392c1",
                    "xGridSwitch": false,
                    "xLabelSwitch": true,
                    "xLabelColor": "#2392c1",
                    "yLabelSwitch": true,
                    "yGridColor": "#2392c1",
                    "yGridSwitch": false,
                    "yLabelColor": "#2392c1",
                    "xLabelFontFamily": "sans-serif",
                    "xLabelFontSize": 12,
                    "xlabelFontWeight": 400,
                    "labelAlignment": "left",
                    "backgroundColor": "#fff",
                    "color": "#2392c1",
                    "selectedColorScheme": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "ylabelFontWeight": 400,
                    "isBold": false,
                    "isTableHeaderBold": false,
                    "isTableDataBold": false,
                    "isYlabelBold": false,
                    "isXlabelBold": false,
                    "yLabelFontFamily": "sans-serif",
                    "yLabelFontSize": 12,
                    "bandingSwitch": false,
                    "backgroundColorSwitch": false,
                    "chartColorSwitch": false,
                    "barColorSwitch": false,
                    "lineColorSwitch": false,
                    "gridLineColorSwitch": false,
                    "xLabelColorSwitch": false,
                    "xGridLineColorSwitch": false,
                    "yLabelColorSwitch": false,
                    "yGridLineColorSwitch": false,
                    "bandingColorSwitch": false,
                    "kpiColorSwitch": false,
                    "funnelColorSwitch": false,
                    "kpiColor": "#000000",
                    "barColor": "#4382f7",
                    "lineColor": "#38ff98",
                    "GridColor": "#089ffc",
                    "legendSwitch": true,
                    "dataLabels": true,
                    "label": true,
                    "donutSize": 50,
                    "isDistributed": true,
                    "kpiFontSize": "3",
                    "minValueGuage": 0,
                    "maxValueGuage": 100,
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "legendsAllignment": "bottom",
                    "displayUnits": "none",
                    "suffix": "",
                    "prefix": "",
                    "dataLabelsFontFamily": "sans-serif",
                    "dataLabelsFontSize": "12px",
                    "dataLabelsFontPosition": "top",
                    "measureAlignment": "center",
                    "dimensionAlignment": "center",
                    "tableDataFontFamily": "sans-serif",
                    "tableDataFontSize": "12px",
                    "tableDataFontWeight": 400,
                    "tableDataFontStyle": "normal",
                    "tableDataFontDecoration": "none",
                    "tableDataFontColor": "#000000",
                    "tableDataFontAlignment": "left",
                    "headerFontFamily": "'Arial', sans-serif",
                    "headerFontSize": "16px",
                    "headerFontWeight": 700,
                    "headerFontStyle": "normal",
                    "headerFontDecoration": "none",
                    "headerFontColor": "#000000",
                    "headerFontAlignment": "left",
                    "dimensionColor": "#2392c1",
                    "measureColor": "#2392c1",
                    "dataLabelsColor": "#2392c1",
                    "sortType": 0,
                    "rightLegend": null,
                    "bottomLegend": "0%",
                    "legendOrient": "horizontal",
                    "leftLegend": "center",
                    "topLegend": null,
                    "sortColumn": "select",
                    "locationDrillDownSwitch": false,
                    "isLocationField": false,
                    "KPIDecimalPlaces": 2,
                    "KPIDisplayUnits": "none",
                    "KPIPrefix": "",
                    "KPISuffix": "",
                    "pivotRowTotals": true,
                    "pivotColumnTotals": true,
                    "bandingOddColor": "#f5f7fa",
                    "bandingEvenColor": "#ffffff"
                },
                "numberFormat": {
                    "decimalPlaces": 2,
                    "displayUnits": "none",
                    "prefix": "",
                    "suffix": ""
                }
            },
            "queryset_id": 3729,
            "created_by": 15,
            "sheet_filter_ids": [],
            "sheet_filter_quereyset_ids": "17075",
            "datasource_queryset_id": null,
            "filters_data": [],
            "custom_query": "select  \"name\" AS \"name\" , sum(\"annualRevenue\") AS \"sum(annualRevenue)\" from (SELECT \"company_companies\".\"id\" AS \"id\", \"company_companies\".\"identifier\" AS \"identifier\", \"company_companies\".\"name\" AS \"name\", \"company_companies\".\"status.id\" AS \"status.id\", \"company_companies\".\"status.name\" AS \"status.name\", \"company_companies\".\"status._info.status_href\" AS \"status._info.status_href\", \"company_companies\".\"country.id\" AS \"country.id\", \"company_companies\".\"country.name\" AS \"country.name\", \"company_companies\".\"country._info.country_href\" AS \"country._info.country_href\", \"company_companies\".\"phoneNumber\" AS \"phoneNumber\", \"company_companies\".\"website\" AS \"website\", \"company_companies\".\"territory.id\" AS \"territory.id\", \"company_companies\".\"territory.name\" AS \"territory.name\", \"company_companies\".\"territory._info.location_href\" AS \"territory._info.location_href\", \"company_companies\".\"market.id\" AS \"market.id\", \"company_companies\".\"market.name\" AS \"market.name\", \"company_companies\".\"market._info.Market_href\" AS \"market._info.Market_href\", \"company_companies\".\"defaultContact.id\" AS \"defaultContact.id\", \"company_companies\".\"defaultContact.name\" AS \"defaultContact.name\", \"company_companies\".\"defaultContact._info.contact_href\" AS \"defaultContact._info.contact_href\", \"company_companies\".\"dateAcquired\" AS \"dateAcquired\", \"company_companies\".\"annualRevenue\" AS \"annualRevenue\", \"company_companies\".\"timeZoneSetup.id\" AS \"timeZoneSetup.id\", \"company_companies\".\"timeZoneSetup.name\" AS \"timeZoneSetup.name\", \"company_companies\".\"timeZoneSetup._info.timeZoneSetup_href\" AS \"timeZoneSetup._info.timeZoneSetup_href\", \"company_companies\".\"leadFlag\" AS \"leadFlag\", \"company_companies\".\"unsubscribeFlag\" AS \"unsubscribeFlag\", \"company_companies\".\"taxCode.id\" AS \"taxCode.id\", \"company_companies\".\"taxCode.name\" AS \"taxCode.name\", \"company_companies\".\"taxCode._info.taxCode_href\" AS \"taxCode._info.taxCode_href\", \"company_companies\".\"billingTerms.id\" AS \"billingTerms.id\", \"company_companies\".\"billingTerms.name\" AS \"billingTerms.name\", \"company_companies\".\"billToCompany.id\" AS \"billToCompany.id\", \"company_companies\".\"billToCompany.identifier\" AS \"billToCompany.identifier\", \"company_companies\".\"billToCompany.name\" AS \"billToCompany.name\", \"company_companies\".\"billToCompany._info.company_href\" AS \"billToCompany._info.company_href\", \"company_companies\".\"invoiceDeliveryMethod.id\" AS \"invoiceDeliveryMethod.id\", \"company_companies\".\"invoiceDeliveryMethod.name\" AS \"invoiceDeliveryMethod.name\", \"company_companies\".\"deletedFlag\" AS \"deletedFlag\", \"company_companies\".\"mobileGuid\" AS \"mobileGuid\", \"company_companies\".\"isVendorFlag\" AS \"isVendorFlag\", \"company_companies\".\"types[0].id\" AS \"types[0].id\", \"company_companies\".\"types[0].name\" AS \"types[0].name\", \"company_companies\".\"types[0]._info.type_href\" AS \"types[0]._info.type_href\", \"company_companies\".\"site.id\" AS \"site.id\", \"company_companies\".\"site.name\" AS \"site.name\", \"company_companies\".\"site._info.site_href\" AS \"site._info.site_href\", \"company_companies\".\"_info.lastUpdated\" AS \"_info.lastUpdated\", \"company_companies\".\"_info.updatedBy\" AS \"_info.updatedBy\", \"company_companies\".\"_info.dateEntered\" AS \"_info.dateEntered\", \"company_companies\".\"_info.enteredBy\" AS \"_info.enteredBy\", \"company_companies\".\"_info.contacts_href\" AS \"_info.contacts_href\", \"company_companies\".\"_info.agreements_href\" AS \"_info.agreements_href\", \"company_companies\".\"_info.tickets_href\" AS \"_info.tickets_href\", \"company_companies\".\"_info.opportunities_href\" AS \"_info.opportunities_href\", \"company_companies\".\"_info.activities_href\" AS \"_info.activities_href\", \"company_companies\".\"_info.projects_href\" AS \"_info.projects_href\", \"company_companies\".\"_info.configurations_href\" AS \"_info.configurations_href\", \"company_companies\".\"_info.orders_href\" AS \"_info.orders_href\", \"company_companies\".\"_info.documents_href\" AS \"_info.documents_href\", \"company_companies\".\"_info.sites_href\" AS \"_info.sites_href\", \"company_companies\".\"_info.teams_href\" AS \"_info.teams_href\", \"company_companies\".\"_info.reports_href\" AS \"_info.reports_href\", \"company_companies\".\"_info.notes_href\" AS \"_info.notes_href\", \"company_companies\".\"addressLine1\" AS \"addressLine1\", \"company_companies\".\"addressLine2\" AS \"addressLine2\", \"company_companies\".\"city\" AS \"city\", \"company_companies\".\"state\" AS \"state\", \"company_companies\".\"zip\" AS \"zip\", \"company_companies\".\"faxNumber\" AS \"faxNumber\", \"company_companies\".\"accountNumber\" AS \"accountNumber\", \"company_companies\".\"numberOfEmployees\" AS \"numberOfEmployees\", \"company_companies\".\"leadSource\" AS \"leadSource\", \"company_companies\".\"billingContact.id\" AS \"billingContact.id\", \"company_companies\".\"billingContact.name\" AS \"billingContact.name\", \"company_companies\".\"billingContact._info.contact_href\" AS \"billingContact._info.contact_href\", \"company_companies\".\"invoiceToEmailAddress\" AS \"invoiceToEmailAddress\", \"company_companies\".\"billingSite.id\" AS \"billingSite.id\", \"company_companies\".\"billingSite.name\" AS \"billingSite.name\", \"company_companies\".\"billingSite._info.site_href\" AS \"billingSite._info.site_href\" FROM \"swdefdgfb_A23JNM\".\"company_companies\" AS \"company_companies\") temp_table group by  \"name\", \"name\", \"name\" ORDER BY \"name\" ASC NULLS FIRST",
            "sheet_col": [
                " \"name\""
            ],
            "sheet_row": [
                "\"sum(annualRevenue)\""
            ],
            "col_data": [
                {
                    "column": "name",
                    "orginal_column": "name",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                }
            ],
            "row_data": [
                {
                    "column": "sum(annualRevenue)",
                    "orginal_column": "annualRevenue",
                    "data_type": "string",
                    "table_name": "annualRevenue",
                    "type": ""
                }
            ],
            "sheet_query_data": {
                "columns_data": [
                    {
                        "column": "name",
                        "data": [
                            "Big Design Inc."
                        ]
                    }
                ],
                "rows_data": [
                    {
                        "column": "sum(annualRevenue)",
                        "data": [
                            2000000
                        ]
                    }
                ]
            }
        },
        {
            "sheet_id": 16905,
            "sheet_name": "Sheet 3(test_sharing_IHWZHT)_W47GRR",
            "chart_id": 8,
            "chart_type": "DUAL LINE",
            "hierarchy_id": 2521,
            "sheet_tag_name": "<p>Sheet 3(test_sharing_IHWZHT)_W47GRR</p>",
            "sheet_data": {
                "drillDownHierarchy": [],
                "isDrillDownData": false,
                "heirarchyColumnData": [],
                "selectedSortColumnData": null,
                "columns": [
                    {
                        "column": "name",
                        "data_type": "string",
                        "table_name": "company_companies"
                    }
                ],
                "columns_data": [
                    [
                        "name",
                        "string",
                        "",
                        ""
                    ]
                ],
                "rows": [
                    {
                        "column": "billingContact.id",
                        "data_type": "int64",
                        "type": ""
                    },
                    {
                        "column": "taxCode.id",
                        "data_type": "int64",
                        "type": ""
                    }
                ],
                "rows_data": [
                    [
                        "billingContact.id",
                        "int64",
                        "",
                        ""
                    ],
                    [
                        "taxCode.id",
                        "int64",
                        "",
                        ""
                    ]
                ],
                "pivotMeasure": [],
                "pivotMeasure_Data": [],
                "pivotMeasureValuesData": [],
                "pivotTransformedData": [],
                "col": [
                    {
                        "column": "name",
                        "result_data": []
                    }
                ],
                "row": [
                    {
                        "col": "billingContact.id",
                        "result_data": []
                    },
                    {
                        "col": "taxCode.id",
                        "result_data": []
                    }
                ],
                "results": {
                    "tableData": [],
                    "tableColumns": [],
                    "banding": false,
                    "items_per_page": 10,
                    "total_items": 25,
                    "barYaxis": [],
                    "barXaxis": [],
                    "pieYaxis": [],
                    "pieXaxis": [],
                    "lineYaxis": [],
                    "lineXaxis": [],
                    "areaYaxis": [],
                    "areaXaxis": [],
                    "sidebysideBarYaxis": [],
                    "sidebysideBarXaxis": [],
                    "stokedBarYaxis": [],
                    "stokedBarXaxis": [],
                    "barLineYaxis": [],
                    "barLineXaxis": [],
                    "hStockedYaxis": [],
                    "hStockedXaxis": [],
                    "hgroupedYaxis": [],
                    "hgroupedXaxis": [],
                    "multiLineYaxis": [
                        {
                            "name": "billingContact.id",
                            "data": []
                        },
                        {
                            "name": "taxCode.id",
                            "data": []
                        }
                    ],
                    "multiLineXaxis": [
                        {
                            "name": "name",
                            "values": []
                        }
                    ],
                    "donutYaxis": [],
                    "donutXaxis": [],
                    "decimalplaces": 2,
                    "kpiPrefix": "",
                    "kpiSuffix": "",
                    "kpiDecimalUnit": "none",
                    "kpiDecimalPlaces": 2
                },
                "isApexChart": false,
                "isEChart": true,
                "savedChartOptions": {
                    "backgroundColor": "#fff",
                    "color": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "legend": {
                        "orient": "vertical",
                        "left": "left"
                    },
                    "toolbox": {
                        "feature": {
                            "magicType": {
                                "show": true,
                                "type": [
                                    "bar"
                                ]
                            },
                            "restore": {
                                "show": true
                            },
                            "saveAsImage": {
                                "show": true
                            }
                        }
                    },
                    "tooltip": {
                        "trigger": "axis"
                    },
                    "axisPointer": {
                        "type": "none"
                    },
                    "dataZoom": [
                        {
                            "show": false,
                            "type": "slider"
                        }
                    ],
                    "grid": {
                        "left": "3%",
                        "right": "4%",
                        "bottom": "13%",
                        "containLabel": true
                    },
                    "xAxis": {
                        "type": "category",
                        "data": [],
                        "splitLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        },
                        "axisLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            }
                        },
                        "axisLabel": {
                            "show": true,
                            "fontFamily": "sans-serif",
                            "fontSize": 12,
                            "fontWeight": 400,
                            "color": "#2392c1",
                            "align": "center"
                        }
                    },
                    "toggleGridLines": true,
                    "yAxis": {
                        "type": "value",
                        "axisLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            }
                        },
                        "axisLabel": {
                            "show": true,
                            "fontFamily": "sans-serif",
                            "fontSize": 12,
                            "fontWeight": 400,
                            "color": "#2392c1"
                        },
                        "splitLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        }
                    },
                    "series": [
                        {
                            "name": "billingContact.id",
                            "data": [],
                            "type": "line",
                            "stack": "Total",
                            "label": {
                                "show": true,
                                "position": "right",
                                "fontFamily": "sans-serif",
                                "fontSize": "12px",
                                "fontWeight": 400,
                                "color": "#2392c1"
                            }
                        },
                        {
                            "name": "taxCode.id",
                            "data": [],
                            "type": "line",
                            "stack": "Total",
                            "label": {
                                "show": true,
                                "position": "right",
                                "fontFamily": "sans-serif",
                                "fontSize": "12px",
                                "fontWeight": 400,
                                "color": "#2392c1"
                            }
                        }
                    ]
                },
                "customizeOptions": {
                    "isZoom": false,
                    "xGridColor": "#2392c1",
                    "xGridSwitch": false,
                    "xLabelSwitch": true,
                    "xLabelColor": "#2392c1",
                    "yLabelSwitch": true,
                    "yGridColor": "#2392c1",
                    "yGridSwitch": false,
                    "yLabelColor": "#2392c1",
                    "xLabelFontFamily": "sans-serif",
                    "xLabelFontSize": 12,
                    "xlabelFontWeight": 400,
                    "labelAlignment": "left",
                    "backgroundColor": "#fff",
                    "color": "#2392c1",
                    "selectedColorScheme": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "ylabelFontWeight": 400,
                    "isBold": false,
                    "isTableHeaderBold": false,
                    "isTableDataBold": false,
                    "isYlabelBold": false,
                    "isXlabelBold": false,
                    "yLabelFontFamily": "sans-serif",
                    "yLabelFontSize": 12,
                    "bandingSwitch": false,
                    "backgroundColorSwitch": false,
                    "chartColorSwitch": false,
                    "barColorSwitch": false,
                    "lineColorSwitch": false,
                    "gridLineColorSwitch": false,
                    "xLabelColorSwitch": false,
                    "xGridLineColorSwitch": false,
                    "yLabelColorSwitch": false,
                    "yGridLineColorSwitch": false,
                    "bandingColorSwitch": false,
                    "kpiColorSwitch": false,
                    "funnelColorSwitch": false,
                    "kpiColor": "#000000",
                    "barColor": "#4382f7",
                    "lineColor": "#38ff98",
                    "GridColor": "#089ffc",
                    "legendSwitch": true,
                    "dataLabels": true,
                    "label": true,
                    "donutSize": 50,
                    "isDistributed": true,
                    "kpiFontSize": "3",
                    "minValueGuage": 0,
                    "maxValueGuage": 100,
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "legendsAllignment": "bottom",
                    "displayUnits": "none",
                    "suffix": "",
                    "prefix": "",
                    "dataLabelsFontFamily": "sans-serif",
                    "dataLabelsFontSize": "12px",
                    "dataLabelsFontPosition": "top",
                    "measureAlignment": "center",
                    "dimensionAlignment": "center",
                    "tableDataFontFamily": "sans-serif",
                    "tableDataFontSize": "12px",
                    "tableDataFontWeight": 400,
                    "tableDataFontStyle": "normal",
                    "tableDataFontDecoration": "none",
                    "tableDataFontColor": "#000000",
                    "tableDataFontAlignment": "left",
                    "headerFontFamily": "'Arial', sans-serif",
                    "headerFontSize": "16px",
                    "headerFontWeight": 700,
                    "headerFontStyle": "normal",
                    "headerFontDecoration": "none",
                    "headerFontColor": "#000000",
                    "headerFontAlignment": "left",
                    "dimensionColor": "#2392c1",
                    "measureColor": "#2392c1",
                    "dataLabelsColor": "#2392c1",
                    "sortType": 0,
                    "rightLegend": null,
                    "bottomLegend": "0%",
                    "legendOrient": "horizontal",
                    "leftLegend": "center",
                    "topLegend": null,
                    "sortColumn": "select",
                    "locationDrillDownSwitch": false,
                    "isLocationField": false,
                    "KPIDecimalPlaces": 2,
                    "KPIDisplayUnits": "none",
                    "KPIPrefix": "",
                    "KPISuffix": "",
                    "pivotRowTotals": true,
                    "pivotColumnTotals": true,
                    "bandingOddColor": "#f5f7fa",
                    "bandingEvenColor": "#ffffff"
                },
                "numberFormat": {
                    "decimalPlaces": 2,
                    "displayUnits": "none",
                    "prefix": "",
                    "suffix": ""
                }
            },
            "queryset_id": 3729,
            "created_by": 15,
            "sheet_filter_ids": [],
            "sheet_filter_quereyset_ids": "17076",
            "datasource_queryset_id": null,
            "filters_data": [],
            "custom_query": "select  \"name\" AS \"name\" , \"billingContact.id\" AS  \"billingContact.id\", \"taxCode.id\" AS  \"taxCode.id\" from (SELECT \"company_companies\".\"id\" AS \"id\", \"company_companies\".\"identifier\" AS \"identifier\", \"company_companies\".\"name\" AS \"name\", \"company_companies\".\"status.id\" AS \"status.id\", \"company_companies\".\"status.name\" AS \"status.name\", \"company_companies\".\"status._info.status_href\" AS \"status._info.status_href\", \"company_companies\".\"country.id\" AS \"country.id\", \"company_companies\".\"country.name\" AS \"country.name\", \"company_companies\".\"country._info.country_href\" AS \"country._info.country_href\", \"company_companies\".\"phoneNumber\" AS \"phoneNumber\", \"company_companies\".\"website\" AS \"website\", \"company_companies\".\"territory.id\" AS \"territory.id\", \"company_companies\".\"territory.name\" AS \"territory.name\", \"company_companies\".\"territory._info.location_href\" AS \"territory._info.location_href\", \"company_companies\".\"market.id\" AS \"market.id\", \"company_companies\".\"market.name\" AS \"market.name\", \"company_companies\".\"market._info.Market_href\" AS \"market._info.Market_href\", \"company_companies\".\"defaultContact.id\" AS \"defaultContact.id\", \"company_companies\".\"defaultContact.name\" AS \"defaultContact.name\", \"company_companies\".\"defaultContact._info.contact_href\" AS \"defaultContact._info.contact_href\", \"company_companies\".\"dateAcquired\" AS \"dateAcquired\", \"company_companies\".\"annualRevenue\" AS \"annualRevenue\", \"company_companies\".\"timeZoneSetup.id\" AS \"timeZoneSetup.id\", \"company_companies\".\"timeZoneSetup.name\" AS \"timeZoneSetup.name\", \"company_companies\".\"timeZoneSetup._info.timeZoneSetup_href\" AS \"timeZoneSetup._info.timeZoneSetup_href\", \"company_companies\".\"leadFlag\" AS \"leadFlag\", \"company_companies\".\"unsubscribeFlag\" AS \"unsubscribeFlag\", \"company_companies\".\"taxCode.id\" AS \"taxCode.id\", \"company_companies\".\"taxCode.name\" AS \"taxCode.name\", \"company_companies\".\"taxCode._info.taxCode_href\" AS \"taxCode._info.taxCode_href\", \"company_companies\".\"billingTerms.id\" AS \"billingTerms.id\", \"company_companies\".\"billingTerms.name\" AS \"billingTerms.name\", \"company_companies\".\"billToCompany.id\" AS \"billToCompany.id\", \"company_companies\".\"billToCompany.identifier\" AS \"billToCompany.identifier\", \"company_companies\".\"billToCompany.name\" AS \"billToCompany.name\", \"company_companies\".\"billToCompany._info.company_href\" AS \"billToCompany._info.company_href\", \"company_companies\".\"invoiceDeliveryMethod.id\" AS \"invoiceDeliveryMethod.id\", \"company_companies\".\"invoiceDeliveryMethod.name\" AS \"invoiceDeliveryMethod.name\", \"company_companies\".\"deletedFlag\" AS \"deletedFlag\", \"company_companies\".\"mobileGuid\" AS \"mobileGuid\", \"company_companies\".\"isVendorFlag\" AS \"isVendorFlag\", \"company_companies\".\"types[0].id\" AS \"types[0].id\", \"company_companies\".\"types[0].name\" AS \"types[0].name\", \"company_companies\".\"types[0]._info.type_href\" AS \"types[0]._info.type_href\", \"company_companies\".\"site.id\" AS \"site.id\", \"company_companies\".\"site.name\" AS \"site.name\", \"company_companies\".\"site._info.site_href\" AS \"site._info.site_href\", \"company_companies\".\"_info.lastUpdated\" AS \"_info.lastUpdated\", \"company_companies\".\"_info.updatedBy\" AS \"_info.updatedBy\", \"company_companies\".\"_info.dateEntered\" AS \"_info.dateEntered\", \"company_companies\".\"_info.enteredBy\" AS \"_info.enteredBy\", \"company_companies\".\"_info.contacts_href\" AS \"_info.contacts_href\", \"company_companies\".\"_info.agreements_href\" AS \"_info.agreements_href\", \"company_companies\".\"_info.tickets_href\" AS \"_info.tickets_href\", \"company_companies\".\"_info.opportunities_href\" AS \"_info.opportunities_href\", \"company_companies\".\"_info.activities_href\" AS \"_info.activities_href\", \"company_companies\".\"_info.projects_href\" AS \"_info.projects_href\", \"company_companies\".\"_info.configurations_href\" AS \"_info.configurations_href\", \"company_companies\".\"_info.orders_href\" AS \"_info.orders_href\", \"company_companies\".\"_info.documents_href\" AS \"_info.documents_href\", \"company_companies\".\"_info.sites_href\" AS \"_info.sites_href\", \"company_companies\".\"_info.teams_href\" AS \"_info.teams_href\", \"company_companies\".\"_info.reports_href\" AS \"_info.reports_href\", \"company_companies\".\"_info.notes_href\" AS \"_info.notes_href\", \"company_companies\".\"addressLine1\" AS \"addressLine1\", \"company_companies\".\"addressLine2\" AS \"addressLine2\", \"company_companies\".\"city\" AS \"city\", \"company_companies\".\"state\" AS \"state\", \"company_companies\".\"zip\" AS \"zip\", \"company_companies\".\"faxNumber\" AS \"faxNumber\", \"company_companies\".\"accountNumber\" AS \"accountNumber\", \"company_companies\".\"numberOfEmployees\" AS \"numberOfEmployees\", \"company_companies\".\"leadSource\" AS \"leadSource\", \"company_companies\".\"billingContact.id\" AS \"billingContact.id\", \"company_companies\".\"billingContact.name\" AS \"billingContact.name\", \"company_companies\".\"billingContact._info.contact_href\" AS \"billingContact._info.contact_href\", \"company_companies\".\"invoiceToEmailAddress\" AS \"invoiceToEmailAddress\", \"company_companies\".\"billingSite.id\" AS \"billingSite.id\", \"company_companies\".\"billingSite.name\" AS \"billingSite.name\", \"company_companies\".\"billingSite._info.site_href\" AS \"billingSite._info.site_href\" FROM \"swdefdgfb_A23JNM\".\"company_companies\" AS \"company_companies\") temp_table group by  \"name\", \"name\", \"billingContact.id\", \"taxCode.id\", \"name\", \"billingContact.id\", \"taxCode.id\" ORDER BY \"name\" ASC NULLS FIRST",
            "sheet_col": [
                " \"name\""
            ],
            "sheet_row": [
                " \"billingContact.id\"",
                " \"taxCode.id\""
            ],
            "col_data": [
                {
                    "column": "name",
                    "orginal_column": "name",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                }
            ],
            "row_data": [
                {
                    "column": "billingContact.id",
                    "orginal_column": "billingContact.id",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                },
                {
                    "column": "taxCode.id",
                    "orginal_column": "taxCode.id",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                }
            ],
            "sheet_query_data": {
                "columns_data": [
                    {
                        "column": "name",
                        "data": [
                            "Big Design Inc."
                        ]
                    }
                ],
                "rows_data": [
                    {
                        "column": "billingContact.id",
                        "data": [
                            8
                        ]
                    },
                    {
                        "column": "taxCode.id",
                        "data": [
                            11
                        ]
                    }
                ]
            }
        },
        {
            "sheet_id": 16906,
            "sheet_name": "Sheet 4(test_sharing_IHWZHT)_KKY4JT",
            "chart_id": 12,
            "chart_type": "RADAR",
            "hierarchy_id": 2521,
            "sheet_tag_name": "<p>Sheet 4(test_sharing_IHWZHT)_KKY4JT</p>",
            "sheet_data": {
                "drillDownHierarchy": [],
                "isDrillDownData": false,
                "heirarchyColumnData": [],
                "selectedSortColumnData": null,
                "columns": [
                    {
                        "column": "name",
                        "data_type": "string",
                        "table_name": "company_companies"
                    },
                    {
                        "column": "identifier",
                        "data_type": "string",
                        "table_name": "company_companies"
                    }
                ],
                "columns_data": [
                    [
                        "name",
                        "string",
                        "",
                        ""
                    ],
                    [
                        "identifier",
                        "string",
                        "",
                        ""
                    ]
                ],
                "rows": [
                    {
                        "column": "state",
                        "data_type": "string",
                        "table_name": "company_companies"
                    },
                    {
                        "column": "city",
                        "data_type": "string",
                        "table_name": "company_companies"
                    },
                    {
                        "column": "phoneNumber",
                        "data_type": "string",
                        "table_name": "company_companies"
                    },
                    {
                        "column": "website",
                        "data_type": "string",
                        "table_name": "company_companies"
                    },
                    {
                        "column": "country.name",
                        "data_type": "string",
                        "table_name": "company_companies"
                    }
                ],
                "rows_data": [
                    [
                        "state",
                        "string",
                        "",
                        ""
                    ],
                    [
                        "city",
                        "string",
                        "",
                        ""
                    ],
                    [
                        "phoneNumber",
                        "string",
                        "",
                        ""
                    ],
                    [
                        "website",
                        "string",
                        "",
                        ""
                    ],
                    [
                        "country.name",
                        "string",
                        "",
                        ""
                    ]
                ],
                "pivotMeasure": [],
                "pivotMeasure_Data": [],
                "pivotMeasureValuesData": [],
                "pivotTransformedData": [],
                "col": [
                    {
                        "column": "name",
                        "result_data": []
                    },
                    {
                        "column": "identifier",
                        "result_data": []
                    }
                ],
                "row": [
                    {
                        "col": "state",
                        "result_data": []
                    },
                    {
                        "col": "city",
                        "result_data": []
                    },
                    {
                        "col": "phoneNumber",
                        "result_data": []
                    },
                    {
                        "col": "website",
                        "result_data": []
                    },
                    {
                        "col": "country.name",
                        "result_data": []
                    }
                ],
                "results": {
                    "tableData": [],
                    "tableColumns": [],
                    "banding": false,
                    "total_items": 0,
                    "barYaxis": [],
                    "barXaxis": [],
                    "pieYaxis": [],
                    "pieXaxis": [],
                    "lineYaxis": [],
                    "lineXaxis": [],
                    "areaYaxis": [],
                    "areaXaxis": [],
                    "sidebysideBarYaxis": [],
                    "sidebysideBarXaxis": [],
                    "stokedBarYaxis": [],
                    "stokedBarXaxis": [],
                    "barLineYaxis": [],
                    "barLineXaxis": [],
                    "hStockedYaxis": [],
                    "hStockedXaxis": [],
                    "hgroupedYaxis": [],
                    "hgroupedXaxis": [],
                    "multiLineYaxis": [],
                    "multiLineXaxis": [],
                    "donutYaxis": [],
                    "donutXaxis": [],
                    "decimalplaces": 2,
                    "kpiPrefix": "",
                    "kpiSuffix": "",
                    "kpiDecimalUnit": "none",
                    "kpiDecimalPlaces": 2
                },
                "isApexChart": false,
                "isEChart": true,
                "savedChartOptions": {
                    "backgroundColor": "#fff",
                    "tooltip": {
                        "trigger": "item"
                    },
                    "legend": {
                        "bottom": "bottom",
                        "left": "center",
                        "orient": "horizontal"
                    },
                    "radar": {
                        "axisName": {
                            "color": "#2392c1"
                        },
                        "axisLabel": {
                            "color": "#2392c1"
                        },
                        "indicator": []
                    },
                    "color": "#2392c1",
                    "series": [
                        {
                            "type": "radar",
                            "data": []
                        }
                    ]
                },
                "customizeOptions": {
                    "isZoom": false,
                    "xGridColor": "#2392c1",
                    "xGridSwitch": false,
                    "xLabelSwitch": true,
                    "xLabelColor": "#2392c1",
                    "yLabelSwitch": true,
                    "yGridColor": "#2392c1",
                    "yGridSwitch": false,
                    "yLabelColor": "#2392c1",
                    "xLabelFontFamily": "sans-serif",
                    "xLabelFontSize": 12,
                    "xlabelFontWeight": 400,
                    "labelAlignment": "left",
                    "backgroundColor": "#fff",
                    "color": "#2392c1",
                    "selectedColorScheme": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "ylabelFontWeight": 400,
                    "isBold": false,
                    "isTableHeaderBold": false,
                    "isTableDataBold": false,
                    "isYlabelBold": false,
                    "isXlabelBold": false,
                    "yLabelFontFamily": "sans-serif",
                    "yLabelFontSize": 12,
                    "bandingSwitch": false,
                    "backgroundColorSwitch": false,
                    "chartColorSwitch": false,
                    "barColorSwitch": false,
                    "lineColorSwitch": false,
                    "gridLineColorSwitch": false,
                    "xLabelColorSwitch": false,
                    "xGridLineColorSwitch": false,
                    "yLabelColorSwitch": false,
                    "yGridLineColorSwitch": false,
                    "bandingColorSwitch": false,
                    "kpiColorSwitch": false,
                    "funnelColorSwitch": false,
                    "kpiColor": "#000000",
                    "barColor": "#4382f7",
                    "lineColor": "#38ff98",
                    "GridColor": "#089ffc",
                    "legendSwitch": true,
                    "dataLabels": true,
                    "label": true,
                    "donutSize": 50,
                    "isDistributed": true,
                    "kpiFontSize": "3",
                    "minValueGuage": 0,
                    "maxValueGuage": 100,
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "legendsAllignment": "bottom",
                    "displayUnits": "none",
                    "suffix": "",
                    "prefix": "",
                    "dataLabelsFontFamily": "sans-serif",
                    "dataLabelsFontSize": "12px",
                    "dataLabelsFontPosition": "top",
                    "measureAlignment": "center",
                    "dimensionAlignment": "center",
                    "tableDataFontFamily": "sans-serif",
                    "tableDataFontSize": "12px",
                    "tableDataFontWeight": 400,
                    "tableDataFontStyle": "normal",
                    "tableDataFontDecoration": "none",
                    "tableDataFontColor": "#000000",
                    "tableDataFontAlignment": "left",
                    "headerFontFamily": "'Arial', sans-serif",
                    "headerFontSize": "16px",
                    "headerFontWeight": 700,
                    "headerFontStyle": "normal",
                    "headerFontDecoration": "none",
                    "headerFontColor": "#000000",
                    "headerFontAlignment": "left",
                    "dimensionColor": "#2392c1",
                    "measureColor": "#2392c1",
                    "dataLabelsColor": "#2392c1",
                    "sortType": 0,
                    "rightLegend": null,
                    "bottomLegend": "0%",
                    "legendOrient": "horizontal",
                    "leftLegend": "center",
                    "topLegend": null,
                    "sortColumn": "select",
                    "locationDrillDownSwitch": false,
                    "isLocationField": false,
                    "KPIDecimalPlaces": 2,
                    "KPIDisplayUnits": "none",
                    "KPIPrefix": "",
                    "KPISuffix": "",
                    "pivotRowTotals": true,
                    "pivotColumnTotals": true,
                    "bandingOddColor": "#f5f7fa",
                    "bandingEvenColor": "#ffffff"
                },
                "numberFormat": {
                    "decimalPlaces": 2,
                    "displayUnits": "none",
                    "prefix": "",
                    "suffix": ""
                }
            },
            "queryset_id": 3729,
            "created_by": 15,
            "sheet_filter_ids": [],
            "sheet_filter_quereyset_ids": "17077",
            "datasource_queryset_id": null,
            "filters_data": [],
            "custom_query": "select  \"name\" AS \"name\" , \"identifier\" AS  \"identifier\", \"state\" AS  \"state\", \"city\" AS  \"city\", \"phoneNumber\" AS  \"phoneNumber\", \"website\" AS  \"website\", \"country.name\" AS  \"country.name\" from (SELECT \"company_companies\".\"id\" AS \"id\", \"company_companies\".\"identifier\" AS \"identifier\", \"company_companies\".\"name\" AS \"name\", \"company_companies\".\"status.id\" AS \"status.id\", \"company_companies\".\"status.name\" AS \"status.name\", \"company_companies\".\"status._info.status_href\" AS \"status._info.status_href\", \"company_companies\".\"country.id\" AS \"country.id\", \"company_companies\".\"country.name\" AS \"country.name\", \"company_companies\".\"country._info.country_href\" AS \"country._info.country_href\", \"company_companies\".\"phoneNumber\" AS \"phoneNumber\", \"company_companies\".\"website\" AS \"website\", \"company_companies\".\"territory.id\" AS \"territory.id\", \"company_companies\".\"territory.name\" AS \"territory.name\", \"company_companies\".\"territory._info.location_href\" AS \"territory._info.location_href\", \"company_companies\".\"market.id\" AS \"market.id\", \"company_companies\".\"market.name\" AS \"market.name\", \"company_companies\".\"market._info.Market_href\" AS \"market._info.Market_href\", \"company_companies\".\"defaultContact.id\" AS \"defaultContact.id\", \"company_companies\".\"defaultContact.name\" AS \"defaultContact.name\", \"company_companies\".\"defaultContact._info.contact_href\" AS \"defaultContact._info.contact_href\", \"company_companies\".\"dateAcquired\" AS \"dateAcquired\", \"company_companies\".\"annualRevenue\" AS \"annualRevenue\", \"company_companies\".\"timeZoneSetup.id\" AS \"timeZoneSetup.id\", \"company_companies\".\"timeZoneSetup.name\" AS \"timeZoneSetup.name\", \"company_companies\".\"timeZoneSetup._info.timeZoneSetup_href\" AS \"timeZoneSetup._info.timeZoneSetup_href\", \"company_companies\".\"leadFlag\" AS \"leadFlag\", \"company_companies\".\"unsubscribeFlag\" AS \"unsubscribeFlag\", \"company_companies\".\"taxCode.id\" AS \"taxCode.id\", \"company_companies\".\"taxCode.name\" AS \"taxCode.name\", \"company_companies\".\"taxCode._info.taxCode_href\" AS \"taxCode._info.taxCode_href\", \"company_companies\".\"billingTerms.id\" AS \"billingTerms.id\", \"company_companies\".\"billingTerms.name\" AS \"billingTerms.name\", \"company_companies\".\"billToCompany.id\" AS \"billToCompany.id\", \"company_companies\".\"billToCompany.identifier\" AS \"billToCompany.identifier\", \"company_companies\".\"billToCompany.name\" AS \"billToCompany.name\", \"company_companies\".\"billToCompany._info.company_href\" AS \"billToCompany._info.company_href\", \"company_companies\".\"invoiceDeliveryMethod.id\" AS \"invoiceDeliveryMethod.id\", \"company_companies\".\"invoiceDeliveryMethod.name\" AS \"invoiceDeliveryMethod.name\", \"company_companies\".\"deletedFlag\" AS \"deletedFlag\", \"company_companies\".\"mobileGuid\" AS \"mobileGuid\", \"company_companies\".\"isVendorFlag\" AS \"isVendorFlag\", \"company_companies\".\"types[0].id\" AS \"types[0].id\", \"company_companies\".\"types[0].name\" AS \"types[0].name\", \"company_companies\".\"types[0]._info.type_href\" AS \"types[0]._info.type_href\", \"company_companies\".\"site.id\" AS \"site.id\", \"company_companies\".\"site.name\" AS \"site.name\", \"company_companies\".\"site._info.site_href\" AS \"site._info.site_href\", \"company_companies\".\"_info.lastUpdated\" AS \"_info.lastUpdated\", \"company_companies\".\"_info.updatedBy\" AS \"_info.updatedBy\", \"company_companies\".\"_info.dateEntered\" AS \"_info.dateEntered\", \"company_companies\".\"_info.enteredBy\" AS \"_info.enteredBy\", \"company_companies\".\"_info.contacts_href\" AS \"_info.contacts_href\", \"company_companies\".\"_info.agreements_href\" AS \"_info.agreements_href\", \"company_companies\".\"_info.tickets_href\" AS \"_info.tickets_href\", \"company_companies\".\"_info.opportunities_href\" AS \"_info.opportunities_href\", \"company_companies\".\"_info.activities_href\" AS \"_info.activities_href\", \"company_companies\".\"_info.projects_href\" AS \"_info.projects_href\", \"company_companies\".\"_info.configurations_href\" AS \"_info.configurations_href\", \"company_companies\".\"_info.orders_href\" AS \"_info.orders_href\", \"company_companies\".\"_info.documents_href\" AS \"_info.documents_href\", \"company_companies\".\"_info.sites_href\" AS \"_info.sites_href\", \"company_companies\".\"_info.teams_href\" AS \"_info.teams_href\", \"company_companies\".\"_info.reports_href\" AS \"_info.reports_href\", \"company_companies\".\"_info.notes_href\" AS \"_info.notes_href\", \"company_companies\".\"addressLine1\" AS \"addressLine1\", \"company_companies\".\"addressLine2\" AS \"addressLine2\", \"company_companies\".\"city\" AS \"city\", \"company_companies\".\"state\" AS \"state\", \"company_companies\".\"zip\" AS \"zip\", \"company_companies\".\"faxNumber\" AS \"faxNumber\", \"company_companies\".\"accountNumber\" AS \"accountNumber\", \"company_companies\".\"numberOfEmployees\" AS \"numberOfEmployees\", \"company_companies\".\"leadSource\" AS \"leadSource\", \"company_companies\".\"billingContact.id\" AS \"billingContact.id\", \"company_companies\".\"billingContact.name\" AS \"billingContact.name\", \"company_companies\".\"billingContact._info.contact_href\" AS \"billingContact._info.contact_href\", \"company_companies\".\"invoiceToEmailAddress\" AS \"invoiceToEmailAddress\", \"company_companies\".\"billingSite.id\" AS \"billingSite.id\", \"company_companies\".\"billingSite.name\" AS \"billingSite.name\", \"company_companies\".\"billingSite._info.site_href\" AS \"billingSite._info.site_href\" FROM \"swdefdgfb_A23JNM\".\"company_companies\" AS \"company_companies\") temp_table group by  \"name\", \"identifier\", \"name\", \"identifier\", \"state\", \"city\", \"phoneNumber\", \"website\", \"country.name\", \"name\", \"identifier\", \"state\", \"city\", \"phoneNumber\", \"website\", \"country.name\" ORDER BY \"name\" ASC NULLS FIRST",
            "sheet_col": [
                " \"name\"",
                " \"identifier\""
            ],
            "sheet_row": [
                " \"state\"",
                " \"city\"",
                " \"phoneNumber\"",
                " \"website\"",
                " \"country.name\""
            ],
            "col_data": [
                {
                    "column": "name",
                    "orginal_column": "name",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                },
                {
                    "column": "identifier",
                    "orginal_column": "identifier",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                }
            ],
            "row_data": [
                {
                    "column": "state",
                    "orginal_column": "state",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                },
                {
                    "column": "city",
                    "orginal_column": "city",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                },
                {
                    "column": "phoneNumber",
                    "orginal_column": "phoneNumber",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                },
                {
                    "column": "website",
                    "orginal_column": "website",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                },
                {
                    "column": "country.name",
                    "orginal_column": "country.name",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                }
            ],
            "sheet_query_data": {
                "columns_data": [
                    {
                        "column": "name",
                        "data": [
                            "Big Design Inc."
                        ]
                    },
                    {
                        "column": "identifier",
                        "data": [
                            "BigDesignInc"
                        ]
                    }
                ],
                "rows_data": [
                    {
                        "column": "state",
                        "data": [
                            "FL"
                        ]
                    },
                    {
                        "column": "city",
                        "data": [
                            "Tampa"
                        ]
                    },
                    {
                        "column": "phoneNumber",
                        "data": [
                            "8139881000"
                        ]
                    },
                    {
                        "column": "website",
                        "data": [
                            "http://www.BigDesign.com"
                        ]
                    },
                    {
                        "column": "country.name",
                        "data": [
                            "nan"
                        ]
                    }
                ]
            }
        },
        {
            "sheet_id": 16907,
            "sheet_name": "Sheet 5(test_sharing_IHWZHT)_X3FSUM",
            "chart_id": 1,
            "chart_type": "Table",
            "hierarchy_id": 2521,
            "sheet_tag_name": "<p>Sheet 5(test_sharing_IHWZHT)_X3FSUM</p>",
            "sheet_data": {
                "drillDownHierarchy": [],
                "isDrillDownData": false,
                "heirarchyColumnData": [],
                "selectedSortColumnData": null,
                "columns": [
                    {
                        "column": "identifier",
                        "data_type": "string",
                        "table_name": "company_companies"
                    }
                ],
                "columns_data": [
                    [
                        "identifier",
                        "string",
                        "",
                        ""
                    ]
                ],
                "rows": [
                    {
                        "column": "name",
                        "data_type": "string",
                        "table_name": "company_companies"
                    }
                ],
                "rows_data": [
                    [
                        "name",
                        "string",
                        "",
                        ""
                    ]
                ],
                "pivotMeasure": [],
                "pivotMeasure_Data": [],
                "pivotMeasureValuesData": [],
                "pivotTransformedData": [],
                "col": [
                    {
                        "column": "identifier",
                        "result_data": []
                    }
                ],
                "row": [
                    {
                        "col": "name",
                        "result_data": []
                    }
                ],
                "results": {
                    "tableData": [],
                    "tableColumns": [
                        "identifier",
                        "name"
                    ],
                    "banding": false,
                    "items_per_page": 10,
                    "total_items": 25,
                    "barYaxis": [],
                    "barXaxis": [],
                    "pieYaxis": [],
                    "pieXaxis": [],
                    "lineYaxis": [],
                    "lineXaxis": [],
                    "areaYaxis": [],
                    "areaXaxis": [],
                    "sidebysideBarYaxis": [],
                    "sidebysideBarXaxis": [],
                    "stokedBarYaxis": [],
                    "stokedBarXaxis": [],
                    "barLineYaxis": [],
                    "barLineXaxis": [],
                    "hStockedYaxis": [],
                    "hStockedXaxis": [],
                    "hgroupedYaxis": [],
                    "hgroupedXaxis": [],
                    "multiLineYaxis": [],
                    "multiLineXaxis": [],
                    "donutYaxis": [],
                    "donutXaxis": [],
                    "decimalplaces": 2,
                    "kpiPrefix": "",
                    "kpiSuffix": "",
                    "kpiDecimalUnit": "none",
                    "kpiDecimalPlaces": 2
                },
                "isApexChart": false,
                "isEChart": true,
                "customizeOptions": {
                    "isZoom": false,
                    "xGridColor": "#2392c1",
                    "xGridSwitch": false,
                    "xLabelSwitch": true,
                    "xLabelColor": "#2392c1",
                    "yLabelSwitch": true,
                    "yGridColor": "#2392c1",
                    "yGridSwitch": false,
                    "yLabelColor": "#2392c1",
                    "xLabelFontFamily": "sans-serif",
                    "xLabelFontSize": 12,
                    "xlabelFontWeight": 400,
                    "labelAlignment": "left",
                    "backgroundColor": "#fff",
                    "color": "#2392c1",
                    "selectedColorScheme": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "ylabelFontWeight": 400,
                    "isBold": false,
                    "isTableHeaderBold": false,
                    "isTableDataBold": false,
                    "isYlabelBold": false,
                    "isXlabelBold": false,
                    "yLabelFontFamily": "sans-serif",
                    "yLabelFontSize": 12,
                    "bandingSwitch": false,
                    "backgroundColorSwitch": false,
                    "chartColorSwitch": false,
                    "barColorSwitch": false,
                    "lineColorSwitch": false,
                    "gridLineColorSwitch": false,
                    "xLabelColorSwitch": false,
                    "xGridLineColorSwitch": false,
                    "yLabelColorSwitch": false,
                    "yGridLineColorSwitch": false,
                    "bandingColorSwitch": false,
                    "kpiColorSwitch": false,
                    "funnelColorSwitch": false,
                    "kpiColor": "#000000",
                    "barColor": "#4382f7",
                    "lineColor": "#38ff98",
                    "GridColor": "#089ffc",
                    "legendSwitch": true,
                    "dataLabels": true,
                    "label": true,
                    "donutSize": 50,
                    "isDistributed": true,
                    "kpiFontSize": "3",
                    "minValueGuage": 0,
                    "maxValueGuage": 100,
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "legendsAllignment": "bottom",
                    "displayUnits": "none",
                    "suffix": "",
                    "prefix": "",
                    "dataLabelsFontFamily": "sans-serif",
                    "dataLabelsFontSize": "12px",
                    "dataLabelsFontPosition": "top",
                    "measureAlignment": "center",
                    "dimensionAlignment": "center",
                    "tableDataFontFamily": "sans-serif",
                    "tableDataFontSize": "12px",
                    "tableDataFontWeight": 400,
                    "tableDataFontStyle": "normal",
                    "tableDataFontDecoration": "none",
                    "tableDataFontColor": "#000000",
                    "tableDataFontAlignment": "left",
                    "headerFontFamily": "'Arial', sans-serif",
                    "headerFontSize": "16px",
                    "headerFontWeight": 700,
                    "headerFontStyle": "normal",
                    "headerFontDecoration": "none",
                    "headerFontColor": "#000000",
                    "headerFontAlignment": "left",
                    "dimensionColor": "#2392c1",
                    "measureColor": "#2392c1",
                    "dataLabelsColor": "#2392c1",
                    "sortType": 0,
                    "rightLegend": null,
                    "bottomLegend": "0%",
                    "legendOrient": "horizontal",
                    "leftLegend": "center",
                    "topLegend": null,
                    "sortColumn": "select",
                    "locationDrillDownSwitch": false,
                    "isLocationField": false,
                    "KPIDecimalPlaces": 2,
                    "KPIDisplayUnits": "none",
                    "KPIPrefix": "",
                    "KPISuffix": "",
                    "pivotRowTotals": true,
                    "pivotColumnTotals": true,
                    "bandingOddColor": "#f5f7fa",
                    "bandingEvenColor": "#ffffff"
                },
                "numberFormat": {
                    "decimalPlaces": 2,
                    "displayUnits": "none",
                    "prefix": "",
                    "suffix": ""
                }
            },
            "queryset_id": 3729,
            "created_by": 15,
            "sheet_filter_ids": [],
            "sheet_filter_quereyset_ids": "17078",
            "datasource_queryset_id": null,
            "filters_data": [],
            "custom_query": "select  \"identifier\" AS \"identifier\" , \"name\" AS  \"name\" from (SELECT \"company_companies\".\"id\" AS \"id\", \"company_companies\".\"identifier\" AS \"identifier\", \"company_companies\".\"name\" AS \"name\", \"company_companies\".\"status.id\" AS \"status.id\", \"company_companies\".\"status.name\" AS \"status.name\", \"company_companies\".\"status._info.status_href\" AS \"status._info.status_href\", \"company_companies\".\"country.id\" AS \"country.id\", \"company_companies\".\"country.name\" AS \"country.name\", \"company_companies\".\"country._info.country_href\" AS \"country._info.country_href\", \"company_companies\".\"phoneNumber\" AS \"phoneNumber\", \"company_companies\".\"website\" AS \"website\", \"company_companies\".\"territory.id\" AS \"territory.id\", \"company_companies\".\"territory.name\" AS \"territory.name\", \"company_companies\".\"territory._info.location_href\" AS \"territory._info.location_href\", \"company_companies\".\"market.id\" AS \"market.id\", \"company_companies\".\"market.name\" AS \"market.name\", \"company_companies\".\"market._info.Market_href\" AS \"market._info.Market_href\", \"company_companies\".\"defaultContact.id\" AS \"defaultContact.id\", \"company_companies\".\"defaultContact.name\" AS \"defaultContact.name\", \"company_companies\".\"defaultContact._info.contact_href\" AS \"defaultContact._info.contact_href\", \"company_companies\".\"dateAcquired\" AS \"dateAcquired\", \"company_companies\".\"annualRevenue\" AS \"annualRevenue\", \"company_companies\".\"timeZoneSetup.id\" AS \"timeZoneSetup.id\", \"company_companies\".\"timeZoneSetup.name\" AS \"timeZoneSetup.name\", \"company_companies\".\"timeZoneSetup._info.timeZoneSetup_href\" AS \"timeZoneSetup._info.timeZoneSetup_href\", \"company_companies\".\"leadFlag\" AS \"leadFlag\", \"company_companies\".\"unsubscribeFlag\" AS \"unsubscribeFlag\", \"company_companies\".\"taxCode.id\" AS \"taxCode.id\", \"company_companies\".\"taxCode.name\" AS \"taxCode.name\", \"company_companies\".\"taxCode._info.taxCode_href\" AS \"taxCode._info.taxCode_href\", \"company_companies\".\"billingTerms.id\" AS \"billingTerms.id\", \"company_companies\".\"billingTerms.name\" AS \"billingTerms.name\", \"company_companies\".\"billToCompany.id\" AS \"billToCompany.id\", \"company_companies\".\"billToCompany.identifier\" AS \"billToCompany.identifier\", \"company_companies\".\"billToCompany.name\" AS \"billToCompany.name\", \"company_companies\".\"billToCompany._info.company_href\" AS \"billToCompany._info.company_href\", \"company_companies\".\"invoiceDeliveryMethod.id\" AS \"invoiceDeliveryMethod.id\", \"company_companies\".\"invoiceDeliveryMethod.name\" AS \"invoiceDeliveryMethod.name\", \"company_companies\".\"deletedFlag\" AS \"deletedFlag\", \"company_companies\".\"mobileGuid\" AS \"mobileGuid\", \"company_companies\".\"isVendorFlag\" AS \"isVendorFlag\", \"company_companies\".\"types[0].id\" AS \"types[0].id\", \"company_companies\".\"types[0].name\" AS \"types[0].name\", \"company_companies\".\"types[0]._info.type_href\" AS \"types[0]._info.type_href\", \"company_companies\".\"site.id\" AS \"site.id\", \"company_companies\".\"site.name\" AS \"site.name\", \"company_companies\".\"site._info.site_href\" AS \"site._info.site_href\", \"company_companies\".\"_info.lastUpdated\" AS \"_info.lastUpdated\", \"company_companies\".\"_info.updatedBy\" AS \"_info.updatedBy\", \"company_companies\".\"_info.dateEntered\" AS \"_info.dateEntered\", \"company_companies\".\"_info.enteredBy\" AS \"_info.enteredBy\", \"company_companies\".\"_info.contacts_href\" AS \"_info.contacts_href\", \"company_companies\".\"_info.agreements_href\" AS \"_info.agreements_href\", \"company_companies\".\"_info.tickets_href\" AS \"_info.tickets_href\", \"company_companies\".\"_info.opportunities_href\" AS \"_info.opportunities_href\", \"company_companies\".\"_info.activities_href\" AS \"_info.activities_href\", \"company_companies\".\"_info.projects_href\" AS \"_info.projects_href\", \"company_companies\".\"_info.configurations_href\" AS \"_info.configurations_href\", \"company_companies\".\"_info.orders_href\" AS \"_info.orders_href\", \"company_companies\".\"_info.documents_href\" AS \"_info.documents_href\", \"company_companies\".\"_info.sites_href\" AS \"_info.sites_href\", \"company_companies\".\"_info.teams_href\" AS \"_info.teams_href\", \"company_companies\".\"_info.reports_href\" AS \"_info.reports_href\", \"company_companies\".\"_info.notes_href\" AS \"_info.notes_href\", \"company_companies\".\"addressLine1\" AS \"addressLine1\", \"company_companies\".\"addressLine2\" AS \"addressLine2\", \"company_companies\".\"city\" AS \"city\", \"company_companies\".\"state\" AS \"state\", \"company_companies\".\"zip\" AS \"zip\", \"company_companies\".\"faxNumber\" AS \"faxNumber\", \"company_companies\".\"accountNumber\" AS \"accountNumber\", \"company_companies\".\"numberOfEmployees\" AS \"numberOfEmployees\", \"company_companies\".\"leadSource\" AS \"leadSource\", \"company_companies\".\"billingContact.id\" AS \"billingContact.id\", \"company_companies\".\"billingContact.name\" AS \"billingContact.name\", \"company_companies\".\"billingContact._info.contact_href\" AS \"billingContact._info.contact_href\", \"company_companies\".\"invoiceToEmailAddress\" AS \"invoiceToEmailAddress\", \"company_companies\".\"billingSite.id\" AS \"billingSite.id\", \"company_companies\".\"billingSite.name\" AS \"billingSite.name\", \"company_companies\".\"billingSite._info.site_href\" AS \"billingSite._info.site_href\" FROM \"swdefdgfb_A23JNM\".\"company_companies\" AS \"company_companies\") temp_table group by  \"identifier\", \"identifier\", \"name\", \"identifier\", \"name\" ORDER BY \"identifier\" ASC NULLS FIRST",
            "sheet_col": [
                " \"identifier\""
            ],
            "sheet_row": [
                " \"name\""
            ],
            "col_data": [
                {
                    "column": "identifier",
                    "orginal_column": "identifier",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                }
            ],
            "row_data": [
                {
                    "column": "name",
                    "orginal_column": "name",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                }
            ],
            "sheet_query_data": {
                "columns_data": [
                    {
                        "column": "identifier",
                        "data": [
                            "BigDesignInc"
                        ]
                    }
                ],
                "rows_data": [
                    {
                        "column": "name",
                        "data": [
                            "Big Design Inc."
                        ]
                    }
                ]
            }
        },
        {
            "sheet_id": 16908,
            "sheet_name": "Sheet 6(test_sharing_IHWZHT)_M2CJ6K",
            "chart_id": 10,
            "chart_type": "DONUT",
            "hierarchy_id": 2521,
            "sheet_tag_name": "<p>Sheet 6(test_sharing_IHWZHT)_M2CJ6K</p>",
            "sheet_data": {
                "drillDownHierarchy": [],
                "isDrillDownData": false,
                "heirarchyColumnData": [],
                "selectedSortColumnData": null,
                "columns": [
                    {
                        "column": "name",
                        "data_type": "string",
                        "table_name": "company_companies"
                    }
                ],
                "columns_data": [
                    [
                        "name",
                        "string",
                        "",
                        ""
                    ]
                ],
                "rows": [
                    {
                        "column": "invoiceDeliveryMethod.id",
                        "data_type": "int64",
                        "type": "sum"
                    }
                ],
                "rows_data": [
                    [
                        "invoiceDeliveryMethod.id",
                        "aggregate",
                        "sum",
                        ""
                    ]
                ],
                "pivotMeasure": [],
                "pivotMeasure_Data": [],
                "pivotMeasureValuesData": [],
                "pivotTransformedData": [],
                "col": [
                    {
                        "column": "name",
                        "result_data": []
                    }
                ],
                "row": [
                    {
                        "col": "sum(invoiceDeliveryMethod.id)",
                        "result_data": []
                    }
                ],
                "results": {
                    "tableData": [],
                    "tableColumns": [],
                    "banding": false,
                    "items_per_page": 10,
                    "total_items": 25,
                    "barYaxis": [],
                    "barXaxis": [],
                    "pieYaxis": [],
                    "pieXaxis": [],
                    "lineYaxis": [],
                    "lineXaxis": [],
                    "areaYaxis": [],
                    "areaXaxis": [],
                    "sidebysideBarYaxis": [],
                    "sidebysideBarXaxis": [],
                    "stokedBarYaxis": [],
                    "stokedBarXaxis": [],
                    "barLineYaxis": [],
                    "barLineXaxis": [],
                    "hStockedYaxis": [],
                    "hStockedXaxis": [],
                    "hgroupedYaxis": [],
                    "hgroupedXaxis": [],
                    "multiLineYaxis": [],
                    "multiLineXaxis": [],
                    "donutYaxis": [
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        2,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1
                    ],
                    "donutXaxis": [
                        "Big Design Inc.",
                        "Black Rooster Inc.",
                        "Blue Light Co.",
                        "BlueWeb Company",
                        "ConnectWise",
                        "Crazy Commerce Co.",
                        "DigitalTorch Inc.",
                        "Endsight",
                        "Future Message Co.",
                        "Green Torch Inc.",
                        "Green Vision Co.",
                        "High Design Co.",
                        "IndigoStrawberry Co.",
                        "InteractiveGoldfish Inc.",
                        "Key Pool Co.",
                        "MagicRooster L.L.C.",
                        "Microsoft",
                        "PinkNetworks L.L.C.",
                        "SolidCommerce Inc.",
                        "ThirstyDesign L.L.C.",
                        "Thompson Lisa",
                        "VioletPixel L.L.C.",
                        "Wild Eagle Inc.",
                        "Yellow Systems L.L.C.",
                        "Your Company"
                    ],
                    "decimalplaces": 2,
                    "kpiPrefix": "",
                    "kpiSuffix": "",
                    "kpiDecimalUnit": "none",
                    "kpiDecimalPlaces": 2
                },
                "isApexChart": false,
                "isEChart": true,
                "savedChartOptions": {
                    "backgroundColor": "#fff",
                    "color": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "tooltip": {
                        "trigger": "item"
                    },
                    "legend": {
                        "bottom": "0%",
                        "left": "center",
                        "orient": "horizontal",
                        "right": null,
                        "top": null,
                        "type": "scroll",
                        "show": true
                    },
                    "label": {
                        "show": true,
                        "formatter": "{b}: {d}%"
                    },
                    "series": [
                        {
                            "type": "pie",
                            "radius": [
                                "50%",
                                "70%"
                            ],
                            "data": [],
                            "avoidLabelOverlap": true,
                            "emphasis": {
                                "itemStyle": {
                                    "shadowBlur": 10,
                                    "shadowOffsetX": 0,
                                    "shadowColor": "rgba(0, 0, 0, 0.5)"
                                }
                            },
                            "label": {
                                "show": true,
                                "fontWeight": 400
                            }
                        }
                    ]
                },
                "customizeOptions": {
                    "isZoom": false,
                    "xGridColor": "#2392c1",
                    "xGridSwitch": false,
                    "xLabelSwitch": true,
                    "xLabelColor": "#2392c1",
                    "yLabelSwitch": true,
                    "yGridColor": "#2392c1",
                    "yGridSwitch": false,
                    "yLabelColor": "#2392c1",
                    "xLabelFontFamily": "sans-serif",
                    "xLabelFontSize": 12,
                    "xlabelFontWeight": 400,
                    "labelAlignment": "left",
                    "backgroundColor": "#fff",
                    "color": "#2392c1",
                    "selectedColorScheme": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "ylabelFontWeight": 400,
                    "isBold": false,
                    "isTableHeaderBold": false,
                    "isTableDataBold": false,
                    "isYlabelBold": false,
                    "isXlabelBold": false,
                    "yLabelFontFamily": "sans-serif",
                    "yLabelFontSize": 12,
                    "bandingSwitch": false,
                    "backgroundColorSwitch": false,
                    "chartColorSwitch": false,
                    "barColorSwitch": false,
                    "lineColorSwitch": false,
                    "gridLineColorSwitch": false,
                    "xLabelColorSwitch": false,
                    "xGridLineColorSwitch": false,
                    "yLabelColorSwitch": false,
                    "yGridLineColorSwitch": false,
                    "bandingColorSwitch": false,
                    "kpiColorSwitch": false,
                    "funnelColorSwitch": false,
                    "kpiColor": "#000000",
                    "barColor": "#4382f7",
                    "lineColor": "#38ff98",
                    "GridColor": "#089ffc",
                    "legendSwitch": true,
                    "dataLabels": true,
                    "label": true,
                    "donutSize": 50,
                    "isDistributed": true,
                    "kpiFontSize": "3",
                    "minValueGuage": 0,
                    "maxValueGuage": 100,
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "legendsAllignment": "bottom",
                    "displayUnits": "none",
                    "suffix": "",
                    "prefix": "",
                    "dataLabelsFontFamily": "sans-serif",
                    "dataLabelsFontSize": "12px",
                    "dataLabelsFontPosition": "top",
                    "measureAlignment": "center",
                    "dimensionAlignment": "center",
                    "tableDataFontFamily": "sans-serif",
                    "tableDataFontSize": "12px",
                    "tableDataFontWeight": 400,
                    "tableDataFontStyle": "normal",
                    "tableDataFontDecoration": "none",
                    "tableDataFontColor": "#000000",
                    "tableDataFontAlignment": "left",
                    "headerFontFamily": "'Arial', sans-serif",
                    "headerFontSize": "16px",
                    "headerFontWeight": 700,
                    "headerFontStyle": "normal",
                    "headerFontDecoration": "none",
                    "headerFontColor": "#000000",
                    "headerFontAlignment": "left",
                    "dimensionColor": "#2392c1",
                    "measureColor": "#2392c1",
                    "dataLabelsColor": "#2392c1",
                    "sortType": 0,
                    "rightLegend": null,
                    "bottomLegend": "0%",
                    "legendOrient": "horizontal",
                    "leftLegend": "center",
                    "topLegend": null,
                    "sortColumn": "select",
                    "locationDrillDownSwitch": false,
                    "isLocationField": false,
                    "KPIDecimalPlaces": 2,
                    "KPIDisplayUnits": "none",
                    "KPIPrefix": "",
                    "KPISuffix": "",
                    "pivotRowTotals": true,
                    "pivotColumnTotals": true,
                    "bandingOddColor": "#f5f7fa",
                    "bandingEvenColor": "#ffffff"
                },
                "numberFormat": {
                    "decimalPlaces": 2,
                    "displayUnits": "none",
                    "prefix": "",
                    "suffix": ""
                }
            },
            "queryset_id": 3729,
            "created_by": 15,
            "sheet_filter_ids": [],
            "sheet_filter_quereyset_ids": "17079",
            "datasource_queryset_id": null,
            "filters_data": [],
            "custom_query": "select  \"name\" AS \"name\" , sum(\"invoiceDeliveryMethod.id\") AS \"sum(invoiceDeliveryMethod.id)\" from (SELECT \"company_companies\".\"id\" AS \"id\", \"company_companies\".\"identifier\" AS \"identifier\", \"company_companies\".\"name\" AS \"name\", \"company_companies\".\"status.id\" AS \"status.id\", \"company_companies\".\"status.name\" AS \"status.name\", \"company_companies\".\"status._info.status_href\" AS \"status._info.status_href\", \"company_companies\".\"country.id\" AS \"country.id\", \"company_companies\".\"country.name\" AS \"country.name\", \"company_companies\".\"country._info.country_href\" AS \"country._info.country_href\", \"company_companies\".\"phoneNumber\" AS \"phoneNumber\", \"company_companies\".\"website\" AS \"website\", \"company_companies\".\"territory.id\" AS \"territory.id\", \"company_companies\".\"territory.name\" AS \"territory.name\", \"company_companies\".\"territory._info.location_href\" AS \"territory._info.location_href\", \"company_companies\".\"market.id\" AS \"market.id\", \"company_companies\".\"market.name\" AS \"market.name\", \"company_companies\".\"market._info.Market_href\" AS \"market._info.Market_href\", \"company_companies\".\"defaultContact.id\" AS \"defaultContact.id\", \"company_companies\".\"defaultContact.name\" AS \"defaultContact.name\", \"company_companies\".\"defaultContact._info.contact_href\" AS \"defaultContact._info.contact_href\", \"company_companies\".\"dateAcquired\" AS \"dateAcquired\", \"company_companies\".\"annualRevenue\" AS \"annualRevenue\", \"company_companies\".\"timeZoneSetup.id\" AS \"timeZoneSetup.id\", \"company_companies\".\"timeZoneSetup.name\" AS \"timeZoneSetup.name\", \"company_companies\".\"timeZoneSetup._info.timeZoneSetup_href\" AS \"timeZoneSetup._info.timeZoneSetup_href\", \"company_companies\".\"leadFlag\" AS \"leadFlag\", \"company_companies\".\"unsubscribeFlag\" AS \"unsubscribeFlag\", \"company_companies\".\"taxCode.id\" AS \"taxCode.id\", \"company_companies\".\"taxCode.name\" AS \"taxCode.name\", \"company_companies\".\"taxCode._info.taxCode_href\" AS \"taxCode._info.taxCode_href\", \"company_companies\".\"billingTerms.id\" AS \"billingTerms.id\", \"company_companies\".\"billingTerms.name\" AS \"billingTerms.name\", \"company_companies\".\"billToCompany.id\" AS \"billToCompany.id\", \"company_companies\".\"billToCompany.identifier\" AS \"billToCompany.identifier\", \"company_companies\".\"billToCompany.name\" AS \"billToCompany.name\", \"company_companies\".\"billToCompany._info.company_href\" AS \"billToCompany._info.company_href\", \"company_companies\".\"invoiceDeliveryMethod.id\" AS \"invoiceDeliveryMethod.id\", \"company_companies\".\"invoiceDeliveryMethod.name\" AS \"invoiceDeliveryMethod.name\", \"company_companies\".\"deletedFlag\" AS \"deletedFlag\", \"company_companies\".\"mobileGuid\" AS \"mobileGuid\", \"company_companies\".\"isVendorFlag\" AS \"isVendorFlag\", \"company_companies\".\"types[0].id\" AS \"types[0].id\", \"company_companies\".\"types[0].name\" AS \"types[0].name\", \"company_companies\".\"types[0]._info.type_href\" AS \"types[0]._info.type_href\", \"company_companies\".\"site.id\" AS \"site.id\", \"company_companies\".\"site.name\" AS \"site.name\", \"company_companies\".\"site._info.site_href\" AS \"site._info.site_href\", \"company_companies\".\"_info.lastUpdated\" AS \"_info.lastUpdated\", \"company_companies\".\"_info.updatedBy\" AS \"_info.updatedBy\", \"company_companies\".\"_info.dateEntered\" AS \"_info.dateEntered\", \"company_companies\".\"_info.enteredBy\" AS \"_info.enteredBy\", \"company_companies\".\"_info.contacts_href\" AS \"_info.contacts_href\", \"company_companies\".\"_info.agreements_href\" AS \"_info.agreements_href\", \"company_companies\".\"_info.tickets_href\" AS \"_info.tickets_href\", \"company_companies\".\"_info.opportunities_href\" AS \"_info.opportunities_href\", \"company_companies\".\"_info.activities_href\" AS \"_info.activities_href\", \"company_companies\".\"_info.projects_href\" AS \"_info.projects_href\", \"company_companies\".\"_info.configurations_href\" AS \"_info.configurations_href\", \"company_companies\".\"_info.orders_href\" AS \"_info.orders_href\", \"company_companies\".\"_info.documents_href\" AS \"_info.documents_href\", \"company_companies\".\"_info.sites_href\" AS \"_info.sites_href\", \"company_companies\".\"_info.teams_href\" AS \"_info.teams_href\", \"company_companies\".\"_info.reports_href\" AS \"_info.reports_href\", \"company_companies\".\"_info.notes_href\" AS \"_info.notes_href\", \"company_companies\".\"addressLine1\" AS \"addressLine1\", \"company_companies\".\"addressLine2\" AS \"addressLine2\", \"company_companies\".\"city\" AS \"city\", \"company_companies\".\"state\" AS \"state\", \"company_companies\".\"zip\" AS \"zip\", \"company_companies\".\"faxNumber\" AS \"faxNumber\", \"company_companies\".\"accountNumber\" AS \"accountNumber\", \"company_companies\".\"numberOfEmployees\" AS \"numberOfEmployees\", \"company_companies\".\"leadSource\" AS \"leadSource\", \"company_companies\".\"billingContact.id\" AS \"billingContact.id\", \"company_companies\".\"billingContact.name\" AS \"billingContact.name\", \"company_companies\".\"billingContact._info.contact_href\" AS \"billingContact._info.contact_href\", \"company_companies\".\"invoiceToEmailAddress\" AS \"invoiceToEmailAddress\", \"company_companies\".\"billingSite.id\" AS \"billingSite.id\", \"company_companies\".\"billingSite.name\" AS \"billingSite.name\", \"company_companies\".\"billingSite._info.site_href\" AS \"billingSite._info.site_href\" FROM \"swdefdgfb_A23JNM\".\"company_companies\" AS \"company_companies\") temp_table group by  \"name\", \"name\", \"name\" ORDER BY \"name\" ASC NULLS FIRST",
            "sheet_col": [
                " \"name\""
            ],
            "sheet_row": [
                "\"sum(invoiceDeliveryMethod.id)\""
            ],
            "col_data": [
                {
                    "column": "name",
                    "orginal_column": "name",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                }
            ],
            "row_data": [
                {
                    "column": "sum(invoiceDeliveryMethod.id)",
                    "orginal_column": "invoiceDeliveryMethod.id",
                    "data_type": "string",
                    "table_name": "invoiceDeliveryMethod.id",
                    "type": ""
                }
            ],
            "sheet_query_data": {
                "columns_data": [
                    {
                        "column": "name",
                        "data": [
                            "Big Design Inc."
                        ]
                    }
                ],
                "rows_data": [
                    {
                        "column": "sum(invoiceDeliveryMethod.id)",
                        "data": [
                            1
                        ]
                    }
                ]
            }
        },
        {
            "sheet_id": 16909,
            "sheet_name": "Sheet 7(test_sharing_IHWZHT)_J3NA7A",
            "chart_id": 27,
            "chart_type": "FUNNEL",
            "hierarchy_id": 2521,
            "sheet_tag_name": "<p>Sheet 7(test_sharing_IHWZHT)_J3NA7A</p>",
            "sheet_data": {
                "drillDownHierarchy": [],
                "isDrillDownData": false,
                "heirarchyColumnData": [],
                "selectedSortColumnData": null,
                "columns": [
                    {
                        "column": "city",
                        "data_type": "string",
                        "table_name": "company_companies"
                    }
                ],
                "columns_data": [
                    [
                        "city",
                        "string",
                        "",
                        ""
                    ]
                ],
                "rows": [
                    {
                        "column": "numberOfEmployees",
                        "data_type": "int64",
                        "type": ""
                    }
                ],
                "rows_data": [
                    [
                        "numberOfEmployees",
                        "int64",
                        "",
                        ""
                    ]
                ],
                "pivotMeasure": [],
                "pivotMeasure_Data": [],
                "pivotMeasureValuesData": [],
                "pivotTransformedData": [],
                "col": [
                    {
                        "column": "city",
                        "result_data": []
                    }
                ],
                "row": [
                    {
                        "col": "numberOfEmployees",
                        "result_data": []
                    }
                ],
                "results": {
                    "tableData": [],
                    "tableColumns": [],
                    "banding": false,
                    "items_per_page": 10,
                    "total_items": 19,
                    "barYaxis": [],
                    "barXaxis": [],
                    "pieYaxis": [],
                    "pieXaxis": [],
                    "lineYaxis": [],
                    "lineXaxis": [],
                    "areaYaxis": [],
                    "areaXaxis": [],
                    "sidebysideBarYaxis": [],
                    "sidebysideBarXaxis": [],
                    "stokedBarYaxis": [],
                    "stokedBarXaxis": [],
                    "barLineYaxis": [],
                    "barLineXaxis": [],
                    "hStockedYaxis": [],
                    "hStockedXaxis": [],
                    "hgroupedYaxis": [],
                    "hgroupedXaxis": [],
                    "multiLineYaxis": [],
                    "multiLineXaxis": [],
                    "donutYaxis": [],
                    "donutXaxis": [],
                    "decimalplaces": 2,
                    "kpiPrefix": "",
                    "kpiSuffix": "",
                    "kpiDecimalUnit": "none",
                    "kpiDecimalPlaces": 2
                },
                "isApexChart": false,
                "isEChart": true,
                "savedChartOptions": {
                    "color": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "tooltip": {
                        "trigger": "item"
                    },
                    "series": [
                        {
                            "name": "",
                            "type": "funnel",
                            "data": [],
                            "label": {
                                "show": true,
                                "position": "top",
                                "fontFamily": "sans-serif",
                                "fontSize": "12px",
                                "fontWeight": 400,
                                "color": "#2392c1"
                            }
                        }
                    ]
                },
                "customizeOptions": {
                    "isZoom": false,
                    "xGridColor": "#2392c1",
                    "xGridSwitch": false,
                    "xLabelSwitch": true,
                    "xLabelColor": "#2392c1",
                    "yLabelSwitch": true,
                    "yGridColor": "#2392c1",
                    "yGridSwitch": false,
                    "yLabelColor": "#2392c1",
                    "xLabelFontFamily": "sans-serif",
                    "xLabelFontSize": 12,
                    "xlabelFontWeight": 400,
                    "labelAlignment": "left",
                    "backgroundColor": "#fff",
                    "color": "#2392c1",
                    "selectedColorScheme": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "ylabelFontWeight": 400,
                    "isBold": false,
                    "isTableHeaderBold": false,
                    "isTableDataBold": false,
                    "isYlabelBold": false,
                    "isXlabelBold": false,
                    "yLabelFontFamily": "sans-serif",
                    "yLabelFontSize": 12,
                    "bandingSwitch": false,
                    "backgroundColorSwitch": false,
                    "chartColorSwitch": false,
                    "barColorSwitch": false,
                    "lineColorSwitch": false,
                    "gridLineColorSwitch": false,
                    "xLabelColorSwitch": false,
                    "xGridLineColorSwitch": false,
                    "yLabelColorSwitch": false,
                    "yGridLineColorSwitch": false,
                    "bandingColorSwitch": false,
                    "kpiColorSwitch": false,
                    "funnelColorSwitch": false,
                    "kpiColor": "#000000",
                    "barColor": "#4382f7",
                    "lineColor": "#38ff98",
                    "GridColor": "#089ffc",
                    "legendSwitch": true,
                    "dataLabels": true,
                    "label": true,
                    "donutSize": 50,
                    "isDistributed": true,
                    "kpiFontSize": "3",
                    "minValueGuage": 0,
                    "maxValueGuage": 100,
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "legendsAllignment": "bottom",
                    "displayUnits": "none",
                    "suffix": "",
                    "prefix": "",
                    "dataLabelsFontFamily": "sans-serif",
                    "dataLabelsFontSize": "12px",
                    "dataLabelsFontPosition": "top",
                    "measureAlignment": "center",
                    "dimensionAlignment": "center",
                    "tableDataFontFamily": "sans-serif",
                    "tableDataFontSize": "12px",
                    "tableDataFontWeight": 400,
                    "tableDataFontStyle": "normal",
                    "tableDataFontDecoration": "none",
                    "tableDataFontColor": "#000000",
                    "tableDataFontAlignment": "left",
                    "headerFontFamily": "'Arial', sans-serif",
                    "headerFontSize": "16px",
                    "headerFontWeight": 700,
                    "headerFontStyle": "normal",
                    "headerFontDecoration": "none",
                    "headerFontColor": "#000000",
                    "headerFontAlignment": "left",
                    "dimensionColor": "#2392c1",
                    "measureColor": "#2392c1",
                    "dataLabelsColor": "#2392c1",
                    "sortType": 0,
                    "rightLegend": null,
                    "bottomLegend": "0%",
                    "legendOrient": "horizontal",
                    "leftLegend": "center",
                    "topLegend": null,
                    "sortColumn": "select",
                    "locationDrillDownSwitch": false,
                    "isLocationField": true,
                    "KPIDecimalPlaces": 2,
                    "KPIDisplayUnits": "none",
                    "KPIPrefix": "",
                    "KPISuffix": "",
                    "pivotRowTotals": true,
                    "pivotColumnTotals": true,
                    "bandingOddColor": "#f5f7fa",
                    "bandingEvenColor": "#ffffff"
                },
                "numberFormat": {
                    "decimalPlaces": 2,
                    "displayUnits": "none",
                    "prefix": "",
                    "suffix": ""
                }
            },
            "queryset_id": 3729,
            "created_by": 15,
            "sheet_filter_ids": [],
            "sheet_filter_quereyset_ids": "17080",
            "datasource_queryset_id": null,
            "filters_data": [],
            "custom_query": "select  \"city\" AS \"city\" , \"numberOfEmployees\" AS  \"numberOfEmployees\" from (SELECT \"company_companies\".\"id\" AS \"id\", \"company_companies\".\"identifier\" AS \"identifier\", \"company_companies\".\"name\" AS \"name\", \"company_companies\".\"status.id\" AS \"status.id\", \"company_companies\".\"status.name\" AS \"status.name\", \"company_companies\".\"status._info.status_href\" AS \"status._info.status_href\", \"company_companies\".\"country.id\" AS \"country.id\", \"company_companies\".\"country.name\" AS \"country.name\", \"company_companies\".\"country._info.country_href\" AS \"country._info.country_href\", \"company_companies\".\"phoneNumber\" AS \"phoneNumber\", \"company_companies\".\"website\" AS \"website\", \"company_companies\".\"territory.id\" AS \"territory.id\", \"company_companies\".\"territory.name\" AS \"territory.name\", \"company_companies\".\"territory._info.location_href\" AS \"territory._info.location_href\", \"company_companies\".\"market.id\" AS \"market.id\", \"company_companies\".\"market.name\" AS \"market.name\", \"company_companies\".\"market._info.Market_href\" AS \"market._info.Market_href\", \"company_companies\".\"defaultContact.id\" AS \"defaultContact.id\", \"company_companies\".\"defaultContact.name\" AS \"defaultContact.name\", \"company_companies\".\"defaultContact._info.contact_href\" AS \"defaultContact._info.contact_href\", \"company_companies\".\"dateAcquired\" AS \"dateAcquired\", \"company_companies\".\"annualRevenue\" AS \"annualRevenue\", \"company_companies\".\"timeZoneSetup.id\" AS \"timeZoneSetup.id\", \"company_companies\".\"timeZoneSetup.name\" AS \"timeZoneSetup.name\", \"company_companies\".\"timeZoneSetup._info.timeZoneSetup_href\" AS \"timeZoneSetup._info.timeZoneSetup_href\", \"company_companies\".\"leadFlag\" AS \"leadFlag\", \"company_companies\".\"unsubscribeFlag\" AS \"unsubscribeFlag\", \"company_companies\".\"taxCode.id\" AS \"taxCode.id\", \"company_companies\".\"taxCode.name\" AS \"taxCode.name\", \"company_companies\".\"taxCode._info.taxCode_href\" AS \"taxCode._info.taxCode_href\", \"company_companies\".\"billingTerms.id\" AS \"billingTerms.id\", \"company_companies\".\"billingTerms.name\" AS \"billingTerms.name\", \"company_companies\".\"billToCompany.id\" AS \"billToCompany.id\", \"company_companies\".\"billToCompany.identifier\" AS \"billToCompany.identifier\", \"company_companies\".\"billToCompany.name\" AS \"billToCompany.name\", \"company_companies\".\"billToCompany._info.company_href\" AS \"billToCompany._info.company_href\", \"company_companies\".\"invoiceDeliveryMethod.id\" AS \"invoiceDeliveryMethod.id\", \"company_companies\".\"invoiceDeliveryMethod.name\" AS \"invoiceDeliveryMethod.name\", \"company_companies\".\"deletedFlag\" AS \"deletedFlag\", \"company_companies\".\"mobileGuid\" AS \"mobileGuid\", \"company_companies\".\"isVendorFlag\" AS \"isVendorFlag\", \"company_companies\".\"types[0].id\" AS \"types[0].id\", \"company_companies\".\"types[0].name\" AS \"types[0].name\", \"company_companies\".\"types[0]._info.type_href\" AS \"types[0]._info.type_href\", \"company_companies\".\"site.id\" AS \"site.id\", \"company_companies\".\"site.name\" AS \"site.name\", \"company_companies\".\"site._info.site_href\" AS \"site._info.site_href\", \"company_companies\".\"_info.lastUpdated\" AS \"_info.lastUpdated\", \"company_companies\".\"_info.updatedBy\" AS \"_info.updatedBy\", \"company_companies\".\"_info.dateEntered\" AS \"_info.dateEntered\", \"company_companies\".\"_info.enteredBy\" AS \"_info.enteredBy\", \"company_companies\".\"_info.contacts_href\" AS \"_info.contacts_href\", \"company_companies\".\"_info.agreements_href\" AS \"_info.agreements_href\", \"company_companies\".\"_info.tickets_href\" AS \"_info.tickets_href\", \"company_companies\".\"_info.opportunities_href\" AS \"_info.opportunities_href\", \"company_companies\".\"_info.activities_href\" AS \"_info.activities_href\", \"company_companies\".\"_info.projects_href\" AS \"_info.projects_href\", \"company_companies\".\"_info.configurations_href\" AS \"_info.configurations_href\", \"company_companies\".\"_info.orders_href\" AS \"_info.orders_href\", \"company_companies\".\"_info.documents_href\" AS \"_info.documents_href\", \"company_companies\".\"_info.sites_href\" AS \"_info.sites_href\", \"company_companies\".\"_info.teams_href\" AS \"_info.teams_href\", \"company_companies\".\"_info.reports_href\" AS \"_info.reports_href\", \"company_companies\".\"_info.notes_href\" AS \"_info.notes_href\", \"company_companies\".\"addressLine1\" AS \"addressLine1\", \"company_companies\".\"addressLine2\" AS \"addressLine2\", \"company_companies\".\"city\" AS \"city\", \"company_companies\".\"state\" AS \"state\", \"company_companies\".\"zip\" AS \"zip\", \"company_companies\".\"faxNumber\" AS \"faxNumber\", \"company_companies\".\"accountNumber\" AS \"accountNumber\", \"company_companies\".\"numberOfEmployees\" AS \"numberOfEmployees\", \"company_companies\".\"leadSource\" AS \"leadSource\", \"company_companies\".\"billingContact.id\" AS \"billingContact.id\", \"company_companies\".\"billingContact.name\" AS \"billingContact.name\", \"company_companies\".\"billingContact._info.contact_href\" AS \"billingContact._info.contact_href\", \"company_companies\".\"invoiceToEmailAddress\" AS \"invoiceToEmailAddress\", \"company_companies\".\"billingSite.id\" AS \"billingSite.id\", \"company_companies\".\"billingSite.name\" AS \"billingSite.name\", \"company_companies\".\"billingSite._info.site_href\" AS \"billingSite._info.site_href\" FROM \"swdefdgfb_A23JNM\".\"company_companies\" AS \"company_companies\") temp_table group by  \"city\", \"city\", \"numberOfEmployees\", \"city\", \"numberOfEmployees\" ORDER BY \"city\" ASC NULLS FIRST",
            "sheet_col": [
                " \"city\""
            ],
            "sheet_row": [
                " \"numberOfEmployees\""
            ],
            "col_data": [
                {
                    "column": "city",
                    "orginal_column": "city",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                }
            ],
            "row_data": [
                {
                    "column": "numberOfEmployees",
                    "orginal_column": "numberOfEmployees",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                }
            ],
            "sheet_query_data": {
                "columns_data": [
                    {
                        "column": "city",
                        "data": [
                            "Atlanta"
                        ]
                    }
                ],
                "rows_data": [
                    {
                        "column": "numberOfEmployees",
                        "data": [
                            50
                        ]
                    }
                ]
            }
        },
        {
            "sheet_id": 16910,
            "sheet_name": "Sheet 8(test_sharing_IHWZHT)_4R4BOW",
            "chart_id": 24,
            "chart_type": "pie",
            "hierarchy_id": 2521,
            "sheet_tag_name": "<p>Sheet 8(test_sharing_IHWZHT)_4R4BOW</p>",
            "sheet_data": {
                "drillDownHierarchy": [],
                "isDrillDownData": false,
                "heirarchyColumnData": [],
                "selectedSortColumnData": null,
                "columns": [
                    {
                        "column": "faxNumber",
                        "data_type": "string",
                        "table_name": "company_companies"
                    }
                ],
                "columns_data": [
                    [
                        "faxNumber",
                        "string",
                        "",
                        ""
                    ]
                ],
                "rows": [
                    {
                        "column": "annualRevenue",
                        "data_type": "int64",
                        "type": "sum"
                    }
                ],
                "rows_data": [
                    [
                        "annualRevenue",
                        "aggregate",
                        "sum",
                        ""
                    ]
                ],
                "pivotMeasure": [],
                "pivotMeasure_Data": [],
                "pivotMeasureValuesData": [],
                "pivotTransformedData": [],
                "col": [
                    {
                        "column": "faxNumber",
                        "result_data": []
                    }
                ],
                "row": [
                    {
                        "col": "sum(annualRevenue)",
                        "result_data": []
                    }
                ],
                "results": {
                    "tableData": [],
                    "tableColumns": [],
                    "banding": false,
                    "items_per_page": 10,
                    "total_items": 21,
                    "barYaxis": [],
                    "barXaxis": [],
                    "pieYaxis": [
                        72100000,
                        0,
                        0,
                        0,
                        143000000,
                        0,
                        0,
                        800000,
                        0,
                        15000000,
                        5000000,
                        5640000,
                        0,
                        0,
                        45000000,
                        3200000,
                        0,
                        0,
                        0,
                        0,
                        2000000
                    ],
                    "pieXaxis": [
                        "",
                        "5106559298",
                        "813-339-6729",
                        "813-345-3676",
                        "813-565-2450",
                        "813-852-1666",
                        "8131274453",
                        "8132256044",
                        "8132318352",
                        "8133008958",
                        "8133456758",
                        "8133959191",
                        "8134752276",
                        "8135297784",
                        "8136745478",
                        "8137604896",
                        "8138401674",
                        "8138496582",
                        "8139302738",
                        "8139842642",
                        "nan"
                    ],
                    "lineYaxis": [],
                    "lineXaxis": [],
                    "areaYaxis": [],
                    "areaXaxis": [],
                    "sidebysideBarYaxis": [],
                    "sidebysideBarXaxis": [],
                    "stokedBarYaxis": [],
                    "stokedBarXaxis": [],
                    "barLineYaxis": [],
                    "barLineXaxis": [],
                    "hStockedYaxis": [],
                    "hStockedXaxis": [],
                    "hgroupedYaxis": [],
                    "hgroupedXaxis": [],
                    "multiLineYaxis": [],
                    "multiLineXaxis": [],
                    "donutYaxis": [],
                    "donutXaxis": [],
                    "decimalplaces": 2,
                    "kpiPrefix": "",
                    "kpiSuffix": "",
                    "kpiDecimalUnit": "none",
                    "kpiDecimalPlaces": 2
                },
                "isApexChart": false,
                "isEChart": true,
                "savedChartOptions": {
                    "backgroundColor": "#fff",
                    "color": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "tooltip": {
                        "trigger": "item"
                    },
                    "legend": {
                        "bottom": "0%",
                        "left": "center",
                        "orient": "horizontal",
                        "right": null,
                        "top": null,
                        "type": "scroll",
                        "show": true
                    },
                    "label": {
                        "show": true,
                        "formatter": "{b}: {d}%"
                    },
                    "series": [
                        {
                            "type": "pie",
                            "radius": "50%",
                            "data": [],
                            "emphasis": {
                                "itemStyle": {
                                    "shadowBlur": 10,
                                    "shadowOffsetX": 0,
                                    "shadowColor": "rgba(0, 0, 0, 0.5)"
                                }
                            },
                            "label": {
                                "show": true,
                                "fontWeight": 400
                            }
                        }
                    ]
                },
                "customizeOptions": {
                    "isZoom": false,
                    "xGridColor": "#2392c1",
                    "xGridSwitch": false,
                    "xLabelSwitch": true,
                    "xLabelColor": "#2392c1",
                    "yLabelSwitch": true,
                    "yGridColor": "#2392c1",
                    "yGridSwitch": false,
                    "yLabelColor": "#2392c1",
                    "xLabelFontFamily": "sans-serif",
                    "xLabelFontSize": 12,
                    "xlabelFontWeight": 400,
                    "labelAlignment": "left",
                    "backgroundColor": "#fff",
                    "color": "#2392c1",
                    "selectedColorScheme": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "ylabelFontWeight": 400,
                    "isBold": false,
                    "isTableHeaderBold": false,
                    "isTableDataBold": false,
                    "isYlabelBold": false,
                    "isXlabelBold": false,
                    "yLabelFontFamily": "sans-serif",
                    "yLabelFontSize": 12,
                    "bandingSwitch": false,
                    "backgroundColorSwitch": false,
                    "chartColorSwitch": false,
                    "barColorSwitch": false,
                    "lineColorSwitch": false,
                    "gridLineColorSwitch": false,
                    "xLabelColorSwitch": false,
                    "xGridLineColorSwitch": false,
                    "yLabelColorSwitch": false,
                    "yGridLineColorSwitch": false,
                    "bandingColorSwitch": false,
                    "kpiColorSwitch": false,
                    "funnelColorSwitch": false,
                    "kpiColor": "#000000",
                    "barColor": "#4382f7",
                    "lineColor": "#38ff98",
                    "GridColor": "#089ffc",
                    "legendSwitch": true,
                    "dataLabels": true,
                    "label": true,
                    "donutSize": 50,
                    "isDistributed": true,
                    "kpiFontSize": "3",
                    "minValueGuage": 0,
                    "maxValueGuage": 100,
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "legendsAllignment": "bottom",
                    "displayUnits": "none",
                    "suffix": "",
                    "prefix": "",
                    "dataLabelsFontFamily": "sans-serif",
                    "dataLabelsFontSize": "12px",
                    "dataLabelsFontPosition": "top",
                    "measureAlignment": "center",
                    "dimensionAlignment": "center",
                    "tableDataFontFamily": "sans-serif",
                    "tableDataFontSize": "12px",
                    "tableDataFontWeight": 400,
                    "tableDataFontStyle": "normal",
                    "tableDataFontDecoration": "none",
                    "tableDataFontColor": "#000000",
                    "tableDataFontAlignment": "left",
                    "headerFontFamily": "'Arial', sans-serif",
                    "headerFontSize": "16px",
                    "headerFontWeight": 700,
                    "headerFontStyle": "normal",
                    "headerFontDecoration": "none",
                    "headerFontColor": "#000000",
                    "headerFontAlignment": "left",
                    "dimensionColor": "#2392c1",
                    "measureColor": "#2392c1",
                    "dataLabelsColor": "#2392c1",
                    "sortType": 0,
                    "rightLegend": null,
                    "bottomLegend": "0%",
                    "legendOrient": "horizontal",
                    "leftLegend": "center",
                    "topLegend": null,
                    "sortColumn": "select",
                    "locationDrillDownSwitch": false,
                    "isLocationField": false,
                    "KPIDecimalPlaces": 2,
                    "KPIDisplayUnits": "none",
                    "KPIPrefix": "",
                    "KPISuffix": "",
                    "pivotRowTotals": true,
                    "pivotColumnTotals": true,
                    "bandingOddColor": "#f5f7fa",
                    "bandingEvenColor": "#ffffff"
                },
                "numberFormat": {
                    "decimalPlaces": 2,
                    "displayUnits": "none",
                    "prefix": "",
                    "suffix": ""
                }
            },
            "queryset_id": 3729,
            "created_by": 15,
            "sheet_filter_ids": [],
            "sheet_filter_quereyset_ids": "17081",
            "datasource_queryset_id": null,
            "filters_data": [],
            "custom_query": "select  \"faxNumber\" AS \"faxNumber\" , sum(\"annualRevenue\") AS \"sum(annualRevenue)\" from (SELECT \"company_companies\".\"id\" AS \"id\", \"company_companies\".\"identifier\" AS \"identifier\", \"company_companies\".\"name\" AS \"name\", \"company_companies\".\"status.id\" AS \"status.id\", \"company_companies\".\"status.name\" AS \"status.name\", \"company_companies\".\"status._info.status_href\" AS \"status._info.status_href\", \"company_companies\".\"country.id\" AS \"country.id\", \"company_companies\".\"country.name\" AS \"country.name\", \"company_companies\".\"country._info.country_href\" AS \"country._info.country_href\", \"company_companies\".\"phoneNumber\" AS \"phoneNumber\", \"company_companies\".\"website\" AS \"website\", \"company_companies\".\"territory.id\" AS \"territory.id\", \"company_companies\".\"territory.name\" AS \"territory.name\", \"company_companies\".\"territory._info.location_href\" AS \"territory._info.location_href\", \"company_companies\".\"market.id\" AS \"market.id\", \"company_companies\".\"market.name\" AS \"market.name\", \"company_companies\".\"market._info.Market_href\" AS \"market._info.Market_href\", \"company_companies\".\"defaultContact.id\" AS \"defaultContact.id\", \"company_companies\".\"defaultContact.name\" AS \"defaultContact.name\", \"company_companies\".\"defaultContact._info.contact_href\" AS \"defaultContact._info.contact_href\", \"company_companies\".\"dateAcquired\" AS \"dateAcquired\", \"company_companies\".\"annualRevenue\" AS \"annualRevenue\", \"company_companies\".\"timeZoneSetup.id\" AS \"timeZoneSetup.id\", \"company_companies\".\"timeZoneSetup.name\" AS \"timeZoneSetup.name\", \"company_companies\".\"timeZoneSetup._info.timeZoneSetup_href\" AS \"timeZoneSetup._info.timeZoneSetup_href\", \"company_companies\".\"leadFlag\" AS \"leadFlag\", \"company_companies\".\"unsubscribeFlag\" AS \"unsubscribeFlag\", \"company_companies\".\"taxCode.id\" AS \"taxCode.id\", \"company_companies\".\"taxCode.name\" AS \"taxCode.name\", \"company_companies\".\"taxCode._info.taxCode_href\" AS \"taxCode._info.taxCode_href\", \"company_companies\".\"billingTerms.id\" AS \"billingTerms.id\", \"company_companies\".\"billingTerms.name\" AS \"billingTerms.name\", \"company_companies\".\"billToCompany.id\" AS \"billToCompany.id\", \"company_companies\".\"billToCompany.identifier\" AS \"billToCompany.identifier\", \"company_companies\".\"billToCompany.name\" AS \"billToCompany.name\", \"company_companies\".\"billToCompany._info.company_href\" AS \"billToCompany._info.company_href\", \"company_companies\".\"invoiceDeliveryMethod.id\" AS \"invoiceDeliveryMethod.id\", \"company_companies\".\"invoiceDeliveryMethod.name\" AS \"invoiceDeliveryMethod.name\", \"company_companies\".\"deletedFlag\" AS \"deletedFlag\", \"company_companies\".\"mobileGuid\" AS \"mobileGuid\", \"company_companies\".\"isVendorFlag\" AS \"isVendorFlag\", \"company_companies\".\"types[0].id\" AS \"types[0].id\", \"company_companies\".\"types[0].name\" AS \"types[0].name\", \"company_companies\".\"types[0]._info.type_href\" AS \"types[0]._info.type_href\", \"company_companies\".\"site.id\" AS \"site.id\", \"company_companies\".\"site.name\" AS \"site.name\", \"company_companies\".\"site._info.site_href\" AS \"site._info.site_href\", \"company_companies\".\"_info.lastUpdated\" AS \"_info.lastUpdated\", \"company_companies\".\"_info.updatedBy\" AS \"_info.updatedBy\", \"company_companies\".\"_info.dateEntered\" AS \"_info.dateEntered\", \"company_companies\".\"_info.enteredBy\" AS \"_info.enteredBy\", \"company_companies\".\"_info.contacts_href\" AS \"_info.contacts_href\", \"company_companies\".\"_info.agreements_href\" AS \"_info.agreements_href\", \"company_companies\".\"_info.tickets_href\" AS \"_info.tickets_href\", \"company_companies\".\"_info.opportunities_href\" AS \"_info.opportunities_href\", \"company_companies\".\"_info.activities_href\" AS \"_info.activities_href\", \"company_companies\".\"_info.projects_href\" AS \"_info.projects_href\", \"company_companies\".\"_info.configurations_href\" AS \"_info.configurations_href\", \"company_companies\".\"_info.orders_href\" AS \"_info.orders_href\", \"company_companies\".\"_info.documents_href\" AS \"_info.documents_href\", \"company_companies\".\"_info.sites_href\" AS \"_info.sites_href\", \"company_companies\".\"_info.teams_href\" AS \"_info.teams_href\", \"company_companies\".\"_info.reports_href\" AS \"_info.reports_href\", \"company_companies\".\"_info.notes_href\" AS \"_info.notes_href\", \"company_companies\".\"addressLine1\" AS \"addressLine1\", \"company_companies\".\"addressLine2\" AS \"addressLine2\", \"company_companies\".\"city\" AS \"city\", \"company_companies\".\"state\" AS \"state\", \"company_companies\".\"zip\" AS \"zip\", \"company_companies\".\"faxNumber\" AS \"faxNumber\", \"company_companies\".\"accountNumber\" AS \"accountNumber\", \"company_companies\".\"numberOfEmployees\" AS \"numberOfEmployees\", \"company_companies\".\"leadSource\" AS \"leadSource\", \"company_companies\".\"billingContact.id\" AS \"billingContact.id\", \"company_companies\".\"billingContact.name\" AS \"billingContact.name\", \"company_companies\".\"billingContact._info.contact_href\" AS \"billingContact._info.contact_href\", \"company_companies\".\"invoiceToEmailAddress\" AS \"invoiceToEmailAddress\", \"company_companies\".\"billingSite.id\" AS \"billingSite.id\", \"company_companies\".\"billingSite.name\" AS \"billingSite.name\", \"company_companies\".\"billingSite._info.site_href\" AS \"billingSite._info.site_href\" FROM \"swdefdgfb_A23JNM\".\"company_companies\" AS \"company_companies\") temp_table group by  \"faxNumber\", \"faxNumber\", \"faxNumber\" ORDER BY \"faxNumber\" ASC NULLS FIRST",
            "sheet_col": [
                " \"faxNumber\""
            ],
            "sheet_row": [
                "\"sum(annualRevenue)\""
            ],
            "col_data": [
                {
                    "column": "faxNumber",
                    "orginal_column": "faxNumber",
                    "data_type": "string",
                    "table_name": "unknown",
                    "type": ""
                }
            ],
            "row_data": [
                {
                    "column": "sum(annualRevenue)",
                    "orginal_column": "annualRevenue",
                    "data_type": "string",
                    "table_name": "annualRevenue",
                    "type": ""
                }
            ],
            "sheet_query_data": {
                "columns_data": [
                    {
                        "column": "faxNumber",
                        "data": [
                            ""
                        ]
                    }
                ],
                "rows_data": [
                    {
                        "column": "sum(annualRevenue)",
                        "data": [
                            72100000
                        ]
                    }
                ]
            }
        }
    ],
    "dashboard": {
        "dashboard_id": 615,
        "is_public": false,
        "is_sample": false,
        "dashboard_name": "smart_sharing_dashbaord(test_sharing_IHWZHT)_47UXVY",
        "dashboard_tag_name": "<p>smart_sharing_dashbaord(test_sharing_IHWZHT)_47UXVY</p>",
        "sheet_ids": [
            16903,
            16904,
            16905,
            16906,
            16907,
            16908,
            16909,
            16910
        ],
        "selected_sheet_ids": [
            16903,
            16904,
            16905,
            16906,
            16907,
            16908,
            16909,
            16910
        ],
        "sheet_names": [
            "Sheet 1(test_sharing_IHWZHT)_XYA7GE",
            "Sheet 2(test_sharing_IHWZHT)_5356LW",
            "Sheet 3(test_sharing_IHWZHT)_W47GRR",
            "Sheet 4(test_sharing_IHWZHT)_KKY4JT",
            "Sheet 5(test_sharing_IHWZHT)_X3FSUM",
            "Sheet 6(test_sharing_IHWZHT)_M2CJ6K",
            "Sheet 7(test_sharing_IHWZHT)_J3NA7A",
            "Sheet 8(test_sharing_IHWZHT)_4R4BOW"
        ],
        "grid_type": "FIXED",
        "height": "800",
        "width": "800",
        "hierarchy_id": [
            2521
        ],
        "queryset_id": [
            3729
        ],
        "dashboard_image": null,
        "dashboard_data": [
            {
                "id": "7de014c4-480a-4030-bd9e-d232c5417cf0",
                "x": 0,
                "y": 0,
                "rows": 1,
                "cols": 1,
                "data": {
                    "title": "Sheet 1",
                    "content": "Content of card New",
                    "sheetTagName": "Sheet 1"
                },
                "sheetType": "Table",
                "sheetId": 16903,
                "chartType": "Table",
                "databaseId": 2489,
                "qrySetId": 3666,
                "chartId": 1,
                "tableData": {
                    "headers": [
                        "name",
                        "sum(id)"
                    ],
                    "rows": [],
                    "banding": false,
                    "tableItemsPerPage": 10,
                    "tableTotalItems": 25,
                    "tablePage": 1
                },
                "selectedSheet": true,
                "chartData": [],
                "isEChart": true,
                "drillDownHierarchy": [],
                "column_Data": [
                    [
                        "name",
                        "string",
                        "",
                        ""
                    ]
                ],
                "row_Data": [
                    [
                        "id",
                        "aggregate",
                        "sum",
                        ""
                    ]
                ],
                "drillDownObject": [],
                "drillDownIndex": 0,
                "isDrillDownData": false,
                "numberFormat": {
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "displayUnits": "none",
                    "prefix": "",
                    "suffix": ""
                },
                "customizeOptions": {
                    "isZoom": false,
                    "xGridColor": "#2392c1",
                    "xGridSwitch": false,
                    "xLabelSwitch": true,
                    "xLabelColor": "#2392c1",
                    "yLabelSwitch": true,
                    "yGridColor": "#2392c1",
                    "yGridSwitch": false,
                    "yLabelColor": "#2392c1",
                    "xLabelFontFamily": "sans-serif",
                    "xLabelFontSize": 12,
                    "xlabelFontWeight": 400,
                    "labelAlignment": "left",
                    "backgroundColor": "#fcfcfc",
                    "color": "#2392c1",
                    "selectedColorScheme": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "ylabelFontWeight": 400,
                    "isBold": false,
                    "isTableHeaderBold": false,
                    "isTableDataBold": false,
                    "isYlabelBold": false,
                    "isXlabelBold": false,
                    "yLabelFontFamily": "sans-serif",
                    "yLabelFontSize": 12,
                    "bandingSwitch": false,
                    "backgroundColorSwitch": false,
                    "chartColorSwitch": false,
                    "barColorSwitch": false,
                    "lineColorSwitch": false,
                    "gridLineColorSwitch": false,
                    "xLabelColorSwitch": false,
                    "xGridLineColorSwitch": false,
                    "yLabelColorSwitch": false,
                    "yGridLineColorSwitch": false,
                    "bandingColorSwitch": false,
                    "kpiColorSwitch": false,
                    "funnelColorSwitch": false,
                    "kpiColor": "#000000",
                    "barColor": "#4382f7",
                    "lineColor": "#38ff98",
                    "GridColor": "#089ffc",
                    "legendSwitch": true,
                    "dataLabels": true,
                    "label": true,
                    "donutSize": 50,
                    "isDistributed": true,
                    "kpiFontSize": "3",
                    "minValueGuage": 0,
                    "maxValueGuage": 100,
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "legendsAllignment": "bottom",
                    "displayUnits": "none",
                    "suffix": "",
                    "prefix": "",
                    "dataLabelsFontFamily": "sans-serif",
                    "dataLabelsFontSize": "12px",
                    "dataLabelsFontPosition": "top",
                    "measureAlignment": "center",
                    "dimensionAlignment": "center",
                    "tableDataFontFamily": "sans-serif",
                    "tableDataFontSize": "12px",
                    "tableDataFontWeight": 400,
                    "tableDataFontStyle": "normal",
                    "tableDataFontDecoration": "none",
                    "tableDataFontColor": "#000000",
                    "tableDataFontAlignment": "left",
                    "headerFontFamily": "'Arial', sans-serif",
                    "headerFontSize": "16px",
                    "headerFontWeight": 700,
                    "headerFontStyle": "normal",
                    "headerFontDecoration": "none",
                    "headerFontColor": "#000000",
                    "headerFontAlignment": "left",
                    "dimensionColor": "#2392c1",
                    "measureColor": "#2392c1",
                    "dataLabelsColor": "#2392c1",
                    "sortType": 0,
                    "rightLegend": null,
                    "bottomLegend": "0%",
                    "legendOrient": "horizontal",
                    "leftLegend": "center",
                    "topLegend": null,
                    "sortColumn": "select",
                    "locationDrillDownSwitch": false,
                    "isLocationField": false,
                    "KPIDecimalPlaces": 2,
                    "KPIDisplayUnits": "none",
                    "KPIPrefix": "",
                    "KPISuffix": "",
                    "pivotRowTotals": true,
                    "pivotColumnTotals": true,
                    "bandingOddColor": "#f5f7fa",
                    "bandingEvenColor": "#ffffff"
                }
            },
            {
                "id": "cdbb78b8-a5b2-4931-85c5-e0a1a88853ee",
                "x": 1,
                "y": 0,
                "rows": 1,
                "cols": 1,
                "data": {
                    "title": "Sheet 2",
                    "content": "Content of card New",
                    "sheetTagName": "Sheet 2"
                },
                "sheetType": "Chart",
                "sheetId": 16904,
                "chartType": "bar",
                "databaseId": 2489,
                "qrySetId": 3666,
                "chartId": 6,
                "chartOptions": {
                    "backgroundColor": "#fff",
                    "legend": {
                        "orient": "vertical",
                        "left": "left"
                    },
                    "toolbox": {
                        "feature": {
                            "magicType": {
                                "show": true,
                                "type": [
                                    "line"
                                ]
                            },
                            "restore": {
                                "show": true
                            },
                            "saveAsImage": {
                                "show": true
                            }
                        }
                    },
                    "tooltip": {
                        "trigger": "axis"
                    },
                    "axisPointer": {
                        "type": "none"
                    },
                    "dataZoom": [
                        {
                            "show": false,
                            "type": "slider"
                        }
                    ],
                    "grid": {
                        "left": "3%",
                        "right": "4%",
                        "bottom": "13%",
                        "containLabel": true
                    },
                    "xAxis": {
                        "type": "category",
                        "data": [],
                        "nameLocation": "left",
                        "splitLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        },
                        "axisLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            }
                        },
                        "axisLabel": {
                            "show": true,
                            "fontFamily": "sans-serif",
                            "fontSize": 12,
                            "fontWeight": 400,
                            "color": "#2392c1",
                            "interval": 0,
                            "padding": [
                                10,
                                0,
                                10,
                                0
                            ],
                            "align": "center"
                        }
                    },
                    "toggleGridLines": true,
                    "yAxis": {
                        "type": "value",
                        "axisLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        },
                        "axisLabel": {
                            "show": true,
                            "fontFamily": "sans-serif",
                            "fontSize": 12,
                            "fontWeight": 400,
                            "color": "#2392c1",
                            "rotate": 0
                        },
                        "splitLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        }
                    },
                    "series": [
                        {
                            "itemStyle": {
                                "borderRadius": 5
                            },
                            "label": {
                                "show": true,
                                "position": "top",
                                "align": "center",
                                "fontFamily": "sans-serif",
                                "fontSize": "12px",
                                "fontWeight": 400,
                                "color": "#2392c1"
                            },
                            "type": "bar",
                            "barWidth": "80%",
                            "data": []
                        }
                    ],
                    "color": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "colorBy": "data"
                },
                "selectedSheet": true,
                "chartData": [],
                "isEChart": true,
                "echartOptions": {
                    "backgroundColor": "#fff",
                    "legend": {
                        "orient": "vertical",
                        "left": "left"
                    },
                    "toolbox": {
                        "feature": {
                            "magicType": {
                                "show": true,
                                "type": [
                                    "line"
                                ]
                            },
                            "restore": {
                                "show": true
                            },
                            "saveAsImage": {
                                "show": true
                            }
                        }
                    },
                    "tooltip": {
                        "trigger": "axis"
                    },
                    "axisPointer": {
                        "type": "none"
                    },
                    "dataZoom": [
                        {
                            "show": false,
                            "type": "slider"
                        }
                    ],
                    "grid": {
                        "left": "3%",
                        "right": "4%",
                        "bottom": "13%",
                        "containLabel": true
                    },
                    "xAxis": {
                        "type": "category",
                        "data": [],
                        "nameLocation": "left",
                        "splitLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        },
                        "axisLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            }
                        },
                        "axisLabel": {
                            "show": true,
                            "fontFamily": "sans-serif",
                            "fontSize": 12,
                            "fontWeight": 400,
                            "color": "#2392c1",
                            "interval": 0,
                            "padding": [
                                10,
                                0,
                                10,
                                0
                            ],
                            "align": "center"
                        }
                    },
                    "toggleGridLines": true,
                    "yAxis": {
                        "type": "value",
                        "axisLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        },
                        "axisLabel": {
                            "show": true,
                            "fontFamily": "sans-serif",
                            "fontSize": 12,
                            "fontWeight": 400,
                            "color": "#2392c1",
                            "rotate": 0
                        },
                        "splitLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        }
                    },
                    "series": [
                        {
                            "itemStyle": {
                                "borderRadius": 5
                            },
                            "label": {
                                "show": true,
                                "position": "top",
                                "align": "center",
                                "fontFamily": "sans-serif",
                                "fontSize": "12px",
                                "fontWeight": 400,
                                "color": "#2392c1"
                            },
                            "type": "bar",
                            "barWidth": "80%",
                            "data": []
                        }
                    ],
                    "color": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "colorBy": "data"
                },
                "drillDownHierarchy": [],
                "column_Data": [
                    [
                        "name",
                        "string",
                        "",
                        ""
                    ]
                ],
                "row_Data": [
                    [
                        "annualRevenue",
                        "aggregate",
                        "sum",
                        ""
                    ]
                ],
                "drillDownObject": [],
                "drillDownIndex": 0,
                "isDrillDownData": false,
                "numberFormat": {
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "displayUnits": "none",
                    "prefix": "",
                    "suffix": ""
                },
                "customizeOptions": {
                    "isZoom": false,
                    "xGridColor": "#2392c1",
                    "xGridSwitch": false,
                    "xLabelSwitch": true,
                    "xLabelColor": "#2392c1",
                    "yLabelSwitch": true,
                    "yGridColor": "#2392c1",
                    "yGridSwitch": false,
                    "yLabelColor": "#2392c1",
                    "xLabelFontFamily": "sans-serif",
                    "xLabelFontSize": 12,
                    "xlabelFontWeight": 400,
                    "labelAlignment": "left",
                    "backgroundColor": "#fff",
                    "color": "#2392c1",
                    "selectedColorScheme": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "ylabelFontWeight": 400,
                    "isBold": false,
                    "isTableHeaderBold": false,
                    "isTableDataBold": false,
                    "isYlabelBold": false,
                    "isXlabelBold": false,
                    "yLabelFontFamily": "sans-serif",
                    "yLabelFontSize": 12,
                    "bandingSwitch": false,
                    "backgroundColorSwitch": false,
                    "chartColorSwitch": false,
                    "barColorSwitch": false,
                    "lineColorSwitch": false,
                    "gridLineColorSwitch": false,
                    "xLabelColorSwitch": false,
                    "xGridLineColorSwitch": false,
                    "yLabelColorSwitch": false,
                    "yGridLineColorSwitch": false,
                    "bandingColorSwitch": false,
                    "kpiColorSwitch": false,
                    "funnelColorSwitch": false,
                    "kpiColor": "#000000",
                    "barColor": "#4382f7",
                    "lineColor": "#38ff98",
                    "GridColor": "#089ffc",
                    "legendSwitch": true,
                    "dataLabels": true,
                    "label": true,
                    "donutSize": 50,
                    "isDistributed": true,
                    "kpiFontSize": "3",
                    "minValueGuage": 0,
                    "maxValueGuage": 100,
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "legendsAllignment": "bottom",
                    "displayUnits": "none",
                    "suffix": "",
                    "prefix": "",
                    "dataLabelsFontFamily": "sans-serif",
                    "dataLabelsFontSize": "12px",
                    "dataLabelsFontPosition": "top",
                    "measureAlignment": "center",
                    "dimensionAlignment": "center",
                    "tableDataFontFamily": "sans-serif",
                    "tableDataFontSize": "12px",
                    "tableDataFontWeight": 400,
                    "tableDataFontStyle": "normal",
                    "tableDataFontDecoration": "none",
                    "tableDataFontColor": "#000000",
                    "tableDataFontAlignment": "left",
                    "headerFontFamily": "'Arial', sans-serif",
                    "headerFontSize": "16px",
                    "headerFontWeight": 700,
                    "headerFontStyle": "normal",
                    "headerFontDecoration": "none",
                    "headerFontColor": "#000000",
                    "headerFontAlignment": "left",
                    "dimensionColor": "#2392c1",
                    "measureColor": "#2392c1",
                    "dataLabelsColor": "#2392c1",
                    "sortType": 0,
                    "rightLegend": null,
                    "bottomLegend": "0%",
                    "legendOrient": "horizontal",
                    "leftLegend": "center",
                    "topLegend": null,
                    "sortColumn": "select",
                    "locationDrillDownSwitch": false,
                    "isLocationField": false,
                    "KPIDecimalPlaces": 2,
                    "KPIDisplayUnits": "none",
                    "KPIPrefix": "",
                    "KPISuffix": "",
                    "pivotRowTotals": true,
                    "pivotColumnTotals": true,
                    "bandingOddColor": "#f5f7fa",
                    "bandingEvenColor": "#ffffff"
                }
            },
            {
                "id": "7d0365f6-5dde-4d69-bf35-60d286f9cd9f",
                "x": 0,
                "y": 1,
                "rows": 1,
                "cols": 1,
                "data": {
                    "title": "Sheet 3",
                    "content": "Content of card New",
                    "sheetTagName": "Sheet 3"
                },
                "sheetType": "Chart",
                "sheetId": 16905,
                "chartType": "DUAL LINE",
                "databaseId": 2489,
                "qrySetId": 3666,
                "chartId": 8,
                "chartOptions": {
                    "backgroundColor": "#fff",
                    "color": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "legend": {
                        "orient": "vertical",
                        "left": "left"
                    },
                    "toolbox": {
                        "feature": {
                            "magicType": {
                                "show": true,
                                "type": [
                                    "bar"
                                ]
                            },
                            "restore": {
                                "show": true
                            },
                            "saveAsImage": {
                                "show": true
                            }
                        }
                    },
                    "tooltip": {
                        "trigger": "axis"
                    },
                    "axisPointer": {
                        "type": "none"
                    },
                    "dataZoom": [
                        {
                            "show": false,
                            "type": "slider"
                        }
                    ],
                    "grid": {
                        "left": "3%",
                        "right": "4%",
                        "bottom": "13%",
                        "containLabel": true
                    },
                    "xAxis": {
                        "type": "category",
                        "data": [],
                        "splitLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        },
                        "axisLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            }
                        },
                        "axisLabel": {
                            "show": true,
                            "fontFamily": "sans-serif",
                            "fontSize": 12,
                            "fontWeight": 400,
                            "color": "#2392c1",
                            "align": "center"
                        }
                    },
                    "toggleGridLines": true,
                    "yAxis": {
                        "type": "value",
                        "axisLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            }
                        },
                        "axisLabel": {
                            "show": true,
                            "fontFamily": "sans-serif",
                            "fontSize": 12,
                            "fontWeight": 400,
                            "color": "#2392c1"
                        },
                        "splitLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        }
                    },
                    "series": [
                        {
                            "name": "billingContact.id",
                            "data": [],
                            "type": "line",
                            "stack": "Total",
                            "label": {
                                "show": true,
                                "position": "right",
                                "fontFamily": "sans-serif",
                                "fontSize": "12px",
                                "fontWeight": 400,
                                "color": "#2392c1"
                            }
                        },
                        {
                            "name": "taxCode.id",
                            "data": [],
                            "type": "line",
                            "stack": "Total",
                            "label": {
                                "show": true,
                                "position": "right",
                                "fontFamily": "sans-serif",
                                "fontSize": "12px",
                                "fontWeight": 400,
                                "color": "#2392c1"
                            }
                        }
                    ]
                },
                "selectedSheet": true,
                "chartData": [],
                "isEChart": true,
                "echartOptions": {
                    "backgroundColor": "#fff",
                    "color": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "legend": {
                        "orient": "vertical",
                        "left": "left"
                    },
                    "toolbox": {
                        "feature": {
                            "magicType": {
                                "show": true,
                                "type": [
                                    "bar"
                                ]
                            },
                            "restore": {
                                "show": true
                            },
                            "saveAsImage": {
                                "show": true
                            }
                        }
                    },
                    "tooltip": {
                        "trigger": "axis"
                    },
                    "axisPointer": {
                        "type": "none"
                    },
                    "dataZoom": [
                        {
                            "show": false,
                            "type": "slider"
                        }
                    ],
                    "grid": {
                        "left": "3%",
                        "right": "4%",
                        "bottom": "13%",
                        "containLabel": true
                    },
                    "xAxis": {
                        "type": "category",
                        "data": [],
                        "splitLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        },
                        "axisLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            }
                        },
                        "axisLabel": {
                            "show": true,
                            "fontFamily": "sans-serif",
                            "fontSize": 12,
                            "fontWeight": 400,
                            "color": "#2392c1",
                            "align": "center"
                        }
                    },
                    "toggleGridLines": true,
                    "yAxis": {
                        "type": "value",
                        "axisLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            }
                        },
                        "axisLabel": {
                            "show": true,
                            "fontFamily": "sans-serif",
                            "fontSize": 12,
                            "fontWeight": 400,
                            "color": "#2392c1"
                        },
                        "splitLine": {
                            "lineStyle": {
                                "color": "#2392c1"
                            },
                            "show": false
                        }
                    },
                    "series": [
                        {
                            "name": "billingContact.id",
                            "data": [],
                            "type": "line",
                            "stack": "Total",
                            "label": {
                                "show": true,
                                "position": "right",
                                "fontFamily": "sans-serif",
                                "fontSize": "12px",
                                "fontWeight": 400,
                                "color": "#2392c1"
                            }
                        },
                        {
                            "name": "taxCode.id",
                            "data": [],
                            "type": "line",
                            "stack": "Total",
                            "label": {
                                "show": true,
                                "position": "right",
                                "fontFamily": "sans-serif",
                                "fontSize": "12px",
                                "fontWeight": 400,
                                "color": "#2392c1"
                            }
                        }
                    ]
                },
                "drillDownHierarchy": [],
                "column_Data": [
                    [
                        "name",
                        "string",
                        "",
                        ""
                    ]
                ],
                "row_Data": [
                    [
                        "billingContact.id",
                        "int64",
                        "",
                        ""
                    ],
                    [
                        "taxCode.id",
                        "int64",
                        "",
                        ""
                    ]
                ],
                "drillDownObject": [],
                "drillDownIndex": 0,
                "isDrillDownData": false,
                "numberFormat": {
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "displayUnits": "none",
                    "prefix": "",
                    "suffix": ""
                },
                "customizeOptions": {
                    "isZoom": false,
                    "xGridColor": "#2392c1",
                    "xGridSwitch": false,
                    "xLabelSwitch": true,
                    "xLabelColor": "#2392c1",
                    "yLabelSwitch": true,
                    "yGridColor": "#2392c1",
                    "yGridSwitch": false,
                    "yLabelColor": "#2392c1",
                    "xLabelFontFamily": "sans-serif",
                    "xLabelFontSize": 12,
                    "xlabelFontWeight": 400,
                    "labelAlignment": "left",
                    "backgroundColor": "#fff",
                    "color": "#2392c1",
                    "selectedColorScheme": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "ylabelFontWeight": 400,
                    "isBold": false,
                    "isTableHeaderBold": false,
                    "isTableDataBold": false,
                    "isYlabelBold": false,
                    "isXlabelBold": false,
                    "yLabelFontFamily": "sans-serif",
                    "yLabelFontSize": 12,
                    "bandingSwitch": false,
                    "backgroundColorSwitch": false,
                    "chartColorSwitch": false,
                    "barColorSwitch": false,
                    "lineColorSwitch": false,
                    "gridLineColorSwitch": false,
                    "xLabelColorSwitch": false,
                    "xGridLineColorSwitch": false,
                    "yLabelColorSwitch": false,
                    "yGridLineColorSwitch": false,
                    "bandingColorSwitch": false,
                    "kpiColorSwitch": false,
                    "funnelColorSwitch": false,
                    "kpiColor": "#000000",
                    "barColor": "#4382f7",
                    "lineColor": "#38ff98",
                    "GridColor": "#089ffc",
                    "legendSwitch": true,
                    "dataLabels": true,
                    "label": true,
                    "donutSize": 50,
                    "isDistributed": true,
                    "kpiFontSize": "3",
                    "minValueGuage": 0,
                    "maxValueGuage": 100,
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "legendsAllignment": "bottom",
                    "displayUnits": "none",
                    "suffix": "",
                    "prefix": "",
                    "dataLabelsFontFamily": "sans-serif",
                    "dataLabelsFontSize": "12px",
                    "dataLabelsFontPosition": "top",
                    "measureAlignment": "center",
                    "dimensionAlignment": "center",
                    "tableDataFontFamily": "sans-serif",
                    "tableDataFontSize": "12px",
                    "tableDataFontWeight": 400,
                    "tableDataFontStyle": "normal",
                    "tableDataFontDecoration": "none",
                    "tableDataFontColor": "#000000",
                    "tableDataFontAlignment": "left",
                    "headerFontFamily": "'Arial', sans-serif",
                    "headerFontSize": "16px",
                    "headerFontWeight": 700,
                    "headerFontStyle": "normal",
                    "headerFontDecoration": "none",
                    "headerFontColor": "#000000",
                    "headerFontAlignment": "left",
                    "dimensionColor": "#2392c1",
                    "measureColor": "#2392c1",
                    "dataLabelsColor": "#2392c1",
                    "sortType": 0,
                    "rightLegend": null,
                    "bottomLegend": "0%",
                    "legendOrient": "horizontal",
                    "leftLegend": "center",
                    "topLegend": null,
                    "sortColumn": "select",
                    "locationDrillDownSwitch": false,
                    "isLocationField": false,
                    "KPIDecimalPlaces": 2,
                    "KPIDisplayUnits": "none",
                    "KPIPrefix": "",
                    "KPISuffix": "",
                    "pivotRowTotals": true,
                    "pivotColumnTotals": true,
                    "bandingOddColor": "#f5f7fa",
                    "bandingEvenColor": "#ffffff"
                }
            },
            {
                "id": "471340eb-02c4-4194-825c-1eadb30e4c69",
                "x": 1,
                "y": 1,
                "rows": 1,
                "cols": 1,
                "data": {
                    "title": "Sheet 4",
                    "content": "Content of card New",
                    "sheetTagName": "Sheet 4"
                },
                "sheetType": "Chart",
                "sheetId": 16906,
                "chartType": "RADAR",
                "databaseId": 2489,
                "qrySetId": 3666,
                "chartId": 12,
                "chartOptions": {
                    "backgroundColor": "#fff",
                    "tooltip": {
                        "trigger": "item"
                    },
                    "legend": {
                        "bottom": "bottom",
                        "left": "center",
                        "orient": "horizontal"
                    },
                    "radar": {
                        "axisName": {
                            "color": "#2392c1"
                        },
                        "axisLabel": {
                            "color": "#2392c1"
                        },
                        "indicator": []
                    },
                    "color": "#2392c1",
                    "series": [
                        {
                            "type": "radar",
                            "data": []
                        }
                    ]
                },
                "selectedSheet": true,
                "chartData": [],
                "isEChart": true,
                "echartOptions": {
                    "backgroundColor": "#fff",
                    "tooltip": {
                        "trigger": "item"
                    },
                    "legend": {
                        "bottom": "bottom",
                        "left": "center",
                        "orient": "horizontal"
                    },
                    "radar": {
                        "axisName": {
                            "color": "#2392c1"
                        },
                        "axisLabel": {
                            "color": "#2392c1"
                        },
                        "indicator": []
                    },
                    "color": "#2392c1",
                    "series": [
                        {
                            "type": "radar",
                            "data": []
                        }
                    ]
                },
                "drillDownHierarchy": [],
                "column_Data": [
                    [
                        "name",
                        "string",
                        "",
                        ""
                    ],
                    [
                        "identifier",
                        "string",
                        "",
                        ""
                    ]
                ],
                "row_Data": [
                    [
                        "state",
                        "string",
                        "",
                        ""
                    ],
                    [
                        "city",
                        "string",
                        "",
                        ""
                    ],
                    [
                        "phoneNumber",
                        "string",
                        "",
                        ""
                    ],
                    [
                        "website",
                        "string",
                        "",
                        ""
                    ],
                    [
                        "country.name",
                        "string",
                        "",
                        ""
                    ]
                ],
                "drillDownObject": [],
                "drillDownIndex": 0,
                "isDrillDownData": false,
                "numberFormat": {
                    "decimalPlaces": 2,
                    "displayUnits": "none",
                    "prefix": "",
                    "suffix": ""
                },
                "customizeOptions": {
                    "isZoom": false,
                    "xGridColor": "#2392c1",
                    "xGridSwitch": false,
                    "xLabelSwitch": true,
                    "xLabelColor": "#2392c1",
                    "yLabelSwitch": true,
                    "yGridColor": "#2392c1",
                    "yGridSwitch": false,
                    "yLabelColor": "#2392c1",
                    "xLabelFontFamily": "sans-serif",
                    "xLabelFontSize": 12,
                    "xlabelFontWeight": 400,
                    "labelAlignment": "left",
                    "backgroundColor": "#fff",
                    "color": "#2392c1",
                    "selectedColorScheme": [
                        "#1d2e92",
                        "#088ed2",
                        "#007cb9",
                        "#36c2ce",
                        "#52c9f7"
                    ],
                    "ylabelFontWeight": 400,
                    "isBold": false,
                    "isTableHeaderBold": false,
                    "isTableDataBold": false,
                    "isYlabelBold": false,
                    "isXlabelBold": false,
                    "yLabelFontFamily": "sans-serif",
                    "yLabelFontSize": 12,
                    "bandingSwitch": false,
                    "backgroundColorSwitch": false,
                    "chartColorSwitch": false,
                    "barColorSwitch": false,
                    "lineColorSwitch": false,
                    "gridLineColorSwitch": false,
                    "xLabelColorSwitch": false,
                    "xGridLineColorSwitch": false,
                    "yLabelColorSwitch": false,
                    "yGridLineColorSwitch": false,
                    "bandingColorSwitch": false,
                    "kpiColorSwitch": false,
                    "funnelColorSwitch": false,
                    "kpiColor": "#000000",
                    "barColor": "#4382f7",
                    "lineColor": "#38ff98",
                    "GridColor": "#089ffc",
                    "legendSwitch": true,
                    "dataLabels": true,
                    "label": true,
                    "donutSize": 50,
                    "isDistributed": true,
                    "kpiFontSize": "3",
                    "minValueGuage": 0,
                    "maxValueGuage": 100,
                    "donutDecimalPlaces": 2,
                    "decimalPlaces": 2,
                    "legendsAllignment": "bottom",
                    "displayUnits": "none",
                    "suffix": "",
                    "prefix": "",
                    "dataLabelsFontFamily": "sans-serif",
                    "dataLabelsFontSize": "12px",
                    "dataLabelsFontPosition": "top",
                    "measureAlignment": "center",
                    "dimensionAlignment": "center",
                    "tableDataFontFamily": "sans-serif",
                    "tableDataFontSize": "12px",
                    "tableDataFontWeight": 400,
                    "tableDataFontStyle": "normal",
                    "tableDataFontDecoration": "none",
                    "tableDataFontColor": "#000000",
                    "tableDataFontAlignment": "left",
                    "headerFontFamily": "'Arial', sans-serif",
                    "headerFontSize": "16px",
                    "headerFontWeight": 700,
                    "headerFontStyle": "normal",
                    "headerFontDecoration": "none",
                    "headerFontColor": "#000000",
                    "headerFontAlignment": "left",
                    "dimensionColor": "#2392c1",
                    "measureColor": "#2392c1",
                    "dataLabelsColor": "#2392c1",
                    "sortType": 0,
                    "rightLegend": null,
                    "bottomLegend": "0%",
                    "legendOrient": "horizontal",
                    "leftLegend": "center",
                    "topLegend": null,
                    "sortColumn": "select",
                    "locationDrillDownSwitch": false,
                    "isLocationField": false,
                    "KPIDecimalPlaces": 2,
                    "KPIDisplayUnits": "none",
                    "KPIPrefix": "",
                    "KPISuffix": "",
                    "pivotRowTotals": true,
                    "pivotColumnTotals": true,
                    "bandingOddColor": "#f5f7fa",
                    "bandingEvenColor": "#ffffff"
                }
            }
        ],
        "role_ids": null,
        "user_ids": null,
        "tab_id": [],
        "tab_data": [
            {
                "name": "Tab Title_1",
                "dashboard": [
                    {
                        "id": "ebb68b40-4255-48cd-a65e-cbe340856c11",
                        "x": 0,
                        "y": 0,
                        "rows": 1,
                        "cols": 1,
                        "data": {
                            "title": "Sheet 5",
                            "content": "Content of card New",
                            "sheetTagName": "Sheet 5"
                        },
                        "sheetType": "Table",
                        "sheetId": 16907,
                        "chartType": "Table",
                        "databaseId": 2489,
                        "qrySetId": 3666,
                        "chartId": 1,
                        "tableData": {
                            "headers": [
                                "identifier",
                                "name"
                            ],
                            "rows": [],
                            "banding": false,
                            "tableItemsPerPage": 10,
                            "tableTotalItems": 25,
                            "tablePage": 1
                        },
                        "selectedSheet": true,
                        "chartData": [],
                        "isEChart": true,
                        "drillDownHierarchy": [],
                        "column_Data": [
                            [
                                "identifier",
                                "string",
                                "",
                                ""
                            ]
                        ],
                        "row_Data": [
                            [
                                "name",
                                "string",
                                "",
                                ""
                            ]
                        ],
                        "drillDownObject": [],
                        "drillDownIndex": 0,
                        "isDrillDownData": false,
                        "numberFormat": {
                            "decimalPlaces": 2,
                            "displayUnits": "none",
                            "prefix": "",
                            "suffix": ""
                        },
                        "customizeOptions": {
                            "isZoom": false,
                            "xGridColor": "#2392c1",
                            "xGridSwitch": false,
                            "xLabelSwitch": true,
                            "xLabelColor": "#2392c1",
                            "yLabelSwitch": true,
                            "yGridColor": "#2392c1",
                            "yGridSwitch": false,
                            "yLabelColor": "#2392c1",
                            "xLabelFontFamily": "sans-serif",
                            "xLabelFontSize": 12,
                            "xlabelFontWeight": 400,
                            "labelAlignment": "left",
                            "backgroundColor": "#fff",
                            "color": "#2392c1",
                            "selectedColorScheme": [
                                "#1d2e92",
                                "#088ed2",
                                "#007cb9",
                                "#36c2ce",
                                "#52c9f7"
                            ],
                            "ylabelFontWeight": 400,
                            "isBold": false,
                            "isTableHeaderBold": false,
                            "isTableDataBold": false,
                            "isYlabelBold": false,
                            "isXlabelBold": false,
                            "yLabelFontFamily": "sans-serif",
                            "yLabelFontSize": 12,
                            "bandingSwitch": false,
                            "backgroundColorSwitch": false,
                            "chartColorSwitch": false,
                            "barColorSwitch": false,
                            "lineColorSwitch": false,
                            "gridLineColorSwitch": false,
                            "xLabelColorSwitch": false,
                            "xGridLineColorSwitch": false,
                            "yLabelColorSwitch": false,
                            "yGridLineColorSwitch": false,
                            "bandingColorSwitch": false,
                            "kpiColorSwitch": false,
                            "funnelColorSwitch": false,
                            "kpiColor": "#000000",
                            "barColor": "#4382f7",
                            "lineColor": "#38ff98",
                            "GridColor": "#089ffc",
                            "legendSwitch": true,
                            "dataLabels": true,
                            "label": true,
                            "donutSize": 50,
                            "isDistributed": true,
                            "kpiFontSize": "3",
                            "minValueGuage": 0,
                            "maxValueGuage": 100,
                            "donutDecimalPlaces": 2,
                            "decimalPlaces": 2,
                            "legendsAllignment": "bottom",
                            "displayUnits": "none",
                            "suffix": "",
                            "prefix": "",
                            "dataLabelsFontFamily": "sans-serif",
                            "dataLabelsFontSize": "12px",
                            "dataLabelsFontPosition": "top",
                            "measureAlignment": "center",
                            "dimensionAlignment": "center",
                            "tableDataFontFamily": "sans-serif",
                            "tableDataFontSize": "12px",
                            "tableDataFontWeight": 400,
                            "tableDataFontStyle": "normal",
                            "tableDataFontDecoration": "none",
                            "tableDataFontColor": "#000000",
                            "tableDataFontAlignment": "left",
                            "headerFontFamily": "'Arial', sans-serif",
                            "headerFontSize": "16px",
                            "headerFontWeight": 700,
                            "headerFontStyle": "normal",
                            "headerFontDecoration": "none",
                            "headerFontColor": "#000000",
                            "headerFontAlignment": "left",
                            "dimensionColor": "#2392c1",
                            "measureColor": "#2392c1",
                            "dataLabelsColor": "#2392c1",
                            "sortType": 0,
                            "rightLegend": null,
                            "bottomLegend": "0%",
                            "legendOrient": "horizontal",
                            "leftLegend": "center",
                            "topLegend": null,
                            "sortColumn": "select",
                            "locationDrillDownSwitch": false,
                            "isLocationField": false,
                            "KPIDecimalPlaces": 2,
                            "KPIDisplayUnits": "none",
                            "KPIPrefix": "",
                            "KPISuffix": "",
                            "pivotRowTotals": true,
                            "pivotColumnTotals": true,
                            "bandingOddColor": "#f5f7fa",
                            "bandingEvenColor": "#ffffff"
                        },
                        "pivotData": {
                            "pivotMeasureData": [],
                            "pivotRowData": [
                                {
                                    "col": "name",
                                    "result_data": []
                                }
                            ],
                            "pivotColData": [
                                {
                                    "column": "identifier",
                                    "result_data": []
                                }
                            ]
                        }
                    },
                    {
                        "id": "eff4609d-667c-47dc-bbd5-4bfd63f4f771",
                        "x": 1,
                        "y": 0,
                        "rows": 1,
                        "cols": 1,
                        "data": {
                            "title": "Sheet 6",
                            "content": "Content of card New",
                            "sheetTagName": "Sheet 6"
                        },
                        "sheetType": "Chart",
                        "sheetId": 16908,
                        "chartType": "DONUT",
                        "databaseId": 2489,
                        "qrySetId": 3666,
                        "chartId": 10,
                        "chartOptions": {
                            "backgroundColor": "#fff",
                            "color": [
                                "#1d2e92",
                                "#088ed2",
                                "#007cb9",
                                "#36c2ce",
                                "#52c9f7"
                            ],
                            "tooltip": {
                                "trigger": "item"
                            },
                            "legend": {
                                "bottom": "0%",
                                "left": "center",
                                "orient": "horizontal",
                                "right": null,
                                "top": null,
                                "type": "scroll",
                                "show": true
                            },
                            "label": {
                                "show": true,
                                "formatter": "{b}: {d}%"
                            },
                            "series": [
                                {
                                    "type": "pie",
                                    "radius": [
                                        "50%",
                                        "70%"
                                    ],
                                    "data": [],
                                    "avoidLabelOverlap": true,
                                    "emphasis": {
                                        "itemStyle": {
                                            "shadowBlur": 10,
                                            "shadowOffsetX": 0,
                                            "shadowColor": "rgba(0, 0, 0, 0.5)"
                                        }
                                    },
                                    "label": {
                                        "show": true,
                                        "fontWeight": 400
                                    }
                                }
                            ]
                        },
                        "selectedSheet": true,
                        "chartData": [],
                        "isEChart": true,
                        "echartOptions": {
                            "backgroundColor": "#fff",
                            "color": [
                                "#1d2e92",
                                "#088ed2",
                                "#007cb9",
                                "#36c2ce",
                                "#52c9f7"
                            ],
                            "tooltip": {
                                "trigger": "item"
                            },
                            "legend": {
                                "bottom": "0%",
                                "left": "center",
                                "orient": "horizontal",
                                "right": null,
                                "top": null,
                                "type": "scroll",
                                "show": true
                            },
                            "label": {
                                "show": true,
                                "formatter": "{b}: {d}%"
                            },
                            "series": [
                                {
                                    "type": "pie",
                                    "radius": [
                                        "50%",
                                        "70%"
                                    ],
                                    "data": [],
                                    "avoidLabelOverlap": true,
                                    "emphasis": {
                                        "itemStyle": {
                                            "shadowBlur": 10,
                                            "shadowOffsetX": 0,
                                            "shadowColor": "rgba(0, 0, 0, 0.5)"
                                        }
                                    },
                                    "label": {
                                        "show": true,
                                        "fontWeight": 400
                                    }
                                }
                            ]
                        },
                        "drillDownHierarchy": [],
                        "column_Data": [
                            [
                                "name",
                                "string",
                                "",
                                ""
                            ]
                        ],
                        "row_Data": [
                            [
                                "invoiceDeliveryMethod.id",
                                "aggregate",
                                "sum",
                                ""
                            ]
                        ],
                        "drillDownObject": [],
                        "drillDownIndex": 0,
                        "isDrillDownData": false,
                        "numberFormat": {
                            "donutDecimalPlaces": 2,
                            "decimalPlaces": 2,
                            "displayUnits": "none",
                            "prefix": "",
                            "suffix": ""
                        },
                        "customizeOptions": {
                            "isZoom": false,
                            "xGridColor": "#2392c1",
                            "xGridSwitch": false,
                            "xLabelSwitch": true,
                            "xLabelColor": "#2392c1",
                            "yLabelSwitch": true,
                            "yGridColor": "#2392c1",
                            "yGridSwitch": false,
                            "yLabelColor": "#2392c1",
                            "xLabelFontFamily": "sans-serif",
                            "xLabelFontSize": 12,
                            "xlabelFontWeight": 400,
                            "labelAlignment": "left",
                            "backgroundColor": "#fff",
                            "color": "#2392c1",
                            "selectedColorScheme": [
                                "#1d2e92",
                                "#088ed2",
                                "#007cb9",
                                "#36c2ce",
                                "#52c9f7"
                            ],
                            "ylabelFontWeight": 400,
                            "isBold": false,
                            "isTableHeaderBold": false,
                            "isTableDataBold": false,
                            "isYlabelBold": false,
                            "isXlabelBold": false,
                            "yLabelFontFamily": "sans-serif",
                            "yLabelFontSize": 12,
                            "bandingSwitch": false,
                            "backgroundColorSwitch": false,
                            "chartColorSwitch": false,
                            "barColorSwitch": false,
                            "lineColorSwitch": false,
                            "gridLineColorSwitch": false,
                            "xLabelColorSwitch": false,
                            "xGridLineColorSwitch": false,
                            "yLabelColorSwitch": false,
                            "yGridLineColorSwitch": false,
                            "bandingColorSwitch": false,
                            "kpiColorSwitch": false,
                            "funnelColorSwitch": false,
                            "kpiColor": "#000000",
                            "barColor": "#4382f7",
                            "lineColor": "#38ff98",
                            "GridColor": "#089ffc",
                            "legendSwitch": true,
                            "dataLabels": true,
                            "label": true,
                            "donutSize": 50,
                            "isDistributed": true,
                            "kpiFontSize": "3",
                            "minValueGuage": 0,
                            "maxValueGuage": 100,
                            "donutDecimalPlaces": 2,
                            "decimalPlaces": 2,
                            "legendsAllignment": "bottom",
                            "displayUnits": "none",
                            "suffix": "",
                            "prefix": "",
                            "dataLabelsFontFamily": "sans-serif",
                            "dataLabelsFontSize": "12px",
                            "dataLabelsFontPosition": "top",
                            "measureAlignment": "center",
                            "dimensionAlignment": "center",
                            "tableDataFontFamily": "sans-serif",
                            "tableDataFontSize": "12px",
                            "tableDataFontWeight": 400,
                            "tableDataFontStyle": "normal",
                            "tableDataFontDecoration": "none",
                            "tableDataFontColor": "#000000",
                            "tableDataFontAlignment": "left",
                            "headerFontFamily": "'Arial', sans-serif",
                            "headerFontSize": "16px",
                            "headerFontWeight": 700,
                            "headerFontStyle": "normal",
                            "headerFontDecoration": "none",
                            "headerFontColor": "#000000",
                            "headerFontAlignment": "left",
                            "dimensionColor": "#2392c1",
                            "measureColor": "#2392c1",
                            "dataLabelsColor": "#2392c1",
                            "sortType": 0,
                            "rightLegend": null,
                            "bottomLegend": "0%",
                            "legendOrient": "horizontal",
                            "leftLegend": "center",
                            "topLegend": null,
                            "sortColumn": "select",
                            "locationDrillDownSwitch": false,
                            "isLocationField": false,
                            "KPIDecimalPlaces": 2,
                            "KPIDisplayUnits": "none",
                            "KPIPrefix": "",
                            "KPISuffix": "",
                            "pivotRowTotals": true,
                            "pivotColumnTotals": true,
                            "bandingOddColor": "#f5f7fa",
                            "bandingEvenColor": "#ffffff"
                        },
                        "pivotData": {
                            "pivotMeasureData": [],
                            "pivotRowData": [
                                {
                                    "col": "sum(invoiceDeliveryMethod.id)",
                                    "result_data": []
                                }
                            ],
                            "pivotColData": [
                                {
                                    "column": "name",
                                    "result_data": []
                                }
                            ]
                        }
                    }
                ],
                "tabWidth": 800,
                "tabHeight": 800,
                "isEditing": false
            },
            {
                "name": "Tab Title_2",
                "dashboard": [
                    {
                        "id": "e6421d0a-bfbd-4173-9bd7-4b0b86919c6b",
                        "x": 0,
                        "y": 0,
                        "rows": 1,
                        "cols": 1,
                        "data": {
                            "title": "Sheet 7",
                            "content": "Content of card New",
                            "sheetTagName": "Sheet 7"
                        },
                        "sheetType": "Chart",
                        "sheetId": 16909,
                        "chartType": "FUNNEL",
                        "databaseId": 2489,
                        "qrySetId": 3666,
                        "chartId": 27,
                        "chartOptions": {
                            "color": [
                                "#1d2e92",
                                "#088ed2",
                                "#007cb9",
                                "#36c2ce",
                                "#52c9f7"
                            ],
                            "tooltip": {
                                "trigger": "item"
                            },
                            "series": [
                                {
                                    "name": "",
                                    "type": "funnel",
                                    "data": [],
                                    "label": {
                                        "show": true,
                                        "position": "top",
                                        "fontFamily": "sans-serif",
                                        "fontSize": "12px",
                                        "fontWeight": 400,
                                        "color": "#2392c1"
                                    }
                                }
                            ]
                        },
                        "selectedSheet": true,
                        "chartData": [],
                        "isEChart": true,
                        "echartOptions": {
                            "color": [
                                "#1d2e92",
                                "#088ed2",
                                "#007cb9",
                                "#36c2ce",
                                "#52c9f7"
                            ],
                            "tooltip": {
                                "trigger": "item"
                            },
                            "series": [
                                {
                                    "name": "",
                                    "type": "funnel",
                                    "data": [],
                                    "label": {
                                        "show": true,
                                        "position": "top",
                                        "fontFamily": "sans-serif",
                                        "fontSize": "12px",
                                        "fontWeight": 400,
                                        "color": "#2392c1"
                                    }
                                }
                            ]
                        },
                        "drillDownHierarchy": [],
                        "column_Data": [
                            [
                                "city",
                                "string",
                                "",
                                ""
                            ]
                        ],
                        "row_Data": [
                            [
                                "numberOfEmployees",
                                "int64",
                                "",
                                ""
                            ]
                        ],
                        "drillDownObject": [],
                        "drillDownIndex": 0,
                        "isDrillDownData": false,
                        "numberFormat": {
                            "donutDecimalPlaces": 2,
                            "decimalPlaces": 2,
                            "displayUnits": "none",
                            "prefix": "",
                            "suffix": ""
                        },
                        "customizeOptions": {
                            "isZoom": false,
                            "xGridColor": "#2392c1",
                            "xGridSwitch": false,
                            "xLabelSwitch": true,
                            "xLabelColor": "#2392c1",
                            "yLabelSwitch": true,
                            "yGridColor": "#2392c1",
                            "yGridSwitch": false,
                            "yLabelColor": "#2392c1",
                            "xLabelFontFamily": "sans-serif",
                            "xLabelFontSize": 12,
                            "xlabelFontWeight": 400,
                            "labelAlignment": "left",
                            "backgroundColor": "#fff",
                            "color": "#2392c1",
                            "selectedColorScheme": [
                                "#1d2e92",
                                "#088ed2",
                                "#007cb9",
                                "#36c2ce",
                                "#52c9f7"
                            ],
                            "ylabelFontWeight": 400,
                            "isBold": false,
                            "isTableHeaderBold": false,
                            "isTableDataBold": false,
                            "isYlabelBold": false,
                            "isXlabelBold": false,
                            "yLabelFontFamily": "sans-serif",
                            "yLabelFontSize": 12,
                            "bandingSwitch": false,
                            "backgroundColorSwitch": false,
                            "chartColorSwitch": false,
                            "barColorSwitch": false,
                            "lineColorSwitch": false,
                            "gridLineColorSwitch": false,
                            "xLabelColorSwitch": false,
                            "xGridLineColorSwitch": false,
                            "yLabelColorSwitch": false,
                            "yGridLineColorSwitch": false,
                            "bandingColorSwitch": false,
                            "kpiColorSwitch": false,
                            "funnelColorSwitch": false,
                            "kpiColor": "#000000",
                            "barColor": "#4382f7",
                            "lineColor": "#38ff98",
                            "GridColor": "#089ffc",
                            "legendSwitch": true,
                            "dataLabels": true,
                            "label": true,
                            "donutSize": 50,
                            "isDistributed": true,
                            "kpiFontSize": "3",
                            "minValueGuage": 0,
                            "maxValueGuage": 100,
                            "donutDecimalPlaces": 2,
                            "decimalPlaces": 2,
                            "legendsAllignment": "bottom",
                            "displayUnits": "none",
                            "suffix": "",
                            "prefix": "",
                            "dataLabelsFontFamily": "sans-serif",
                            "dataLabelsFontSize": "12px",
                            "dataLabelsFontPosition": "top",
                            "measureAlignment": "center",
                            "dimensionAlignment": "center",
                            "tableDataFontFamily": "sans-serif",
                            "tableDataFontSize": "12px",
                            "tableDataFontWeight": 400,
                            "tableDataFontStyle": "normal",
                            "tableDataFontDecoration": "none",
                            "tableDataFontColor": "#000000",
                            "tableDataFontAlignment": "left",
                            "headerFontFamily": "'Arial', sans-serif",
                            "headerFontSize": "16px",
                            "headerFontWeight": 700,
                            "headerFontStyle": "normal",
                            "headerFontDecoration": "none",
                            "headerFontColor": "#000000",
                            "headerFontAlignment": "left",
                            "dimensionColor": "#2392c1",
                            "measureColor": "#2392c1",
                            "dataLabelsColor": "#2392c1",
                            "sortType": 0,
                            "rightLegend": null,
                            "bottomLegend": "0%",
                            "legendOrient": "horizontal",
                            "leftLegend": "center",
                            "topLegend": null,
                            "sortColumn": "select",
                            "locationDrillDownSwitch": false,
                            "isLocationField": true,
                            "KPIDecimalPlaces": 2,
                            "KPIDisplayUnits": "none",
                            "KPIPrefix": "",
                            "KPISuffix": "",
                            "pivotRowTotals": true,
                            "pivotColumnTotals": true,
                            "bandingOddColor": "#f5f7fa",
                            "bandingEvenColor": "#ffffff"
                        },
                        "pivotData": {
                            "pivotMeasureData": [],
                            "pivotRowData": [
                                {
                                    "col": "numberOfEmployees",
                                    "result_data": []
                                }
                            ],
                            "pivotColData": [
                                {
                                    "column": "city",
                                    "result_data": []
                                }
                            ]
                        }
                    },
                    {
                        "id": "112a7f86-c146-4112-8e6d-d59e9780431e",
                        "x": 1,
                        "y": 0,
                        "rows": 1,
                        "cols": 1,
                        "data": {
                            "title": "Sheet 8",
                            "content": "Content of card New",
                            "sheetTagName": "Sheet 8"
                        },
                        "sheetType": "Chart",
                        "sheetId": 16910,
                        "chartType": "pie",
                        "databaseId": 2489,
                        "qrySetId": 3666,
                        "chartId": 24,
                        "chartOptions": {
                            "backgroundColor": "#fff",
                            "color": [
                                "#1d2e92",
                                "#088ed2",
                                "#007cb9",
                                "#36c2ce",
                                "#52c9f7"
                            ],
                            "tooltip": {
                                "trigger": "item"
                            },
                            "legend": {
                                "bottom": "0%",
                                "left": "center",
                                "orient": "horizontal",
                                "right": null,
                                "top": null,
                                "type": "scroll",
                                "show": true
                            },
                            "label": {
                                "show": true,
                                "formatter": "{b}: {d}%"
                            },
                            "series": [
                                {
                                    "type": "pie",
                                    "radius": "50%",
                                    "data": [],
                                    "emphasis": {
                                        "itemStyle": {
                                            "shadowBlur": 10,
                                            "shadowOffsetX": 0,
                                            "shadowColor": "rgba(0, 0, 0, 0.5)"
                                        }
                                    },
                                    "label": {
                                        "show": true,
                                        "fontWeight": 400
                                    }
                                }
                            ]
                        },
                        "selectedSheet": true,
                        "chartData": [],
                        "isEChart": true,
                        "echartOptions": {
                            "backgroundColor": "#fff",
                            "color": [
                                "#1d2e92",
                                "#088ed2",
                                "#007cb9",
                                "#36c2ce",
                                "#52c9f7"
                            ],
                            "tooltip": {
                                "trigger": "item"
                            },
                            "legend": {
                                "bottom": "0%",
                                "left": "center",
                                "orient": "horizontal",
                                "right": null,
                                "top": null,
                                "type": "scroll",
                                "show": true
                            },
                            "label": {
                                "show": true,
                                "formatter": "{b}: {d}%"
                            },
                            "series": [
                                {
                                    "type": "pie",
                                    "radius": "50%",
                                    "data": [],
                                    "emphasis": {
                                        "itemStyle": {
                                            "shadowBlur": 10,
                                            "shadowOffsetX": 0,
                                            "shadowColor": "rgba(0, 0, 0, 0.5)"
                                        }
                                    },
                                    "label": {
                                        "show": true,
                                        "fontWeight": 400
                                    }
                                }
                            ]
                        },
                        "drillDownHierarchy": [],
                        "column_Data": [
                            [
                                "faxNumber",
                                "string",
                                "",
                                ""
                            ]
                        ],
                        "row_Data": [
                            [
                                "annualRevenue",
                                "aggregate",
                                "sum",
                                ""
                            ]
                        ],
                        "drillDownObject": [],
                        "drillDownIndex": 0,
                        "isDrillDownData": false,
                        "numberFormat": {
                            "donutDecimalPlaces": 2,
                            "decimalPlaces": 2,
                            "displayUnits": "none",
                            "prefix": "",
                            "suffix": ""
                        },
                        "customizeOptions": {
                            "isZoom": false,
                            "xGridColor": "#2392c1",
                            "xGridSwitch": false,
                            "xLabelSwitch": true,
                            "xLabelColor": "#2392c1",
                            "yLabelSwitch": true,
                            "yGridColor": "#2392c1",
                            "yGridSwitch": false,
                            "yLabelColor": "#2392c1",
                            "xLabelFontFamily": "sans-serif",
                            "xLabelFontSize": 12,
                            "xlabelFontWeight": 400,
                            "labelAlignment": "left",
                            "backgroundColor": "#fff",
                            "color": "#2392c1",
                            "selectedColorScheme": [
                                "#1d2e92",
                                "#088ed2",
                                "#007cb9",
                                "#36c2ce",
                                "#52c9f7"
                            ],
                            "ylabelFontWeight": 400,
                            "isBold": false,
                            "isTableHeaderBold": false,
                            "isTableDataBold": false,
                            "isYlabelBold": false,
                            "isXlabelBold": false,
                            "yLabelFontFamily": "sans-serif",
                            "yLabelFontSize": 12,
                            "bandingSwitch": false,
                            "backgroundColorSwitch": false,
                            "chartColorSwitch": false,
                            "barColorSwitch": false,
                            "lineColorSwitch": false,
                            "gridLineColorSwitch": false,
                            "xLabelColorSwitch": false,
                            "xGridLineColorSwitch": false,
                            "yLabelColorSwitch": false,
                            "yGridLineColorSwitch": false,
                            "bandingColorSwitch": false,
                            "kpiColorSwitch": false,
                            "funnelColorSwitch": false,
                            "kpiColor": "#000000",
                            "barColor": "#4382f7",
                            "lineColor": "#38ff98",
                            "GridColor": "#089ffc",
                            "legendSwitch": true,
                            "dataLabels": true,
                            "label": true,
                            "donutSize": 50,
                            "isDistributed": true,
                            "kpiFontSize": "3",
                            "minValueGuage": 0,
                            "maxValueGuage": 100,
                            "donutDecimalPlaces": 2,
                            "decimalPlaces": 2,
                            "legendsAllignment": "bottom",
                            "displayUnits": "none",
                            "suffix": "",
                            "prefix": "",
                            "dataLabelsFontFamily": "sans-serif",
                            "dataLabelsFontSize": "12px",
                            "dataLabelsFontPosition": "top",
                            "measureAlignment": "center",
                            "dimensionAlignment": "center",
                            "tableDataFontFamily": "sans-serif",
                            "tableDataFontSize": "12px",
                            "tableDataFontWeight": 400,
                            "tableDataFontStyle": "normal",
                            "tableDataFontDecoration": "none",
                            "tableDataFontColor": "#000000",
                            "tableDataFontAlignment": "left",
                            "headerFontFamily": "'Arial', sans-serif",
                            "headerFontSize": "16px",
                            "headerFontWeight": 700,
                            "headerFontStyle": "normal",
                            "headerFontDecoration": "none",
                            "headerFontColor": "#000000",
                            "headerFontAlignment": "left",
                            "dimensionColor": "#2392c1",
                            "measureColor": "#2392c1",
                            "dataLabelsColor": "#2392c1",
                            "sortType": 0,
                            "rightLegend": null,
                            "bottomLegend": "0%",
                            "legendOrient": "horizontal",
                            "leftLegend": "center",
                            "topLegend": null,
                            "sortColumn": "select",
                            "locationDrillDownSwitch": false,
                            "isLocationField": false,
                            "KPIDecimalPlaces": 2,
                            "KPIDisplayUnits": "none",
                            "KPIPrefix": "",
                            "KPISuffix": "",
                            "pivotRowTotals": true,
                            "pivotColumnTotals": true,
                            "bandingOddColor": "#f5f7fa",
                            "bandingEvenColor": "#ffffff"
                        },
                        "pivotData": {
                            "pivotMeasureData": [],
                            "pivotRowData": [
                                {
                                    "col": "sum(annualRevenue)",
                                    "result_data": []
                                }
                            ],
                            "pivotColData": [
                                {
                                    "column": "faxNumber",
                                    "result_data": []
                                }
                            ]
                        }
                    }
                ],
                "tabWidth": 800,
                "tabHeight": 800,
                "isEditing": false
            }
        ]
    },
    "datasource_query": {
        "queryset_id": 3729,
        "hierarchy_id": 2521,
        "join_type": [],
        "joining_conditions": [
            []
        ],
        "joining_tables": [
            [
                "swdefdgfb_A23JNM",
                "company_companies",
                "company_companies"
            ]
        ],
        "dragged_array": [
            {
                "table": "company_companies",
                "alias": "company_companies",
                "schema": "swdefdgfb_A23JNM",
                "columns": [
                    {
                        "column": "id",
                        "data_type": "int64"
                    },
                    {
                        "column": "identifier",
                        "data_type": "string"
                    },
                    {
                        "column": "name",
                        "data_type": "string"
                    },
                    {
                        "column": "status.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "status.name",
                        "data_type": "string"
                    },
                    {
                        "column": "status._info.status_href",
                        "data_type": "string"
                    },
                    {
                        "column": "country.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "country.name",
                        "data_type": "string"
                    },
                    {
                        "column": "country._info.country_href",
                        "data_type": "string"
                    },
                    {
                        "column": "phoneNumber",
                        "data_type": "string"
                    },
                    {
                        "column": "website",
                        "data_type": "string"
                    },
                    {
                        "column": "territory.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "territory.name",
                        "data_type": "string"
                    },
                    {
                        "column": "territory._info.location_href",
                        "data_type": "string"
                    },
                    {
                        "column": "market.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "market.name",
                        "data_type": "string"
                    },
                    {
                        "column": "market._info.Market_href",
                        "data_type": "string"
                    },
                    {
                        "column": "defaultContact.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "defaultContact.name",
                        "data_type": "string"
                    },
                    {
                        "column": "defaultContact._info.contact_href",
                        "data_type": "string"
                    },
                    {
                        "column": "dateAcquired",
                        "data_type": "datetime64"
                    },
                    {
                        "column": "annualRevenue",
                        "data_type": "int64"
                    },
                    {
                        "column": "timeZoneSetup.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "timeZoneSetup.name",
                        "data_type": "string"
                    },
                    {
                        "column": "timeZoneSetup._info.timeZoneSetup_href",
                        "data_type": "string"
                    },
                    {
                        "column": "leadFlag",
                        "data_type": "bool"
                    },
                    {
                        "column": "unsubscribeFlag",
                        "data_type": "bool"
                    },
                    {
                        "column": "taxCode.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "taxCode.name",
                        "data_type": "string"
                    },
                    {
                        "column": "taxCode._info.taxCode_href",
                        "data_type": "string"
                    },
                    {
                        "column": "billingTerms.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "billingTerms.name",
                        "data_type": "string"
                    },
                    {
                        "column": "billToCompany.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "billToCompany.identifier",
                        "data_type": "string"
                    },
                    {
                        "column": "billToCompany.name",
                        "data_type": "string"
                    },
                    {
                        "column": "billToCompany._info.company_href",
                        "data_type": "string"
                    },
                    {
                        "column": "invoiceDeliveryMethod.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "invoiceDeliveryMethod.name",
                        "data_type": "string"
                    },
                    {
                        "column": "deletedFlag",
                        "data_type": "bool"
                    },
                    {
                        "column": "mobileGuid",
                        "data_type": "string"
                    },
                    {
                        "column": "isVendorFlag",
                        "data_type": "bool"
                    },
                    {
                        "column": "types[0].id",
                        "data_type": "int64"
                    },
                    {
                        "column": "types[0].name",
                        "data_type": "string"
                    },
                    {
                        "column": "types[0]._info.type_href",
                        "data_type": "string"
                    },
                    {
                        "column": "site.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "site.name",
                        "data_type": "string"
                    },
                    {
                        "column": "site._info.site_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.lastUpdated",
                        "data_type": "datetime64"
                    },
                    {
                        "column": "_info.updatedBy",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.dateEntered",
                        "data_type": "datetime64"
                    },
                    {
                        "column": "_info.enteredBy",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.contacts_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.agreements_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.tickets_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.opportunities_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.activities_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.projects_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.configurations_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.orders_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.documents_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.sites_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.teams_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.reports_href",
                        "data_type": "string"
                    },
                    {
                        "column": "_info.notes_href",
                        "data_type": "string"
                    },
                    {
                        "column": "addressLine1",
                        "data_type": "string"
                    },
                    {
                        "column": "addressLine2",
                        "data_type": "string"
                    },
                    {
                        "column": "city",
                        "data_type": "string"
                    },
                    {
                        "column": "state",
                        "data_type": "string"
                    },
                    {
                        "column": "zip",
                        "data_type": "string"
                    },
                    {
                        "column": "faxNumber",
                        "data_type": "string"
                    },
                    {
                        "column": "accountNumber",
                        "data_type": "string"
                    },
                    {
                        "column": "numberOfEmployees",
                        "data_type": "int64"
                    },
                    {
                        "column": "leadSource",
                        "data_type": "string"
                    },
                    {
                        "column": "billingContact.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "billingContact.name",
                        "data_type": "string"
                    },
                    {
                        "column": "billingContact._info.contact_href",
                        "data_type": "string"
                    },
                    {
                        "column": "invoiceToEmailAddress",
                        "data_type": "string"
                    },
                    {
                        "column": "billingSite.id",
                        "data_type": "int64"
                    },
                    {
                        "column": "billingSite.name",
                        "data_type": "string"
                    },
                    {
                        "column": "billingSite._info.site_href",
                        "data_type": "string"
                    }
                ]
            }
        ]
    }
};

  constructor(
    private workbenchService: WorkbenchService,
    private templateDashboardService: TemplateDashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(){
    forkJoin({
      responseA:  this.workbenchService.getdatabaseConnectionsList({need_pagination : false}),
      responseB: this.workbenchService.getuserDashboardsList()
    }).subscribe({
      next: ({ responseA, responseB }) => {
        this.connectionsList = responseA;
        this.dashboardList = responseB;
        // this.loading = false;
      },
      error: (err) => {
        console.error('Error loading APIs', err);
        // this.loading = false;
      }
    });
    // this.getDashboardsList();
    // this.getdatabaseConnectionsList();
  }

  getdatabaseConnectionsList(){
    this.workbenchService.getdatabaseConnectionsList({need_pagination : false}).subscribe({
      next: (responce: any) => {
        console.log(responce);
        this.connectionsList = responce;
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }
  connectionsList : any[] = [];
  dashboardList : any[] = [];
  getDashboardsList() {
    this.workbenchService.getuserDashboardsList().subscribe({
      next: (responce: any) => {
        console.log(responce);
        this.dashboardList = responce;
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }

  /** Trigger export of a dashboard using its ID and export key. */
  doExport(): void {
    if (!this.exportDashboardId) {
      this.toastr.error('Please enter dashboard ID.');
      return;
    }
    this.loadingExport = true;
    let payload = {dashboard_id :this.exportDashboardId};
    this.workbenchService.exportDashboard(payload).subscribe({
      next: (res: any) => {this.toastr.success('Export successful')
      this.exportResultKey = res.shared_dashboard_token;
    },
      error: err => {this.loadingExport = false;this.toastr.error(err.error?.message || 'Export failed')},
      complete: () => (this.loadingExport = false)
    });
  }

  /** Trigger import of a dashboard using import key and hierarchy ID. */
  doImport(): void {
    if (!this.importKey || !this.hierarchyId) {
      this.toastr.error('Please enter import key and pick connected datasource');
      return;
    }

    let payload = {  "hierarchy_id":this.hierarchyId,
    "dashboard_import_id":this.importKey
}
    // this.workbenchService.importDashboard(payload).subscribe({
    //   next: (res: any) => {
    //     this.toastr.success('Import successful');
    //     this.templateDashboardService.buildDashboardTransfer(this.container,res);
    //   },
    //   error: err => this.toastr.error(err.error?.message || 'Import failed'),
    
    // });
    this.templateDashboardService.buildDashboardTransfer(this.container,this.resultOutput);
  }

  copyKey() {
    navigator.clipboard.writeText(this.exportResultKey);
    this.toastr.info('Copied to clipboard');
  }
}
