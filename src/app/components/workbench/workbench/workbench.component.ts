import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/sharedmodule';
import { FormsModule } from '@angular/forms';
import { WorkbenchService } from '../workbench.service';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { of } from 'rxjs';
// import { data } from '../../charts/echarts/echarts';
import Swal from 'sweetalert2';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule, DOCUMENT } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { InsightsButtonComponent } from '../insights-button/insights-button.component';
import { ViewTemplateDrivenService } from '../view-template-driven.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { SharedService } from '../../../shared/services/shared.service';
import { SheetsComponent } from '../sheets/sheets.component';
import { InsightEchartComponent } from '../insight-echart/insight-echart.component';
@Component({
  selector: 'app-workbench',
  standalone: true,
  imports: [RouterModule,NgbModule,SharedModule,FormsModule,CdkDropListGroup, CdkDropList, CdkDrag,GalleryModule,LightboxModule,ToastrModule,CommonModule,NgxPaginationModule,InsightsButtonComponent,SheetsComponent],
  templateUrl: './workbench.component.html',
  styleUrl: './workbench.component.scss'
})
export class WorkbenchComponent implements OnInit{
  @ViewChild('fileInput') fileInput:any;
  @ViewChild('fileInput1') fileInput1:any;
 test =[
  {
      "sheet_id": 10977,
      "sheet_name": "Total Companies",
      "chart_id": 25,
      "sheet_tag_name": "<p>Total Companies</p>",
      "sheet_data": null,
      "created_by": 17,
      "sheet_filter_ids": [],
      "sheet_filter_quereyset_ids": "11093",
      "datasource_queryset_id": null,
      "filters_data": [],
      "custom_query": "SELECT COUNT(DISTINCT \\\"id\\\") AS \\\"CNTD(id)\\\" FROM (SELECT \\\"company_companies\\\".\\\"id\\\" AS \\\"id\\\", \\\"company_companies\\\".\\\"identifier\\\" AS \\\"identifier\\\", \\\"company_companies\\\".\\\"name\\\" AS \\\"name\\\", \\\"company_companies\\\".\\\"status.id\\\" AS \\\"status.id\\\", \\\"company_companies\\\".\\\"status.name\\\" AS \\\"status.name\\\", \\\"company_companies\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href\\\", \\\"company_companies\\\".\\\"country.id\\\" AS \\\"country.id\\\", \\\"company_companies\\\".\\\"country.name\\\" AS \\\"country.name\\\", \\\"company_companies\\\".\\\"country._info.country_href\\\" AS \\\"country._info.country_href\\\", \\\"company_companies\\\".\\\"phoneNumber\\\" AS \\\"phoneNumber\\\", \\\"company_companies\\\".\\\"website\\\" AS \\\"website\\\", \\\"company_companies\\\".\\\"territory.id\\\" AS \\\"territory.id\\\", \\\"company_companies\\\".\\\"territory.name\\\" AS \\\"territory.name\\\", \\\"company_companies\\\".\\\"territory._info.location_href\\\" AS \\\"territory._info.location_href\\\", \\\"company_companies\\\".\\\"market.id\\\" AS \\\"market.id\\\", \\\"company_companies\\\".\\\"market.name\\\" AS \\\"market.name\\\", \\\"company_companies\\\".\\\"market._info.Market_href\\\" AS \\\"market._info.Market_href\\\", \\\"company_companies\\\".\\\"defaultContact.id\\\" AS \\\"defaultContact.id\\\", \\\"company_companies\\\".\\\"defaultContact.name\\\" AS \\\"defaultContact.name\\\", \\\"company_companies\\\".\\\"defaultContact._info.contact_href\\\" AS \\\"defaultContact._info.contact_href\\\", \\\"company_companies\\\".\\\"dateAcquired\\\" AS \\\"dateAcquired\\\", \\\"company_companies\\\".\\\"annualRevenue\\\" AS \\\"annualRevenue\\\", \\\"company_companies\\\".\\\"timeZoneSetup.id\\\" AS \\\"timeZoneSetup.id\\\", \\\"company_companies\\\".\\\"timeZoneSetup.name\\\" AS \\\"timeZoneSetup.name\\\", \\\"company_companies\\\".\\\"timeZoneSetup._info.timeZoneSetup_href\\\" AS \\\"timeZoneSetup._info.timeZoneSetup_href\\\", \\\"company_companies\\\".\\\"leadFlag\\\" AS \\\"leadFlag\\\", \\\"company_companies\\\".\\\"unsubscribeFlag\\\" AS \\\"unsubscribeFlag\\\", \\\"company_companies\\\".\\\"taxCode.id\\\" AS \\\"taxCode.id\\\", \\\"company_companies\\\".\\\"taxCode.name\\\" AS \\\"taxCode.name\\\", \\\"company_companies\\\".\\\"taxCode._info.taxCode_href\\\" AS \\\"taxCode._info.taxCode_href\\\", \\\"company_companies\\\".\\\"billingTerms.id\\\" AS \\\"billingTerms.id\\\", \\\"company_companies\\\".\\\"billingTerms.name\\\" AS \\\"billingTerms.name\\\", \\\"company_companies\\\".\\\"billToCompany.id\\\" AS \\\"billToCompany.id\\\", \\\"company_companies\\\".\\\"billToCompany.identifier\\\" AS \\\"billToCompany.identifier\\\", \\\"company_companies\\\".\\\"billToCompany.name\\\" AS \\\"billToCompany.name\\\", \\\"company_companies\\\".\\\"billToCompany._info.company_href\\\" AS \\\"billToCompany._info.company_href\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.id\\\" AS \\\"invoiceDeliveryMethod.id\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.name\\\" AS \\\"invoiceDeliveryMethod.name\\\", \\\"company_companies\\\".\\\"deletedFlag\\\" AS \\\"deletedFlag\\\", \\\"company_companies\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid\\\", \\\"company_companies\\\".\\\"isVendorFlag\\\" AS \\\"isVendorFlag\\\", \\\"company_companies\\\".\\\"types[0].id\\\" AS \\\"types[0].id\\\", \\\"company_companies\\\".\\\"types[0].name\\\" AS \\\"types[0].name\\\", \\\"company_companies\\\".\\\"types[0]._info.type_href\\\" AS \\\"types[0]._info.type_href\\\", \\\"company_companies\\\".\\\"site.id\\\" AS \\\"site.id\\\", \\\"company_companies\\\".\\\"site.name\\\" AS \\\"site.name\\\", \\\"company_companies\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href\\\", \\\"company_companies\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated\\\", \\\"company_companies\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy\\\", \\\"company_companies\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered\\\", \\\"company_companies\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy\\\", \\\"company_companies\\\".\\\"_info.contacts_href\\\" AS \\\"_info.contacts_href\\\", \\\"company_companies\\\".\\\"_info.agreements_href\\\" AS \\\"_info.agreements_href\\\", \\\"company_companies\\\".\\\"_info.tickets_href\\\" AS \\\"_info.tickets_href\\\", \\\"company_companies\\\".\\\"_info.opportunities_href\\\" AS \\\"_info.opportunities_href\\\", \\\"company_companies\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href\\\", \\\"company_companies\\\".\\\"_info.projects_href\\\" AS \\\"_info.projects_href\\\", \\\"company_companies\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href\\\", \\\"company_companies\\\".\\\"_info.orders_href\\\" AS \\\"_info.orders_href\\\", \\\"company_companies\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href\\\", \\\"company_companies\\\".\\\"_info.sites_href\\\" AS \\\"_info.sites_href\\\", \\\"company_companies\\\".\\\"_info.teams_href\\\" AS \\\"_info.teams_href\\\", \\\"company_companies\\\".\\\"_info.reports_href\\\" AS \\\"_info.reports_href\\\", \\\"company_companies\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href\\\", \\\"company_companies\\\".\\\"addressLine1\\\" AS \\\"addressLine1\\\", \\\"company_companies\\\".\\\"addressLine2\\\" AS \\\"addressLine2\\\", \\\"company_companies\\\".\\\"city\\\" AS \\\"city\\\", \\\"company_companies\\\".\\\"state\\\" AS \\\"state\\\", \\\"company_companies\\\".\\\"zip\\\" AS \\\"zip\\\", \\\"company_companies\\\".\\\"faxNumber\\\" AS \\\"faxNumber\\\", \\\"company_companies\\\".\\\"accountNumber\\\" AS \\\"accountNumber\\\", \\\"company_companies\\\".\\\"numberOfEmployees\\\" AS \\\"numberOfEmployees\\\", \\\"company_companies\\\".\\\"leadSource\\\" AS \\\"leadSource\\\", \\\"company_companies\\\".\\\"billingContact.id\\\" AS \\\"billingContact.id\\\", \\\"company_companies\\\".\\\"billingContact.name\\\" AS \\\"billingContact.name\\\", \\\"company_companies\\\".\\\"billingContact._info.contact_href\\\" AS \\\"billingContact._info.contact_href\\\", \\\"company_companies\\\".\\\"invoiceToEmailAddress\\\" AS \\\"invoiceToEmailAddress\\\", \\\"company_companies\\\".\\\"billingSite.id\\\" AS \\\"billingSite.id\\\", \\\"company_companies\\\".\\\"billingSite.name\\\" AS \\\"billingSite.name\\\", \\\"company_companies\\\".\\\"billingSite._info.site_href\\\" AS \\\"billingSite._info.site_href\\\", \\\"company_configurations\\\".\\\"id\\\" AS \\\"id(company_configurations)\\\", \\\"company_configurations\\\".\\\"name\\\" AS \\\"name(company_configurations)\\\", \\\"company_configurations\\\".\\\"type.id\\\" AS \\\"type.id\\\", \\\"company_configurations\\\".\\\"type.name\\\" AS \\\"type.name\\\", \\\"company_configurations\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href\\\", \\\"company_configurations\\\".\\\"status.id\\\" AS \\\"status.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"status.name\\\" AS \\\"status.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"company.id\\\" AS \\\"company.id\\\", \\\"company_configurations\\\".\\\"company.identifier\\\" AS \\\"company.identifier\\\", \\\"company_configurations\\\".\\\"company.name\\\" AS \\\"company.name\\\", \\\"company_configurations\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href\\\", \\\"company_configurations\\\".\\\"contact.id\\\" AS \\\"contact.id\\\", \\\"company_configurations\\\".\\\"contact.name\\\" AS \\\"contact.name\\\", \\\"company_configurations\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href\\\", \\\"company_configurations\\\".\\\"site.id\\\" AS \\\"site.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"site.name\\\" AS \\\"site.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"locationId\\\" AS \\\"locationId\\\", \\\"company_configurations\\\".\\\"location.id\\\" AS \\\"location.id\\\", \\\"company_configurations\\\".\\\"location.name\\\" AS \\\"location.name\\\", \\\"company_configurations\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href\\\", \\\"company_configurations\\\".\\\"businessUnitId\\\" AS \\\"businessUnitId\\\", \\\"company_configurations\\\".\\\"department.id\\\" AS \\\"department.id\\\", \\\"company_configurations\\\".\\\"department.identifier\\\" AS \\\"department.identifier\\\", \\\"company_configurations\\\".\\\"department.name\\\" AS \\\"department.name\\\", \\\"company_configurations\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href\\\", \\\"company_configurations\\\".\\\"serialNumber\\\" AS \\\"serialNumber\\\", \\\"company_configurations\\\".\\\"modelNumber\\\" AS \\\"modelNumber\\\", \\\"company_configurations\\\".\\\"tagNumber\\\" AS \\\"tagNumber\\\", \\\"company_configurations\\\".\\\"warrantyExpirationDate\\\" AS \\\"warrantyExpirationDate\\\", \\\"company_configurations\\\".\\\"notes\\\" AS \\\"notes\\\", \\\"company_configurations\\\".\\\"billFlag\\\" AS \\\"billFlag\\\", \\\"company_configurations\\\".\\\"vendor.id\\\" AS \\\"vendor.id\\\", \\\"company_configurations\\\".\\\"vendor.identifier\\\" AS \\\"vendor.identifier\\\", \\\"company_configurations\\\".\\\"vendor.name\\\" AS \\\"vendor.name\\\", \\\"company_configurations\\\".\\\"vendor._info.company_href\\\" AS \\\"vendor._info.company_href\\\", \\\"company_configurations\\\".\\\"activeFlag\\\" AS \\\"activeFlag\\\", \\\"company_configurations\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(company_configurations)\\\", \\\"company_configurations\\\".\\\"companyLocationId\\\" AS \\\"companyLocationId\\\", \\\"company_configurations\\\".\\\"showRemoteFlag\\\" AS \\\"showRemoteFlag\\\", \\\"company_configurations\\\".\\\"showAutomateFlag\\\" AS \\\"showAutomateFlag\\\", \\\"company_configurations\\\".\\\"needsRenewalFlag\\\" AS \\\"needsRenewalFlag\\\", \\\"company_configurations\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"backupSuccesses\\\" AS \\\"backupSuccesses\\\", \\\"company_configurations\\\".\\\"backupIncomplete\\\" AS \\\"backupIncomplete\\\", \\\"company_configurations\\\".\\\"backupFailed\\\" AS \\\"backupFailed\\\", \\\"company_configurations\\\".\\\"backupRestores\\\" AS \\\"backupRestores\\\", \\\"company_configurations\\\".\\\"backupBillableSpaceGb\\\" AS \\\"backupBillableSpaceGb\\\", \\\"company_configurations\\\".\\\"backupYear\\\" AS \\\"backupYear\\\", \\\"company_configurations\\\".\\\"backupMonth\\\" AS \\\"backupMonth\\\", \\\"service_tickets\\\".\\\"id\\\" AS \\\"id(service_tickets)\\\", \\\"service_tickets\\\".\\\"summary\\\" AS \\\"summary\\\", \\\"service_tickets\\\".\\\"recordType\\\" AS \\\"recordType\\\", \\\"service_tickets\\\".\\\"board.id\\\" AS \\\"board.id\\\", \\\"service_tickets\\\".\\\"board.name\\\" AS \\\"board.name\\\", \\\"service_tickets\\\".\\\"board._info.board_href\\\" AS \\\"board._info.board_href\\\", \\\"service_tickets\\\".\\\"status.id\\\" AS \\\"status.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.name\\\" AS \\\"status.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.Sort\\\" AS \\\"status.Sort\\\", \\\"service_tickets\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.id\\\" AS \\\"company.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.identifier\\\" AS \\\"company.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.name\\\" AS \\\"company.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.mobileGuid\\\" AS \\\"company._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"site.id\\\" AS \\\"site.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"site.name\\\" AS \\\"site.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.mobileGuid\\\" AS \\\"site._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"addressLine1\\\" AS \\\"addressLine1(service_tickets)\\\", \\\"service_tickets\\\".\\\"addressLine2\\\" AS \\\"addressLine2(service_tickets)\\\", \\\"service_tickets\\\".\\\"city\\\" AS \\\"city(service_tickets)\\\", \\\"service_tickets\\\".\\\"stateIdentifier\\\" AS \\\"stateIdentifier\\\", \\\"service_tickets\\\".\\\"zip\\\" AS \\\"zip(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.id\\\" AS \\\"contact.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.name\\\" AS \\\"contact.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact._info.mobileGuid\\\" AS \\\"contact._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"contactName\\\" AS \\\"contactName\\\", \\\"service_tickets\\\".\\\"contactPhoneNumber\\\" AS \\\"contactPhoneNumber\\\", \\\"service_tickets\\\".\\\"contactPhoneExtension\\\" AS \\\"contactPhoneExtension\\\", \\\"service_tickets\\\".\\\"contactEmailAddress\\\" AS \\\"contactEmailAddress\\\", \\\"service_tickets\\\".\\\"team.id\\\" AS \\\"team.id\\\", \\\"service_tickets\\\".\\\"team.name\\\" AS \\\"team.name\\\", \\\"service_tickets\\\".\\\"team._info.team_href\\\" AS \\\"team._info.team_href\\\", \\\"service_tickets\\\".\\\"priority.id\\\" AS \\\"priority.id\\\", \\\"service_tickets\\\".\\\"priority.name\\\" AS \\\"priority.name\\\", \\\"service_tickets\\\".\\\"priority.sort\\\" AS \\\"priority.sort\\\", \\\"service_tickets\\\".\\\"priority._info.priority_href\\\" AS \\\"priority._info.priority_href\\\", \\\"service_tickets\\\".\\\"priority._info.image_href\\\" AS \\\"priority._info.image_href\\\", \\\"service_tickets\\\".\\\"serviceLocation.id\\\" AS \\\"serviceLocation.id\\\", \\\"service_tickets\\\".\\\"serviceLocation.name\\\" AS \\\"serviceLocation.name\\\", \\\"service_tickets\\\".\\\"serviceLocation._info.location_href\\\" AS \\\"serviceLocation._info.location_href\\\", \\\"service_tickets\\\".\\\"source.id\\\" AS \\\"source.id\\\", \\\"service_tickets\\\".\\\"source.name\\\" AS \\\"source.name\\\", \\\"service_tickets\\\".\\\"source._info.source_href\\\" AS \\\"source._info.source_href\\\", \\\"service_tickets\\\".\\\"agreement.id\\\" AS \\\"agreement.id\\\", \\\"service_tickets\\\".\\\"agreement.name\\\" AS \\\"agreement.name\\\", \\\"service_tickets\\\".\\\"agreement._info.agreement_href\\\" AS \\\"agreement._info.agreement_href\\\", \\\"service_tickets\\\".\\\"severity\\\" AS \\\"severity\\\", \\\"service_tickets\\\".\\\"impact\\\" AS \\\"impact\\\", \\\"service_tickets\\\".\\\"allowAllClientsPortalView\\\" AS \\\"allowAllClientsPortalView\\\", \\\"service_tickets\\\".\\\"customerUpdatedFlag\\\" AS \\\"customerUpdatedFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailContactFlag\\\" AS \\\"automaticEmailContactFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailResourceFlag\\\" AS \\\"automaticEmailResourceFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailCcFlag\\\" AS \\\"automaticEmailCcFlag\\\", \\\"service_tickets\\\".\\\"closedDate\\\" AS \\\"closedDate\\\", \\\"service_tickets\\\".\\\"closedBy\\\" AS \\\"closedBy\\\", \\\"service_tickets\\\".\\\"closedFlag\\\" AS \\\"closedFlag\\\", \\\"service_tickets\\\".\\\"actualHours\\\" AS \\\"actualHours\\\", \\\"service_tickets\\\".\\\"approved\\\" AS \\\"approved\\\", \\\"service_tickets\\\".\\\"estimatedExpenseCost\\\" AS \\\"estimatedExpenseCost\\\", \\\"service_tickets\\\".\\\"estimatedExpenseRevenue\\\" AS \\\"estimatedExpenseRevenue\\\", \\\"service_tickets\\\".\\\"estimatedProductCost\\\" AS \\\"estimatedProductCost\\\", \\\"service_tickets\\\".\\\"estimatedProductRevenue\\\" AS \\\"estimatedProductRevenue\\\", \\\"service_tickets\\\".\\\"estimatedTimeCost\\\" AS \\\"estimatedTimeCost\\\", \\\"service_tickets\\\".\\\"estimatedTimeRevenue\\\" AS \\\"estimatedTimeRevenue\\\", \\\"service_tickets\\\".\\\"billingMethod\\\" AS \\\"billingMethod\\\", \\\"service_tickets\\\".\\\"dateResplan\\\" AS \\\"dateResplan\\\", \\\"service_tickets\\\".\\\"dateResponded\\\" AS \\\"dateResponded\\\", \\\"service_tickets\\\".\\\"resolveMinutes\\\" AS \\\"resolveMinutes\\\", \\\"service_tickets\\\".\\\"resPlanMinutes\\\" AS \\\"resPlanMinutes\\\", \\\"service_tickets\\\".\\\"respondMinutes\\\" AS \\\"respondMinutes\\\", \\\"service_tickets\\\".\\\"isInSla\\\" AS \\\"isInSla\\\", \\\"service_tickets\\\".\\\"hasChildTicket\\\" AS \\\"hasChildTicket\\\", \\\"service_tickets\\\".\\\"hasMergedChildTicketFlag\\\" AS \\\"hasMergedChildTicketFlag\\\", \\\"service_tickets\\\".\\\"billTime\\\" AS \\\"billTime\\\", \\\"service_tickets\\\".\\\"billExpenses\\\" AS \\\"billExpenses\\\", \\\"service_tickets\\\".\\\"billProducts\\\" AS \\\"billProducts\\\", \\\"service_tickets\\\".\\\"location.id\\\" AS \\\"location.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"location.name\\\" AS \\\"location.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.id\\\" AS \\\"department.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.identifier\\\" AS \\\"department.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.name\\\" AS \\\"department.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(service_tickets)\\\", \\\"service_tickets\\\".\\\"sla.id\\\" AS \\\"sla.id\\\", \\\"service_tickets\\\".\\\"sla.name\\\" AS \\\"sla.name\\\", \\\"service_tickets\\\".\\\"sla._info.sla_href\\\" AS \\\"sla._info.sla_href\\\", \\\"service_tickets\\\".\\\"currency.id\\\" AS \\\"currency.id\\\", \\\"service_tickets\\\".\\\"currency.symbol\\\" AS \\\"currency.symbol\\\", \\\"service_tickets\\\".\\\"currency.currencyCode\\\" AS \\\"currency.currencyCode\\\", \\\"service_tickets\\\".\\\"currency.decimalSeparator\\\" AS \\\"currency.decimalSeparator\\\", \\\"service_tickets\\\".\\\"currency.numberOfDecimals\\\" AS \\\"currency.numberOfDecimals\\\", \\\"service_tickets\\\".\\\"currency.thousandsSeparator\\\" AS \\\"currency.thousandsSeparator\\\", \\\"service_tickets\\\".\\\"currency.negativeParenthesesFlag\\\" AS \\\"currency.negativeParenthesesFlag\\\", \\\"service_tickets\\\".\\\"currency.displaySymbolFlag\\\" AS \\\"currency.displaySymbolFlag\\\", \\\"service_tickets\\\".\\\"currency.currencyIdentifier\\\" AS \\\"currency.currencyIdentifier\\\", \\\"service_tickets\\\".\\\"currency.displayIdFlag\\\" AS \\\"currency.displayIdFlag\\\", \\\"service_tickets\\\".\\\"currency.rightAlign\\\" AS \\\"currency.rightAlign\\\", \\\"service_tickets\\\".\\\"currency.name\\\" AS \\\"currency.name\\\", \\\"service_tickets\\\".\\\"currency._info.currency_href\\\" AS \\\"currency._info.currency_href\\\", \\\"service_tickets\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.scheduleentries_href\\\" AS \\\"_info.scheduleentries_href\\\", \\\"service_tickets\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.tasks_href\\\" AS \\\"_info.tasks_href\\\", \\\"service_tickets\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.products_href\\\" AS \\\"_info.products_href\\\", \\\"service_tickets\\\".\\\"_info.timeentries_href\\\" AS \\\"_info.timeentries_href\\\", \\\"service_tickets\\\".\\\"_info.expenseEntries_href\\\" AS \\\"_info.expenseEntries_href\\\", \\\"service_tickets\\\".\\\"escalationStartDateUTC\\\" AS \\\"escalationStartDateUTC\\\", \\\"service_tickets\\\".\\\"escalationLevel\\\" AS \\\"escalationLevel\\\", \\\"service_tickets\\\".\\\"minutesBeforeWaiting\\\" AS \\\"minutesBeforeWaiting\\\", \\\"service_tickets\\\".\\\"respondedSkippedMinutes\\\" AS \\\"respondedSkippedMinutes\\\", \\\"service_tickets\\\".\\\"resplanSkippedMinutes\\\" AS \\\"resplanSkippedMinutes\\\", \\\"service_tickets\\\".\\\"respondedHours\\\" AS \\\"respondedHours\\\", \\\"service_tickets\\\".\\\"respondedBy\\\" AS \\\"respondedBy\\\", \\\"service_tickets\\\".\\\"resplanHours\\\" AS \\\"resplanHours\\\", \\\"service_tickets\\\".\\\"resplanBy\\\" AS \\\"resplanBy\\\", \\\"service_tickets\\\".\\\"resolutionHours\\\" AS \\\"resolutionHours\\\", \\\"service_tickets\\\".\\\"minutesWaiting\\\" AS \\\"minutesWaiting\\\", \\\"service_tickets\\\".\\\"workType.id\\\" AS \\\"workType.id\\\", \\\"service_tickets\\\".\\\"workType.name\\\" AS \\\"workType.name\\\", \\\"service_tickets\\\".\\\"workType._info.workType_href\\\" AS \\\"workType._info.workType_href\\\", \\\"service_tickets\\\".\\\"resources\\\" AS \\\"resources\\\", \\\"service_tickets\\\".\\\"workRole.id\\\" AS \\\"workRole.id\\\", \\\"service_tickets\\\".\\\"workRole.name\\\" AS \\\"workRole.name\\\", \\\"service_tickets\\\".\\\"workRole._info.workRole_href\\\" AS \\\"workRole._info.workRole_href\\\", \\\"service_tickets\\\".\\\"type.id\\\" AS \\\"type.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"type.name\\\" AS \\\"type.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"requiredDate\\\" AS \\\"requiredDate\\\", \\\"service_tickets\\\".\\\"budgetHours\\\" AS \\\"budgetHours\\\", \\\"service_tickets\\\".\\\"requestForChangeFlag\\\" AS \\\"requestForChangeFlag\\\" FROM \\\"PJ-23\\\".\\\"company_companies\\\" AS \\\"company_companies\\\" INNER JOIN \\\"PJ-23\\\".\\\"company_configurations\\\" AS \\\"company_configurations\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"company_configurations\\\".\\\"id\\\" INNER JOIN \\\"PJ-23\\\".\\\"service_tickets\\\" AS \\\"service_tickets\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"service_tickets\\\".\\\"id\\\") temp_table ORDER BY \\\"CNTD(id)\\\" ASC NULLS FIRST",
      "col_data": [],
      "row_data": [
          " \"CNTD(id)\""
      ],
      "sheet_query_data": {
          "columns_data": [],
          "rows_data": [
              {
                  "column": "CNTD(id)",
                  "data": [
                      2
                  ]
              }
          ]
      }
  },
  {
      "sheet_id": 10976,
      "sheet_name": "Total Annual Revenue",
      "chart_id": 25,
      "sheet_tag_name": "<p>Total Annual Revenue</p>",
      "sheet_data": null,
      "created_by": 17,
      "sheet_filter_ids": [],
      "sheet_filter_quereyset_ids": "11092",
      "datasource_queryset_id": null,
      "filters_data": [],
      "custom_query": "SELECT COUNT(DISTINCT \\\"annualRevenue\\\") AS \\\"CNTD(annualRevenue)\\\" FROM (SELECT \\\"company_companies\\\".\\\"id\\\" AS \\\"id\\\", \\\"company_companies\\\".\\\"identifier\\\" AS \\\"identifier\\\", \\\"company_companies\\\".\\\"name\\\" AS \\\"name\\\", \\\"company_companies\\\".\\\"status.id\\\" AS \\\"status.id\\\", \\\"company_companies\\\".\\\"status.name\\\" AS \\\"status.name\\\", \\\"company_companies\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href\\\", \\\"company_companies\\\".\\\"country.id\\\" AS \\\"country.id\\\", \\\"company_companies\\\".\\\"country.name\\\" AS \\\"country.name\\\", \\\"company_companies\\\".\\\"country._info.country_href\\\" AS \\\"country._info.country_href\\\", \\\"company_companies\\\".\\\"phoneNumber\\\" AS \\\"phoneNumber\\\", \\\"company_companies\\\".\\\"website\\\" AS \\\"website\\\", \\\"company_companies\\\".\\\"territory.id\\\" AS \\\"territory.id\\\", \\\"company_companies\\\".\\\"territory.name\\\" AS \\\"territory.name\\\", \\\"company_companies\\\".\\\"territory._info.location_href\\\" AS \\\"territory._info.location_href\\\", \\\"company_companies\\\".\\\"market.id\\\" AS \\\"market.id\\\", \\\"company_companies\\\".\\\"market.name\\\" AS \\\"market.name\\\", \\\"company_companies\\\".\\\"market._info.Market_href\\\" AS \\\"market._info.Market_href\\\", \\\"company_companies\\\".\\\"defaultContact.id\\\" AS \\\"defaultContact.id\\\", \\\"company_companies\\\".\\\"defaultContact.name\\\" AS \\\"defaultContact.name\\\", \\\"company_companies\\\".\\\"defaultContact._info.contact_href\\\" AS \\\"defaultContact._info.contact_href\\\", \\\"company_companies\\\".\\\"dateAcquired\\\" AS \\\"dateAcquired\\\", \\\"company_companies\\\".\\\"annualRevenue\\\" AS \\\"annualRevenue\\\", \\\"company_companies\\\".\\\"timeZoneSetup.id\\\" AS \\\"timeZoneSetup.id\\\", \\\"company_companies\\\".\\\"timeZoneSetup.name\\\" AS \\\"timeZoneSetup.name\\\", \\\"company_companies\\\".\\\"timeZoneSetup._info.timeZoneSetup_href\\\" AS \\\"timeZoneSetup._info.timeZoneSetup_href\\\", \\\"company_companies\\\".\\\"leadFlag\\\" AS \\\"leadFlag\\\", \\\"company_companies\\\".\\\"unsubscribeFlag\\\" AS \\\"unsubscribeFlag\\\", \\\"company_companies\\\".\\\"taxCode.id\\\" AS \\\"taxCode.id\\\", \\\"company_companies\\\".\\\"taxCode.name\\\" AS \\\"taxCode.name\\\", \\\"company_companies\\\".\\\"taxCode._info.taxCode_href\\\" AS \\\"taxCode._info.taxCode_href\\\", \\\"company_companies\\\".\\\"billingTerms.id\\\" AS \\\"billingTerms.id\\\", \\\"company_companies\\\".\\\"billingTerms.name\\\" AS \\\"billingTerms.name\\\", \\\"company_companies\\\".\\\"billToCompany.id\\\" AS \\\"billToCompany.id\\\", \\\"company_companies\\\".\\\"billToCompany.identifier\\\" AS \\\"billToCompany.identifier\\\", \\\"company_companies\\\".\\\"billToCompany.name\\\" AS \\\"billToCompany.name\\\", \\\"company_companies\\\".\\\"billToCompany._info.company_href\\\" AS \\\"billToCompany._info.company_href\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.id\\\" AS \\\"invoiceDeliveryMethod.id\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.name\\\" AS \\\"invoiceDeliveryMethod.name\\\", \\\"company_companies\\\".\\\"deletedFlag\\\" AS \\\"deletedFlag\\\", \\\"company_companies\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid\\\", \\\"company_companies\\\".\\\"isVendorFlag\\\" AS \\\"isVendorFlag\\\", \\\"company_companies\\\".\\\"types[0].id\\\" AS \\\"types[0].id\\\", \\\"company_companies\\\".\\\"types[0].name\\\" AS \\\"types[0].name\\\", \\\"company_companies\\\".\\\"types[0]._info.type_href\\\" AS \\\"types[0]._info.type_href\\\", \\\"company_companies\\\".\\\"site.id\\\" AS \\\"site.id\\\", \\\"company_companies\\\".\\\"site.name\\\" AS \\\"site.name\\\", \\\"company_companies\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href\\\", \\\"company_companies\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated\\\", \\\"company_companies\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy\\\", \\\"company_companies\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered\\\", \\\"company_companies\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy\\\", \\\"company_companies\\\".\\\"_info.contacts_href\\\" AS \\\"_info.contacts_href\\\", \\\"company_companies\\\".\\\"_info.agreements_href\\\" AS \\\"_info.agreements_href\\\", \\\"company_companies\\\".\\\"_info.tickets_href\\\" AS \\\"_info.tickets_href\\\", \\\"company_companies\\\".\\\"_info.opportunities_href\\\" AS \\\"_info.opportunities_href\\\", \\\"company_companies\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href\\\", \\\"company_companies\\\".\\\"_info.projects_href\\\" AS \\\"_info.projects_href\\\", \\\"company_companies\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href\\\", \\\"company_companies\\\".\\\"_info.orders_href\\\" AS \\\"_info.orders_href\\\", \\\"company_companies\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href\\\", \\\"company_companies\\\".\\\"_info.sites_href\\\" AS \\\"_info.sites_href\\\", \\\"company_companies\\\".\\\"_info.teams_href\\\" AS \\\"_info.teams_href\\\", \\\"company_companies\\\".\\\"_info.reports_href\\\" AS \\\"_info.reports_href\\\", \\\"company_companies\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href\\\", \\\"company_companies\\\".\\\"addressLine1\\\" AS \\\"addressLine1\\\", \\\"company_companies\\\".\\\"addressLine2\\\" AS \\\"addressLine2\\\", \\\"company_companies\\\".\\\"city\\\" AS \\\"city\\\", \\\"company_companies\\\".\\\"state\\\" AS \\\"state\\\", \\\"company_companies\\\".\\\"zip\\\" AS \\\"zip\\\", \\\"company_companies\\\".\\\"faxNumber\\\" AS \\\"faxNumber\\\", \\\"company_companies\\\".\\\"accountNumber\\\" AS \\\"accountNumber\\\", \\\"company_companies\\\".\\\"numberOfEmployees\\\" AS \\\"numberOfEmployees\\\", \\\"company_companies\\\".\\\"leadSource\\\" AS \\\"leadSource\\\", \\\"company_companies\\\".\\\"billingContact.id\\\" AS \\\"billingContact.id\\\", \\\"company_companies\\\".\\\"billingContact.name\\\" AS \\\"billingContact.name\\\", \\\"company_companies\\\".\\\"billingContact._info.contact_href\\\" AS \\\"billingContact._info.contact_href\\\", \\\"company_companies\\\".\\\"invoiceToEmailAddress\\\" AS \\\"invoiceToEmailAddress\\\", \\\"company_companies\\\".\\\"billingSite.id\\\" AS \\\"billingSite.id\\\", \\\"company_companies\\\".\\\"billingSite.name\\\" AS \\\"billingSite.name\\\", \\\"company_companies\\\".\\\"billingSite._info.site_href\\\" AS \\\"billingSite._info.site_href\\\", \\\"company_configurations\\\".\\\"id\\\" AS \\\"id(company_configurations)\\\", \\\"company_configurations\\\".\\\"name\\\" AS \\\"name(company_configurations)\\\", \\\"company_configurations\\\".\\\"type.id\\\" AS \\\"type.id\\\", \\\"company_configurations\\\".\\\"type.name\\\" AS \\\"type.name\\\", \\\"company_configurations\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href\\\", \\\"company_configurations\\\".\\\"status.id\\\" AS \\\"status.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"status.name\\\" AS \\\"status.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"company.id\\\" AS \\\"company.id\\\", \\\"company_configurations\\\".\\\"company.identifier\\\" AS \\\"company.identifier\\\", \\\"company_configurations\\\".\\\"company.name\\\" AS \\\"company.name\\\", \\\"company_configurations\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href\\\", \\\"company_configurations\\\".\\\"contact.id\\\" AS \\\"contact.id\\\", \\\"company_configurations\\\".\\\"contact.name\\\" AS \\\"contact.name\\\", \\\"company_configurations\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href\\\", \\\"company_configurations\\\".\\\"site.id\\\" AS \\\"site.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"site.name\\\" AS \\\"site.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"locationId\\\" AS \\\"locationId\\\", \\\"company_configurations\\\".\\\"location.id\\\" AS \\\"location.id\\\", \\\"company_configurations\\\".\\\"location.name\\\" AS \\\"location.name\\\", \\\"company_configurations\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href\\\", \\\"company_configurations\\\".\\\"businessUnitId\\\" AS \\\"businessUnitId\\\", \\\"company_configurations\\\".\\\"department.id\\\" AS \\\"department.id\\\", \\\"company_configurations\\\".\\\"department.identifier\\\" AS \\\"department.identifier\\\", \\\"company_configurations\\\".\\\"department.name\\\" AS \\\"department.name\\\", \\\"company_configurations\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href\\\", \\\"company_configurations\\\".\\\"serialNumber\\\" AS \\\"serialNumber\\\", \\\"company_configurations\\\".\\\"modelNumber\\\" AS \\\"modelNumber\\\", \\\"company_configurations\\\".\\\"tagNumber\\\" AS \\\"tagNumber\\\", \\\"company_configurations\\\".\\\"warrantyExpirationDate\\\" AS \\\"warrantyExpirationDate\\\", \\\"company_configurations\\\".\\\"notes\\\" AS \\\"notes\\\", \\\"company_configurations\\\".\\\"billFlag\\\" AS \\\"billFlag\\\", \\\"company_configurations\\\".\\\"vendor.id\\\" AS \\\"vendor.id\\\", \\\"company_configurations\\\".\\\"vendor.identifier\\\" AS \\\"vendor.identifier\\\", \\\"company_configurations\\\".\\\"vendor.name\\\" AS \\\"vendor.name\\\", \\\"company_configurations\\\".\\\"vendor._info.company_href\\\" AS \\\"vendor._info.company_href\\\", \\\"company_configurations\\\".\\\"activeFlag\\\" AS \\\"activeFlag\\\", \\\"company_configurations\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(company_configurations)\\\", \\\"company_configurations\\\".\\\"companyLocationId\\\" AS \\\"companyLocationId\\\", \\\"company_configurations\\\".\\\"showRemoteFlag\\\" AS \\\"showRemoteFlag\\\", \\\"company_configurations\\\".\\\"showAutomateFlag\\\" AS \\\"showAutomateFlag\\\", \\\"company_configurations\\\".\\\"needsRenewalFlag\\\" AS \\\"needsRenewalFlag\\\", \\\"company_configurations\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"backupSuccesses\\\" AS \\\"backupSuccesses\\\", \\\"company_configurations\\\".\\\"backupIncomplete\\\" AS \\\"backupIncomplete\\\", \\\"company_configurations\\\".\\\"backupFailed\\\" AS \\\"backupFailed\\\", \\\"company_configurations\\\".\\\"backupRestores\\\" AS \\\"backupRestores\\\", \\\"company_configurations\\\".\\\"backupBillableSpaceGb\\\" AS \\\"backupBillableSpaceGb\\\", \\\"company_configurations\\\".\\\"backupYear\\\" AS \\\"backupYear\\\", \\\"company_configurations\\\".\\\"backupMonth\\\" AS \\\"backupMonth\\\", \\\"service_tickets\\\".\\\"id\\\" AS \\\"id(service_tickets)\\\", \\\"service_tickets\\\".\\\"summary\\\" AS \\\"summary\\\", \\\"service_tickets\\\".\\\"recordType\\\" AS \\\"recordType\\\", \\\"service_tickets\\\".\\\"board.id\\\" AS \\\"board.id\\\", \\\"service_tickets\\\".\\\"board.name\\\" AS \\\"board.name\\\", \\\"service_tickets\\\".\\\"board._info.board_href\\\" AS \\\"board._info.board_href\\\", \\\"service_tickets\\\".\\\"status.id\\\" AS \\\"status.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.name\\\" AS \\\"status.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.Sort\\\" AS \\\"status.Sort\\\", \\\"service_tickets\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.id\\\" AS \\\"company.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.identifier\\\" AS \\\"company.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.name\\\" AS \\\"company.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.mobileGuid\\\" AS \\\"company._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"site.id\\\" AS \\\"site.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"site.name\\\" AS \\\"site.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.mobileGuid\\\" AS \\\"site._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"addressLine1\\\" AS \\\"addressLine1(service_tickets)\\\", \\\"service_tickets\\\".\\\"addressLine2\\\" AS \\\"addressLine2(service_tickets)\\\", \\\"service_tickets\\\".\\\"city\\\" AS \\\"city(service_tickets)\\\", \\\"service_tickets\\\".\\\"stateIdentifier\\\" AS \\\"stateIdentifier\\\", \\\"service_tickets\\\".\\\"zip\\\" AS \\\"zip(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.id\\\" AS \\\"contact.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.name\\\" AS \\\"contact.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact._info.mobileGuid\\\" AS \\\"contact._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"contactName\\\" AS \\\"contactName\\\", \\\"service_tickets\\\".\\\"contactPhoneNumber\\\" AS \\\"contactPhoneNumber\\\", \\\"service_tickets\\\".\\\"contactPhoneExtension\\\" AS \\\"contactPhoneExtension\\\", \\\"service_tickets\\\".\\\"contactEmailAddress\\\" AS \\\"contactEmailAddress\\\", \\\"service_tickets\\\".\\\"team.id\\\" AS \\\"team.id\\\", \\\"service_tickets\\\".\\\"team.name\\\" AS \\\"team.name\\\", \\\"service_tickets\\\".\\\"team._info.team_href\\\" AS \\\"team._info.team_href\\\", \\\"service_tickets\\\".\\\"priority.id\\\" AS \\\"priority.id\\\", \\\"service_tickets\\\".\\\"priority.name\\\" AS \\\"priority.name\\\", \\\"service_tickets\\\".\\\"priority.sort\\\" AS \\\"priority.sort\\\", \\\"service_tickets\\\".\\\"priority._info.priority_href\\\" AS \\\"priority._info.priority_href\\\", \\\"service_tickets\\\".\\\"priority._info.image_href\\\" AS \\\"priority._info.image_href\\\", \\\"service_tickets\\\".\\\"serviceLocation.id\\\" AS \\\"serviceLocation.id\\\", \\\"service_tickets\\\".\\\"serviceLocation.name\\\" AS \\\"serviceLocation.name\\\", \\\"service_tickets\\\".\\\"serviceLocation._info.location_href\\\" AS \\\"serviceLocation._info.location_href\\\", \\\"service_tickets\\\".\\\"source.id\\\" AS \\\"source.id\\\", \\\"service_tickets\\\".\\\"source.name\\\" AS \\\"source.name\\\", \\\"service_tickets\\\".\\\"source._info.source_href\\\" AS \\\"source._info.source_href\\\", \\\"service_tickets\\\".\\\"agreement.id\\\" AS \\\"agreement.id\\\", \\\"service_tickets\\\".\\\"agreement.name\\\" AS \\\"agreement.name\\\", \\\"service_tickets\\\".\\\"agreement._info.agreement_href\\\" AS \\\"agreement._info.agreement_href\\\", \\\"service_tickets\\\".\\\"severity\\\" AS \\\"severity\\\", \\\"service_tickets\\\".\\\"impact\\\" AS \\\"impact\\\", \\\"service_tickets\\\".\\\"allowAllClientsPortalView\\\" AS \\\"allowAllClientsPortalView\\\", \\\"service_tickets\\\".\\\"customerUpdatedFlag\\\" AS \\\"customerUpdatedFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailContactFlag\\\" AS \\\"automaticEmailContactFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailResourceFlag\\\" AS \\\"automaticEmailResourceFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailCcFlag\\\" AS \\\"automaticEmailCcFlag\\\", \\\"service_tickets\\\".\\\"closedDate\\\" AS \\\"closedDate\\\", \\\"service_tickets\\\".\\\"closedBy\\\" AS \\\"closedBy\\\", \\\"service_tickets\\\".\\\"closedFlag\\\" AS \\\"closedFlag\\\", \\\"service_tickets\\\".\\\"actualHours\\\" AS \\\"actualHours\\\", \\\"service_tickets\\\".\\\"approved\\\" AS \\\"approved\\\", \\\"service_tickets\\\".\\\"estimatedExpenseCost\\\" AS \\\"estimatedExpenseCost\\\", \\\"service_tickets\\\".\\\"estimatedExpenseRevenue\\\" AS \\\"estimatedExpenseRevenue\\\", \\\"service_tickets\\\".\\\"estimatedProductCost\\\" AS \\\"estimatedProductCost\\\", \\\"service_tickets\\\".\\\"estimatedProductRevenue\\\" AS \\\"estimatedProductRevenue\\\", \\\"service_tickets\\\".\\\"estimatedTimeCost\\\" AS \\\"estimatedTimeCost\\\", \\\"service_tickets\\\".\\\"estimatedTimeRevenue\\\" AS \\\"estimatedTimeRevenue\\\", \\\"service_tickets\\\".\\\"billingMethod\\\" AS \\\"billingMethod\\\", \\\"service_tickets\\\".\\\"dateResplan\\\" AS \\\"dateResplan\\\", \\\"service_tickets\\\".\\\"dateResponded\\\" AS \\\"dateResponded\\\", \\\"service_tickets\\\".\\\"resolveMinutes\\\" AS \\\"resolveMinutes\\\", \\\"service_tickets\\\".\\\"resPlanMinutes\\\" AS \\\"resPlanMinutes\\\", \\\"service_tickets\\\".\\\"respondMinutes\\\" AS \\\"respondMinutes\\\", \\\"service_tickets\\\".\\\"isInSla\\\" AS \\\"isInSla\\\", \\\"service_tickets\\\".\\\"hasChildTicket\\\" AS \\\"hasChildTicket\\\", \\\"service_tickets\\\".\\\"hasMergedChildTicketFlag\\\" AS \\\"hasMergedChildTicketFlag\\\", \\\"service_tickets\\\".\\\"billTime\\\" AS \\\"billTime\\\", \\\"service_tickets\\\".\\\"billExpenses\\\" AS \\\"billExpenses\\\", \\\"service_tickets\\\".\\\"billProducts\\\" AS \\\"billProducts\\\", \\\"service_tickets\\\".\\\"location.id\\\" AS \\\"location.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"location.name\\\" AS \\\"location.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.id\\\" AS \\\"department.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.identifier\\\" AS \\\"department.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.name\\\" AS \\\"department.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(service_tickets)\\\", \\\"service_tickets\\\".\\\"sla.id\\\" AS \\\"sla.id\\\", \\\"service_tickets\\\".\\\"sla.name\\\" AS \\\"sla.name\\\", \\\"service_tickets\\\".\\\"sla._info.sla_href\\\" AS \\\"sla._info.sla_href\\\", \\\"service_tickets\\\".\\\"currency.id\\\" AS \\\"currency.id\\\", \\\"service_tickets\\\".\\\"currency.symbol\\\" AS \\\"currency.symbol\\\", \\\"service_tickets\\\".\\\"currency.currencyCode\\\" AS \\\"currency.currencyCode\\\", \\\"service_tickets\\\".\\\"currency.decimalSeparator\\\" AS \\\"currency.decimalSeparator\\\", \\\"service_tickets\\\".\\\"currency.numberOfDecimals\\\" AS \\\"currency.numberOfDecimals\\\", \\\"service_tickets\\\".\\\"currency.thousandsSeparator\\\" AS \\\"currency.thousandsSeparator\\\", \\\"service_tickets\\\".\\\"currency.negativeParenthesesFlag\\\" AS \\\"currency.negativeParenthesesFlag\\\", \\\"service_tickets\\\".\\\"currency.displaySymbolFlag\\\" AS \\\"currency.displaySymbolFlag\\\", \\\"service_tickets\\\".\\\"currency.currencyIdentifier\\\" AS \\\"currency.currencyIdentifier\\\", \\\"service_tickets\\\".\\\"currency.displayIdFlag\\\" AS \\\"currency.displayIdFlag\\\", \\\"service_tickets\\\".\\\"currency.rightAlign\\\" AS \\\"currency.rightAlign\\\", \\\"service_tickets\\\".\\\"currency.name\\\" AS \\\"currency.name\\\", \\\"service_tickets\\\".\\\"currency._info.currency_href\\\" AS \\\"currency._info.currency_href\\\", \\\"service_tickets\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.scheduleentries_href\\\" AS \\\"_info.scheduleentries_href\\\", \\\"service_tickets\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.tasks_href\\\" AS \\\"_info.tasks_href\\\", \\\"service_tickets\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.products_href\\\" AS \\\"_info.products_href\\\", \\\"service_tickets\\\".\\\"_info.timeentries_href\\\" AS \\\"_info.timeentries_href\\\", \\\"service_tickets\\\".\\\"_info.expenseEntries_href\\\" AS \\\"_info.expenseEntries_href\\\", \\\"service_tickets\\\".\\\"escalationStartDateUTC\\\" AS \\\"escalationStartDateUTC\\\", \\\"service_tickets\\\".\\\"escalationLevel\\\" AS \\\"escalationLevel\\\", \\\"service_tickets\\\".\\\"minutesBeforeWaiting\\\" AS \\\"minutesBeforeWaiting\\\", \\\"service_tickets\\\".\\\"respondedSkippedMinutes\\\" AS \\\"respondedSkippedMinutes\\\", \\\"service_tickets\\\".\\\"resplanSkippedMinutes\\\" AS \\\"resplanSkippedMinutes\\\", \\\"service_tickets\\\".\\\"respondedHours\\\" AS \\\"respondedHours\\\", \\\"service_tickets\\\".\\\"respondedBy\\\" AS \\\"respondedBy\\\", \\\"service_tickets\\\".\\\"resplanHours\\\" AS \\\"resplanHours\\\", \\\"service_tickets\\\".\\\"resplanBy\\\" AS \\\"resplanBy\\\", \\\"service_tickets\\\".\\\"resolutionHours\\\" AS \\\"resolutionHours\\\", \\\"service_tickets\\\".\\\"minutesWaiting\\\" AS \\\"minutesWaiting\\\", \\\"service_tickets\\\".\\\"workType.id\\\" AS \\\"workType.id\\\", \\\"service_tickets\\\".\\\"workType.name\\\" AS \\\"workType.name\\\", \\\"service_tickets\\\".\\\"workType._info.workType_href\\\" AS \\\"workType._info.workType_href\\\", \\\"service_tickets\\\".\\\"resources\\\" AS \\\"resources\\\", \\\"service_tickets\\\".\\\"workRole.id\\\" AS \\\"workRole.id\\\", \\\"service_tickets\\\".\\\"workRole.name\\\" AS \\\"workRole.name\\\", \\\"service_tickets\\\".\\\"workRole._info.workRole_href\\\" AS \\\"workRole._info.workRole_href\\\", \\\"service_tickets\\\".\\\"type.id\\\" AS \\\"type.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"type.name\\\" AS \\\"type.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"requiredDate\\\" AS \\\"requiredDate\\\", \\\"service_tickets\\\".\\\"budgetHours\\\" AS \\\"budgetHours\\\", \\\"service_tickets\\\".\\\"requestForChangeFlag\\\" AS \\\"requestForChangeFlag\\\" FROM \\\"PJ-23\\\".\\\"company_companies\\\" AS \\\"company_companies\\\" INNER JOIN \\\"PJ-23\\\".\\\"company_configurations\\\" AS \\\"company_configurations\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"company_configurations\\\".\\\"id\\\" INNER JOIN \\\"PJ-23\\\".\\\"service_tickets\\\" AS \\\"service_tickets\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"service_tickets\\\".\\\"id\\\") temp_table ORDER BY \\\"CNTD(annualRevenue)\\\" ASC NULLS FIRST",
      "col_data": [],
      "row_data": [
          " \"CNTD(annualRevenue)\""
      ],
      "sheet_query_data": {
          "columns_data": [],
          "rows_data": [
              {
                  "column": "CNTD(annualRevenue)",
                  "data": [
                      2
                  ]
              }
          ]
      }
  },
  {
      "sheet_id": 10975,
      "sheet_name": "Total Tickets",
      "chart_id": 25,
      "sheet_tag_name": "<p>Total Tickets</p>",
      "sheet_data": null,
      "created_by": 17,
      "sheet_filter_ids": [],
      "sheet_filter_quereyset_ids": "11091",
      "datasource_queryset_id": null,
      "filters_data": [],
      "custom_query": "SELECT COUNT(DISTINCT \\\"id(service_tickets)\\\") AS \\\"CNTD(id(service_tickets))\\\" FROM (SELECT \\\"company_companies\\\".\\\"id\\\" AS \\\"id\\\", \\\"company_companies\\\".\\\"identifier\\\" AS \\\"identifier\\\", \\\"company_companies\\\".\\\"name\\\" AS \\\"name\\\", \\\"company_companies\\\".\\\"status.id\\\" AS \\\"status.id\\\", \\\"company_companies\\\".\\\"status.name\\\" AS \\\"status.name\\\", \\\"company_companies\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href\\\", \\\"company_companies\\\".\\\"country.id\\\" AS \\\"country.id\\\", \\\"company_companies\\\".\\\"country.name\\\" AS \\\"country.name\\\", \\\"company_companies\\\".\\\"country._info.country_href\\\" AS \\\"country._info.country_href\\\", \\\"company_companies\\\".\\\"phoneNumber\\\" AS \\\"phoneNumber\\\", \\\"company_companies\\\".\\\"website\\\" AS \\\"website\\\", \\\"company_companies\\\".\\\"territory.id\\\" AS \\\"territory.id\\\", \\\"company_companies\\\".\\\"territory.name\\\" AS \\\"territory.name\\\", \\\"company_companies\\\".\\\"territory._info.location_href\\\" AS \\\"territory._info.location_href\\\", \\\"company_companies\\\".\\\"market.id\\\" AS \\\"market.id\\\", \\\"company_companies\\\".\\\"market.name\\\" AS \\\"market.name\\\", \\\"company_companies\\\".\\\"market._info.Market_href\\\" AS \\\"market._info.Market_href\\\", \\\"company_companies\\\".\\\"defaultContact.id\\\" AS \\\"defaultContact.id\\\", \\\"company_companies\\\".\\\"defaultContact.name\\\" AS \\\"defaultContact.name\\\", \\\"company_companies\\\".\\\"defaultContact._info.contact_href\\\" AS \\\"defaultContact._info.contact_href\\\", \\\"company_companies\\\".\\\"dateAcquired\\\" AS \\\"dateAcquired\\\", \\\"company_companies\\\".\\\"annualRevenue\\\" AS \\\"annualRevenue\\\", \\\"company_companies\\\".\\\"timeZoneSetup.id\\\" AS \\\"timeZoneSetup.id\\\", \\\"company_companies\\\".\\\"timeZoneSetup.name\\\" AS \\\"timeZoneSetup.name\\\", \\\"company_companies\\\".\\\"timeZoneSetup._info.timeZoneSetup_href\\\" AS \\\"timeZoneSetup._info.timeZoneSetup_href\\\", \\\"company_companies\\\".\\\"leadFlag\\\" AS \\\"leadFlag\\\", \\\"company_companies\\\".\\\"unsubscribeFlag\\\" AS \\\"unsubscribeFlag\\\", \\\"company_companies\\\".\\\"taxCode.id\\\" AS \\\"taxCode.id\\\", \\\"company_companies\\\".\\\"taxCode.name\\\" AS \\\"taxCode.name\\\", \\\"company_companies\\\".\\\"taxCode._info.taxCode_href\\\" AS \\\"taxCode._info.taxCode_href\\\", \\\"company_companies\\\".\\\"billingTerms.id\\\" AS \\\"billingTerms.id\\\", \\\"company_companies\\\".\\\"billingTerms.name\\\" AS \\\"billingTerms.name\\\", \\\"company_companies\\\".\\\"billToCompany.id\\\" AS \\\"billToCompany.id\\\", \\\"company_companies\\\".\\\"billToCompany.identifier\\\" AS \\\"billToCompany.identifier\\\", \\\"company_companies\\\".\\\"billToCompany.name\\\" AS \\\"billToCompany.name\\\", \\\"company_companies\\\".\\\"billToCompany._info.company_href\\\" AS \\\"billToCompany._info.company_href\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.id\\\" AS \\\"invoiceDeliveryMethod.id\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.name\\\" AS \\\"invoiceDeliveryMethod.name\\\", \\\"company_companies\\\".\\\"deletedFlag\\\" AS \\\"deletedFlag\\\", \\\"company_companies\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid\\\", \\\"company_companies\\\".\\\"isVendorFlag\\\" AS \\\"isVendorFlag\\\", \\\"company_companies\\\".\\\"types[0].id\\\" AS \\\"types[0].id\\\", \\\"company_companies\\\".\\\"types[0].name\\\" AS \\\"types[0].name\\\", \\\"company_companies\\\".\\\"types[0]._info.type_href\\\" AS \\\"types[0]._info.type_href\\\", \\\"company_companies\\\".\\\"site.id\\\" AS \\\"site.id\\\", \\\"company_companies\\\".\\\"site.name\\\" AS \\\"site.name\\\", \\\"company_companies\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href\\\", \\\"company_companies\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated\\\", \\\"company_companies\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy\\\", \\\"company_companies\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered\\\", \\\"company_companies\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy\\\", \\\"company_companies\\\".\\\"_info.contacts_href\\\" AS \\\"_info.contacts_href\\\", \\\"company_companies\\\".\\\"_info.agreements_href\\\" AS \\\"_info.agreements_href\\\", \\\"company_companies\\\".\\\"_info.tickets_href\\\" AS \\\"_info.tickets_href\\\", \\\"company_companies\\\".\\\"_info.opportunities_href\\\" AS \\\"_info.opportunities_href\\\", \\\"company_companies\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href\\\", \\\"company_companies\\\".\\\"_info.projects_href\\\" AS \\\"_info.projects_href\\\", \\\"company_companies\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href\\\", \\\"company_companies\\\".\\\"_info.orders_href\\\" AS \\\"_info.orders_href\\\", \\\"company_companies\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href\\\", \\\"company_companies\\\".\\\"_info.sites_href\\\" AS \\\"_info.sites_href\\\", \\\"company_companies\\\".\\\"_info.teams_href\\\" AS \\\"_info.teams_href\\\", \\\"company_companies\\\".\\\"_info.reports_href\\\" AS \\\"_info.reports_href\\\", \\\"company_companies\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href\\\", \\\"company_companies\\\".\\\"addressLine1\\\" AS \\\"addressLine1\\\", \\\"company_companies\\\".\\\"addressLine2\\\" AS \\\"addressLine2\\\", \\\"company_companies\\\".\\\"city\\\" AS \\\"city\\\", \\\"company_companies\\\".\\\"state\\\" AS \\\"state\\\", \\\"company_companies\\\".\\\"zip\\\" AS \\\"zip\\\", \\\"company_companies\\\".\\\"faxNumber\\\" AS \\\"faxNumber\\\", \\\"company_companies\\\".\\\"accountNumber\\\" AS \\\"accountNumber\\\", \\\"company_companies\\\".\\\"numberOfEmployees\\\" AS \\\"numberOfEmployees\\\", \\\"company_companies\\\".\\\"leadSource\\\" AS \\\"leadSource\\\", \\\"company_companies\\\".\\\"billingContact.id\\\" AS \\\"billingContact.id\\\", \\\"company_companies\\\".\\\"billingContact.name\\\" AS \\\"billingContact.name\\\", \\\"company_companies\\\".\\\"billingContact._info.contact_href\\\" AS \\\"billingContact._info.contact_href\\\", \\\"company_companies\\\".\\\"invoiceToEmailAddress\\\" AS \\\"invoiceToEmailAddress\\\", \\\"company_companies\\\".\\\"billingSite.id\\\" AS \\\"billingSite.id\\\", \\\"company_companies\\\".\\\"billingSite.name\\\" AS \\\"billingSite.name\\\", \\\"company_companies\\\".\\\"billingSite._info.site_href\\\" AS \\\"billingSite._info.site_href\\\", \\\"company_configurations\\\".\\\"id\\\" AS \\\"id(company_configurations)\\\", \\\"company_configurations\\\".\\\"name\\\" AS \\\"name(company_configurations)\\\", \\\"company_configurations\\\".\\\"type.id\\\" AS \\\"type.id\\\", \\\"company_configurations\\\".\\\"type.name\\\" AS \\\"type.name\\\", \\\"company_configurations\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href\\\", \\\"company_configurations\\\".\\\"status.id\\\" AS \\\"status.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"status.name\\\" AS \\\"status.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"company.id\\\" AS \\\"company.id\\\", \\\"company_configurations\\\".\\\"company.identifier\\\" AS \\\"company.identifier\\\", \\\"company_configurations\\\".\\\"company.name\\\" AS \\\"company.name\\\", \\\"company_configurations\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href\\\", \\\"company_configurations\\\".\\\"contact.id\\\" AS \\\"contact.id\\\", \\\"company_configurations\\\".\\\"contact.name\\\" AS \\\"contact.name\\\", \\\"company_configurations\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href\\\", \\\"company_configurations\\\".\\\"site.id\\\" AS \\\"site.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"site.name\\\" AS \\\"site.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"locationId\\\" AS \\\"locationId\\\", \\\"company_configurations\\\".\\\"location.id\\\" AS \\\"location.id\\\", \\\"company_configurations\\\".\\\"location.name\\\" AS \\\"location.name\\\", \\\"company_configurations\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href\\\", \\\"company_configurations\\\".\\\"businessUnitId\\\" AS \\\"businessUnitId\\\", \\\"company_configurations\\\".\\\"department.id\\\" AS \\\"department.id\\\", \\\"company_configurations\\\".\\\"department.identifier\\\" AS \\\"department.identifier\\\", \\\"company_configurations\\\".\\\"department.name\\\" AS \\\"department.name\\\", \\\"company_configurations\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href\\\", \\\"company_configurations\\\".\\\"serialNumber\\\" AS \\\"serialNumber\\\", \\\"company_configurations\\\".\\\"modelNumber\\\" AS \\\"modelNumber\\\", \\\"company_configurations\\\".\\\"tagNumber\\\" AS \\\"tagNumber\\\", \\\"company_configurations\\\".\\\"warrantyExpirationDate\\\" AS \\\"warrantyExpirationDate\\\", \\\"company_configurations\\\".\\\"notes\\\" AS \\\"notes\\\", \\\"company_configurations\\\".\\\"billFlag\\\" AS \\\"billFlag\\\", \\\"company_configurations\\\".\\\"vendor.id\\\" AS \\\"vendor.id\\\", \\\"company_configurations\\\".\\\"vendor.identifier\\\" AS \\\"vendor.identifier\\\", \\\"company_configurations\\\".\\\"vendor.name\\\" AS \\\"vendor.name\\\", \\\"company_configurations\\\".\\\"vendor._info.company_href\\\" AS \\\"vendor._info.company_href\\\", \\\"company_configurations\\\".\\\"activeFlag\\\" AS \\\"activeFlag\\\", \\\"company_configurations\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(company_configurations)\\\", \\\"company_configurations\\\".\\\"companyLocationId\\\" AS \\\"companyLocationId\\\", \\\"company_configurations\\\".\\\"showRemoteFlag\\\" AS \\\"showRemoteFlag\\\", \\\"company_configurations\\\".\\\"showAutomateFlag\\\" AS \\\"showAutomateFlag\\\", \\\"company_configurations\\\".\\\"needsRenewalFlag\\\" AS \\\"needsRenewalFlag\\\", \\\"company_configurations\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"backupSuccesses\\\" AS \\\"backupSuccesses\\\", \\\"company_configurations\\\".\\\"backupIncomplete\\\" AS \\\"backupIncomplete\\\", \\\"company_configurations\\\".\\\"backupFailed\\\" AS \\\"backupFailed\\\", \\\"company_configurations\\\".\\\"backupRestores\\\" AS \\\"backupRestores\\\", \\\"company_configurations\\\".\\\"backupBillableSpaceGb\\\" AS \\\"backupBillableSpaceGb\\\", \\\"company_configurations\\\".\\\"backupYear\\\" AS \\\"backupYear\\\", \\\"company_configurations\\\".\\\"backupMonth\\\" AS \\\"backupMonth\\\", \\\"service_tickets\\\".\\\"id\\\" AS \\\"id(service_tickets)\\\", \\\"service_tickets\\\".\\\"summary\\\" AS \\\"summary\\\", \\\"service_tickets\\\".\\\"recordType\\\" AS \\\"recordType\\\", \\\"service_tickets\\\".\\\"board.id\\\" AS \\\"board.id\\\", \\\"service_tickets\\\".\\\"board.name\\\" AS \\\"board.name\\\", \\\"service_tickets\\\".\\\"board._info.board_href\\\" AS \\\"board._info.board_href\\\", \\\"service_tickets\\\".\\\"status.id\\\" AS \\\"status.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.name\\\" AS \\\"status.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.Sort\\\" AS \\\"status.Sort\\\", \\\"service_tickets\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.id\\\" AS \\\"company.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.identifier\\\" AS \\\"company.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.name\\\" AS \\\"company.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.mobileGuid\\\" AS \\\"company._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"site.id\\\" AS \\\"site.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"site.name\\\" AS \\\"site.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.mobileGuid\\\" AS \\\"site._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"addressLine1\\\" AS \\\"addressLine1(service_tickets)\\\", \\\"service_tickets\\\".\\\"addressLine2\\\" AS \\\"addressLine2(service_tickets)\\\", \\\"service_tickets\\\".\\\"city\\\" AS \\\"city(service_tickets)\\\", \\\"service_tickets\\\".\\\"stateIdentifier\\\" AS \\\"stateIdentifier\\\", \\\"service_tickets\\\".\\\"zip\\\" AS \\\"zip(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.id\\\" AS \\\"contact.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.name\\\" AS \\\"contact.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact._info.mobileGuid\\\" AS \\\"contact._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"contactName\\\" AS \\\"contactName\\\", \\\"service_tickets\\\".\\\"contactPhoneNumber\\\" AS \\\"contactPhoneNumber\\\", \\\"service_tickets\\\".\\\"contactPhoneExtension\\\" AS \\\"contactPhoneExtension\\\", \\\"service_tickets\\\".\\\"contactEmailAddress\\\" AS \\\"contactEmailAddress\\\", \\\"service_tickets\\\".\\\"team.id\\\" AS \\\"team.id\\\", \\\"service_tickets\\\".\\\"team.name\\\" AS \\\"team.name\\\", \\\"service_tickets\\\".\\\"team._info.team_href\\\" AS \\\"team._info.team_href\\\", \\\"service_tickets\\\".\\\"priority.id\\\" AS \\\"priority.id\\\", \\\"service_tickets\\\".\\\"priority.name\\\" AS \\\"priority.name\\\", \\\"service_tickets\\\".\\\"priority.sort\\\" AS \\\"priority.sort\\\", \\\"service_tickets\\\".\\\"priority._info.priority_href\\\" AS \\\"priority._info.priority_href\\\", \\\"service_tickets\\\".\\\"priority._info.image_href\\\" AS \\\"priority._info.image_href\\\", \\\"service_tickets\\\".\\\"serviceLocation.id\\\" AS \\\"serviceLocation.id\\\", \\\"service_tickets\\\".\\\"serviceLocation.name\\\" AS \\\"serviceLocation.name\\\", \\\"service_tickets\\\".\\\"serviceLocation._info.location_href\\\" AS \\\"serviceLocation._info.location_href\\\", \\\"service_tickets\\\".\\\"source.id\\\" AS \\\"source.id\\\", \\\"service_tickets\\\".\\\"source.name\\\" AS \\\"source.name\\\", \\\"service_tickets\\\".\\\"source._info.source_href\\\" AS \\\"source._info.source_href\\\", \\\"service_tickets\\\".\\\"agreement.id\\\" AS \\\"agreement.id\\\", \\\"service_tickets\\\".\\\"agreement.name\\\" AS \\\"agreement.name\\\", \\\"service_tickets\\\".\\\"agreement._info.agreement_href\\\" AS \\\"agreement._info.agreement_href\\\", \\\"service_tickets\\\".\\\"severity\\\" AS \\\"severity\\\", \\\"service_tickets\\\".\\\"impact\\\" AS \\\"impact\\\", \\\"service_tickets\\\".\\\"allowAllClientsPortalView\\\" AS \\\"allowAllClientsPortalView\\\", \\\"service_tickets\\\".\\\"customerUpdatedFlag\\\" AS \\\"customerUpdatedFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailContactFlag\\\" AS \\\"automaticEmailContactFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailResourceFlag\\\" AS \\\"automaticEmailResourceFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailCcFlag\\\" AS \\\"automaticEmailCcFlag\\\", \\\"service_tickets\\\".\\\"closedDate\\\" AS \\\"closedDate\\\", \\\"service_tickets\\\".\\\"closedBy\\\" AS \\\"closedBy\\\", \\\"service_tickets\\\".\\\"closedFlag\\\" AS \\\"closedFlag\\\", \\\"service_tickets\\\".\\\"actualHours\\\" AS \\\"actualHours\\\", \\\"service_tickets\\\".\\\"approved\\\" AS \\\"approved\\\", \\\"service_tickets\\\".\\\"estimatedExpenseCost\\\" AS \\\"estimatedExpenseCost\\\", \\\"service_tickets\\\".\\\"estimatedExpenseRevenue\\\" AS \\\"estimatedExpenseRevenue\\\", \\\"service_tickets\\\".\\\"estimatedProductCost\\\" AS \\\"estimatedProductCost\\\", \\\"service_tickets\\\".\\\"estimatedProductRevenue\\\" AS \\\"estimatedProductRevenue\\\", \\\"service_tickets\\\".\\\"estimatedTimeCost\\\" AS \\\"estimatedTimeCost\\\", \\\"service_tickets\\\".\\\"estimatedTimeRevenue\\\" AS \\\"estimatedTimeRevenue\\\", \\\"service_tickets\\\".\\\"billingMethod\\\" AS \\\"billingMethod\\\", \\\"service_tickets\\\".\\\"dateResplan\\\" AS \\\"dateResplan\\\", \\\"service_tickets\\\".\\\"dateResponded\\\" AS \\\"dateResponded\\\", \\\"service_tickets\\\".\\\"resolveMinutes\\\" AS \\\"resolveMinutes\\\", \\\"service_tickets\\\".\\\"resPlanMinutes\\\" AS \\\"resPlanMinutes\\\", \\\"service_tickets\\\".\\\"respondMinutes\\\" AS \\\"respondMinutes\\\", \\\"service_tickets\\\".\\\"isInSla\\\" AS \\\"isInSla\\\", \\\"service_tickets\\\".\\\"hasChildTicket\\\" AS \\\"hasChildTicket\\\", \\\"service_tickets\\\".\\\"hasMergedChildTicketFlag\\\" AS \\\"hasMergedChildTicketFlag\\\", \\\"service_tickets\\\".\\\"billTime\\\" AS \\\"billTime\\\", \\\"service_tickets\\\".\\\"billExpenses\\\" AS \\\"billExpenses\\\", \\\"service_tickets\\\".\\\"billProducts\\\" AS \\\"billProducts\\\", \\\"service_tickets\\\".\\\"location.id\\\" AS \\\"location.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"location.name\\\" AS \\\"location.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.id\\\" AS \\\"department.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.identifier\\\" AS \\\"department.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.name\\\" AS \\\"department.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(service_tickets)\\\", \\\"service_tickets\\\".\\\"sla.id\\\" AS \\\"sla.id\\\", \\\"service_tickets\\\".\\\"sla.name\\\" AS \\\"sla.name\\\", \\\"service_tickets\\\".\\\"sla._info.sla_href\\\" AS \\\"sla._info.sla_href\\\", \\\"service_tickets\\\".\\\"currency.id\\\" AS \\\"currency.id\\\", \\\"service_tickets\\\".\\\"currency.symbol\\\" AS \\\"currency.symbol\\\", \\\"service_tickets\\\".\\\"currency.currencyCode\\\" AS \\\"currency.currencyCode\\\", \\\"service_tickets\\\".\\\"currency.decimalSeparator\\\" AS \\\"currency.decimalSeparator\\\", \\\"service_tickets\\\".\\\"currency.numberOfDecimals\\\" AS \\\"currency.numberOfDecimals\\\", \\\"service_tickets\\\".\\\"currency.thousandsSeparator\\\" AS \\\"currency.thousandsSeparator\\\", \\\"service_tickets\\\".\\\"currency.negativeParenthesesFlag\\\" AS \\\"currency.negativeParenthesesFlag\\\", \\\"service_tickets\\\".\\\"currency.displaySymbolFlag\\\" AS \\\"currency.displaySymbolFlag\\\", \\\"service_tickets\\\".\\\"currency.currencyIdentifier\\\" AS \\\"currency.currencyIdentifier\\\", \\\"service_tickets\\\".\\\"currency.displayIdFlag\\\" AS \\\"currency.displayIdFlag\\\", \\\"service_tickets\\\".\\\"currency.rightAlign\\\" AS \\\"currency.rightAlign\\\", \\\"service_tickets\\\".\\\"currency.name\\\" AS \\\"currency.name\\\", \\\"service_tickets\\\".\\\"currency._info.currency_href\\\" AS \\\"currency._info.currency_href\\\", \\\"service_tickets\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.scheduleentries_href\\\" AS \\\"_info.scheduleentries_href\\\", \\\"service_tickets\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.tasks_href\\\" AS \\\"_info.tasks_href\\\", \\\"service_tickets\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.products_href\\\" AS \\\"_info.products_href\\\", \\\"service_tickets\\\".\\\"_info.timeentries_href\\\" AS \\\"_info.timeentries_href\\\", \\\"service_tickets\\\".\\\"_info.expenseEntries_href\\\" AS \\\"_info.expenseEntries_href\\\", \\\"service_tickets\\\".\\\"escalationStartDateUTC\\\" AS \\\"escalationStartDateUTC\\\", \\\"service_tickets\\\".\\\"escalationLevel\\\" AS \\\"escalationLevel\\\", \\\"service_tickets\\\".\\\"minutesBeforeWaiting\\\" AS \\\"minutesBeforeWaiting\\\", \\\"service_tickets\\\".\\\"respondedSkippedMinutes\\\" AS \\\"respondedSkippedMinutes\\\", \\\"service_tickets\\\".\\\"resplanSkippedMinutes\\\" AS \\\"resplanSkippedMinutes\\\", \\\"service_tickets\\\".\\\"respondedHours\\\" AS \\\"respondedHours\\\", \\\"service_tickets\\\".\\\"respondedBy\\\" AS \\\"respondedBy\\\", \\\"service_tickets\\\".\\\"resplanHours\\\" AS \\\"resplanHours\\\", \\\"service_tickets\\\".\\\"resplanBy\\\" AS \\\"resplanBy\\\", \\\"service_tickets\\\".\\\"resolutionHours\\\" AS \\\"resolutionHours\\\", \\\"service_tickets\\\".\\\"minutesWaiting\\\" AS \\\"minutesWaiting\\\", \\\"service_tickets\\\".\\\"workType.id\\\" AS \\\"workType.id\\\", \\\"service_tickets\\\".\\\"workType.name\\\" AS \\\"workType.name\\\", \\\"service_tickets\\\".\\\"workType._info.workType_href\\\" AS \\\"workType._info.workType_href\\\", \\\"service_tickets\\\".\\\"resources\\\" AS \\\"resources\\\", \\\"service_tickets\\\".\\\"workRole.id\\\" AS \\\"workRole.id\\\", \\\"service_tickets\\\".\\\"workRole.name\\\" AS \\\"workRole.name\\\", \\\"service_tickets\\\".\\\"workRole._info.workRole_href\\\" AS \\\"workRole._info.workRole_href\\\", \\\"service_tickets\\\".\\\"type.id\\\" AS \\\"type.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"type.name\\\" AS \\\"type.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"requiredDate\\\" AS \\\"requiredDate\\\", \\\"service_tickets\\\".\\\"budgetHours\\\" AS \\\"budgetHours\\\", \\\"service_tickets\\\".\\\"requestForChangeFlag\\\" AS \\\"requestForChangeFlag\\\" FROM \\\"PJ-23\\\".\\\"company_companies\\\" AS \\\"company_companies\\\" INNER JOIN \\\"PJ-23\\\".\\\"company_configurations\\\" AS \\\"company_configurations\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"company_configurations\\\".\\\"id\\\" INNER JOIN \\\"PJ-23\\\".\\\"service_tickets\\\" AS \\\"service_tickets\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"service_tickets\\\".\\\"id\\\") temp_table ORDER BY \\\"CNTD(id(service_tickets))\\\" ASC NULLS FIRST",
      "col_data": [],
      "row_data": [
          " \"CNTD(id(service_tickets))\""
      ],
      "sheet_query_data": {
          "columns_data": [],
          "rows_data": [
              {
                  "column": "CNTD(id(service_tickets))",
                  "data": [
                      2
                  ]
              }
          ]
      }
  },
  {
      "sheet_id": 10974,
      "sheet_name": "Total Employees",
      "chart_id": 25,
      "sheet_tag_name": "<p>Total Employees</p>",
      "sheet_data": null,
      "created_by": 17,
      "sheet_filter_ids": [],
      "sheet_filter_quereyset_ids": "11090",
      "datasource_queryset_id": null,
      "filters_data": [],
      "custom_query": "SELECT COUNT(DISTINCT \\\"numberOfEmployees\\\") AS \\\"CNTD(numberOfEmployees)\\\" FROM (SELECT \\\"company_companies\\\".\\\"id\\\" AS \\\"id\\\", \\\"company_companies\\\".\\\"identifier\\\" AS \\\"identifier\\\", \\\"company_companies\\\".\\\"name\\\" AS \\\"name\\\", \\\"company_companies\\\".\\\"status.id\\\" AS \\\"status.id\\\", \\\"company_companies\\\".\\\"status.name\\\" AS \\\"status.name\\\", \\\"company_companies\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href\\\", \\\"company_companies\\\".\\\"country.id\\\" AS \\\"country.id\\\", \\\"company_companies\\\".\\\"country.name\\\" AS \\\"country.name\\\", \\\"company_companies\\\".\\\"country._info.country_href\\\" AS \\\"country._info.country_href\\\", \\\"company_companies\\\".\\\"phoneNumber\\\" AS \\\"phoneNumber\\\", \\\"company_companies\\\".\\\"website\\\" AS \\\"website\\\", \\\"company_companies\\\".\\\"territory.id\\\" AS \\\"territory.id\\\", \\\"company_companies\\\".\\\"territory.name\\\" AS \\\"territory.name\\\", \\\"company_companies\\\".\\\"territory._info.location_href\\\" AS \\\"territory._info.location_href\\\", \\\"company_companies\\\".\\\"market.id\\\" AS \\\"market.id\\\", \\\"company_companies\\\".\\\"market.name\\\" AS \\\"market.name\\\", \\\"company_companies\\\".\\\"market._info.Market_href\\\" AS \\\"market._info.Market_href\\\", \\\"company_companies\\\".\\\"defaultContact.id\\\" AS \\\"defaultContact.id\\\", \\\"company_companies\\\".\\\"defaultContact.name\\\" AS \\\"defaultContact.name\\\", \\\"company_companies\\\".\\\"defaultContact._info.contact_href\\\" AS \\\"defaultContact._info.contact_href\\\", \\\"company_companies\\\".\\\"dateAcquired\\\" AS \\\"dateAcquired\\\", \\\"company_companies\\\".\\\"annualRevenue\\\" AS \\\"annualRevenue\\\", \\\"company_companies\\\".\\\"timeZoneSetup.id\\\" AS \\\"timeZoneSetup.id\\\", \\\"company_companies\\\".\\\"timeZoneSetup.name\\\" AS \\\"timeZoneSetup.name\\\", \\\"company_companies\\\".\\\"timeZoneSetup._info.timeZoneSetup_href\\\" AS \\\"timeZoneSetup._info.timeZoneSetup_href\\\", \\\"company_companies\\\".\\\"leadFlag\\\" AS \\\"leadFlag\\\", \\\"company_companies\\\".\\\"unsubscribeFlag\\\" AS \\\"unsubscribeFlag\\\", \\\"company_companies\\\".\\\"taxCode.id\\\" AS \\\"taxCode.id\\\", \\\"company_companies\\\".\\\"taxCode.name\\\" AS \\\"taxCode.name\\\", \\\"company_companies\\\".\\\"taxCode._info.taxCode_href\\\" AS \\\"taxCode._info.taxCode_href\\\", \\\"company_companies\\\".\\\"billingTerms.id\\\" AS \\\"billingTerms.id\\\", \\\"company_companies\\\".\\\"billingTerms.name\\\" AS \\\"billingTerms.name\\\", \\\"company_companies\\\".\\\"billToCompany.id\\\" AS \\\"billToCompany.id\\\", \\\"company_companies\\\".\\\"billToCompany.identifier\\\" AS \\\"billToCompany.identifier\\\", \\\"company_companies\\\".\\\"billToCompany.name\\\" AS \\\"billToCompany.name\\\", \\\"company_companies\\\".\\\"billToCompany._info.company_href\\\" AS \\\"billToCompany._info.company_href\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.id\\\" AS \\\"invoiceDeliveryMethod.id\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.name\\\" AS \\\"invoiceDeliveryMethod.name\\\", \\\"company_companies\\\".\\\"deletedFlag\\\" AS \\\"deletedFlag\\\", \\\"company_companies\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid\\\", \\\"company_companies\\\".\\\"isVendorFlag\\\" AS \\\"isVendorFlag\\\", \\\"company_companies\\\".\\\"types[0].id\\\" AS \\\"types[0].id\\\", \\\"company_companies\\\".\\\"types[0].name\\\" AS \\\"types[0].name\\\", \\\"company_companies\\\".\\\"types[0]._info.type_href\\\" AS \\\"types[0]._info.type_href\\\", \\\"company_companies\\\".\\\"site.id\\\" AS \\\"site.id\\\", \\\"company_companies\\\".\\\"site.name\\\" AS \\\"site.name\\\", \\\"company_companies\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href\\\", \\\"company_companies\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated\\\", \\\"company_companies\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy\\\", \\\"company_companies\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered\\\", \\\"company_companies\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy\\\", \\\"company_companies\\\".\\\"_info.contacts_href\\\" AS \\\"_info.contacts_href\\\", \\\"company_companies\\\".\\\"_info.agreements_href\\\" AS \\\"_info.agreements_href\\\", \\\"company_companies\\\".\\\"_info.tickets_href\\\" AS \\\"_info.tickets_href\\\", \\\"company_companies\\\".\\\"_info.opportunities_href\\\" AS \\\"_info.opportunities_href\\\", \\\"company_companies\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href\\\", \\\"company_companies\\\".\\\"_info.projects_href\\\" AS \\\"_info.projects_href\\\", \\\"company_companies\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href\\\", \\\"company_companies\\\".\\\"_info.orders_href\\\" AS \\\"_info.orders_href\\\", \\\"company_companies\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href\\\", \\\"company_companies\\\".\\\"_info.sites_href\\\" AS \\\"_info.sites_href\\\", \\\"company_companies\\\".\\\"_info.teams_href\\\" AS \\\"_info.teams_href\\\", \\\"company_companies\\\".\\\"_info.reports_href\\\" AS \\\"_info.reports_href\\\", \\\"company_companies\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href\\\", \\\"company_companies\\\".\\\"addressLine1\\\" AS \\\"addressLine1\\\", \\\"company_companies\\\".\\\"addressLine2\\\" AS \\\"addressLine2\\\", \\\"company_companies\\\".\\\"city\\\" AS \\\"city\\\", \\\"company_companies\\\".\\\"state\\\" AS \\\"state\\\", \\\"company_companies\\\".\\\"zip\\\" AS \\\"zip\\\", \\\"company_companies\\\".\\\"faxNumber\\\" AS \\\"faxNumber\\\", \\\"company_companies\\\".\\\"accountNumber\\\" AS \\\"accountNumber\\\", \\\"company_companies\\\".\\\"numberOfEmployees\\\" AS \\\"numberOfEmployees\\\", \\\"company_companies\\\".\\\"leadSource\\\" AS \\\"leadSource\\\", \\\"company_companies\\\".\\\"billingContact.id\\\" AS \\\"billingContact.id\\\", \\\"company_companies\\\".\\\"billingContact.name\\\" AS \\\"billingContact.name\\\", \\\"company_companies\\\".\\\"billingContact._info.contact_href\\\" AS \\\"billingContact._info.contact_href\\\", \\\"company_companies\\\".\\\"invoiceToEmailAddress\\\" AS \\\"invoiceToEmailAddress\\\", \\\"company_companies\\\".\\\"billingSite.id\\\" AS \\\"billingSite.id\\\", \\\"company_companies\\\".\\\"billingSite.name\\\" AS \\\"billingSite.name\\\", \\\"company_companies\\\".\\\"billingSite._info.site_href\\\" AS \\\"billingSite._info.site_href\\\", \\\"company_configurations\\\".\\\"id\\\" AS \\\"id(company_configurations)\\\", \\\"company_configurations\\\".\\\"name\\\" AS \\\"name(company_configurations)\\\", \\\"company_configurations\\\".\\\"type.id\\\" AS \\\"type.id\\\", \\\"company_configurations\\\".\\\"type.name\\\" AS \\\"type.name\\\", \\\"company_configurations\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href\\\", \\\"company_configurations\\\".\\\"status.id\\\" AS \\\"status.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"status.name\\\" AS \\\"status.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"company.id\\\" AS \\\"company.id\\\", \\\"company_configurations\\\".\\\"company.identifier\\\" AS \\\"company.identifier\\\", \\\"company_configurations\\\".\\\"company.name\\\" AS \\\"company.name\\\", \\\"company_configurations\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href\\\", \\\"company_configurations\\\".\\\"contact.id\\\" AS \\\"contact.id\\\", \\\"company_configurations\\\".\\\"contact.name\\\" AS \\\"contact.name\\\", \\\"company_configurations\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href\\\", \\\"company_configurations\\\".\\\"site.id\\\" AS \\\"site.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"site.name\\\" AS \\\"site.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"locationId\\\" AS \\\"locationId\\\", \\\"company_configurations\\\".\\\"location.id\\\" AS \\\"location.id\\\", \\\"company_configurations\\\".\\\"location.name\\\" AS \\\"location.name\\\", \\\"company_configurations\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href\\\", \\\"company_configurations\\\".\\\"businessUnitId\\\" AS \\\"businessUnitId\\\", \\\"company_configurations\\\".\\\"department.id\\\" AS \\\"department.id\\\", \\\"company_configurations\\\".\\\"department.identifier\\\" AS \\\"department.identifier\\\", \\\"company_configurations\\\".\\\"department.name\\\" AS \\\"department.name\\\", \\\"company_configurations\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href\\\", \\\"company_configurations\\\".\\\"serialNumber\\\" AS \\\"serialNumber\\\", \\\"company_configurations\\\".\\\"modelNumber\\\" AS \\\"modelNumber\\\", \\\"company_configurations\\\".\\\"tagNumber\\\" AS \\\"tagNumber\\\", \\\"company_configurations\\\".\\\"warrantyExpirationDate\\\" AS \\\"warrantyExpirationDate\\\", \\\"company_configurations\\\".\\\"notes\\\" AS \\\"notes\\\", \\\"company_configurations\\\".\\\"billFlag\\\" AS \\\"billFlag\\\", \\\"company_configurations\\\".\\\"vendor.id\\\" AS \\\"vendor.id\\\", \\\"company_configurations\\\".\\\"vendor.identifier\\\" AS \\\"vendor.identifier\\\", \\\"company_configurations\\\".\\\"vendor.name\\\" AS \\\"vendor.name\\\", \\\"company_configurations\\\".\\\"vendor._info.company_href\\\" AS \\\"vendor._info.company_href\\\", \\\"company_configurations\\\".\\\"activeFlag\\\" AS \\\"activeFlag\\\", \\\"company_configurations\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(company_configurations)\\\", \\\"company_configurations\\\".\\\"companyLocationId\\\" AS \\\"companyLocationId\\\", \\\"company_configurations\\\".\\\"showRemoteFlag\\\" AS \\\"showRemoteFlag\\\", \\\"company_configurations\\\".\\\"showAutomateFlag\\\" AS \\\"showAutomateFlag\\\", \\\"company_configurations\\\".\\\"needsRenewalFlag\\\" AS \\\"needsRenewalFlag\\\", \\\"company_configurations\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"backupSuccesses\\\" AS \\\"backupSuccesses\\\", \\\"company_configurations\\\".\\\"backupIncomplete\\\" AS \\\"backupIncomplete\\\", \\\"company_configurations\\\".\\\"backupFailed\\\" AS \\\"backupFailed\\\", \\\"company_configurations\\\".\\\"backupRestores\\\" AS \\\"backupRestores\\\", \\\"company_configurations\\\".\\\"backupBillableSpaceGb\\\" AS \\\"backupBillableSpaceGb\\\", \\\"company_configurations\\\".\\\"backupYear\\\" AS \\\"backupYear\\\", \\\"company_configurations\\\".\\\"backupMonth\\\" AS \\\"backupMonth\\\", \\\"service_tickets\\\".\\\"id\\\" AS \\\"id(service_tickets)\\\", \\\"service_tickets\\\".\\\"summary\\\" AS \\\"summary\\\", \\\"service_tickets\\\".\\\"recordType\\\" AS \\\"recordType\\\", \\\"service_tickets\\\".\\\"board.id\\\" AS \\\"board.id\\\", \\\"service_tickets\\\".\\\"board.name\\\" AS \\\"board.name\\\", \\\"service_tickets\\\".\\\"board._info.board_href\\\" AS \\\"board._info.board_href\\\", \\\"service_tickets\\\".\\\"status.id\\\" AS \\\"status.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.name\\\" AS \\\"status.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.Sort\\\" AS \\\"status.Sort\\\", \\\"service_tickets\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.id\\\" AS \\\"company.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.identifier\\\" AS \\\"company.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.name\\\" AS \\\"company.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.mobileGuid\\\" AS \\\"company._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"site.id\\\" AS \\\"site.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"site.name\\\" AS \\\"site.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.mobileGuid\\\" AS \\\"site._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"addressLine1\\\" AS \\\"addressLine1(service_tickets)\\\", \\\"service_tickets\\\".\\\"addressLine2\\\" AS \\\"addressLine2(service_tickets)\\\", \\\"service_tickets\\\".\\\"city\\\" AS \\\"city(service_tickets)\\\", \\\"service_tickets\\\".\\\"stateIdentifier\\\" AS \\\"stateIdentifier\\\", \\\"service_tickets\\\".\\\"zip\\\" AS \\\"zip(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.id\\\" AS \\\"contact.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.name\\\" AS \\\"contact.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact._info.mobileGuid\\\" AS \\\"contact._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"contactName\\\" AS \\\"contactName\\\", \\\"service_tickets\\\".\\\"contactPhoneNumber\\\" AS \\\"contactPhoneNumber\\\", \\\"service_tickets\\\".\\\"contactPhoneExtension\\\" AS \\\"contactPhoneExtension\\\", \\\"service_tickets\\\".\\\"contactEmailAddress\\\" AS \\\"contactEmailAddress\\\", \\\"service_tickets\\\".\\\"team.id\\\" AS \\\"team.id\\\", \\\"service_tickets\\\".\\\"team.name\\\" AS \\\"team.name\\\", \\\"service_tickets\\\".\\\"team._info.team_href\\\" AS \\\"team._info.team_href\\\", \\\"service_tickets\\\".\\\"priority.id\\\" AS \\\"priority.id\\\", \\\"service_tickets\\\".\\\"priority.name\\\" AS \\\"priority.name\\\", \\\"service_tickets\\\".\\\"priority.sort\\\" AS \\\"priority.sort\\\", \\\"service_tickets\\\".\\\"priority._info.priority_href\\\" AS \\\"priority._info.priority_href\\\", \\\"service_tickets\\\".\\\"priority._info.image_href\\\" AS \\\"priority._info.image_href\\\", \\\"service_tickets\\\".\\\"serviceLocation.id\\\" AS \\\"serviceLocation.id\\\", \\\"service_tickets\\\".\\\"serviceLocation.name\\\" AS \\\"serviceLocation.name\\\", \\\"service_tickets\\\".\\\"serviceLocation._info.location_href\\\" AS \\\"serviceLocation._info.location_href\\\", \\\"service_tickets\\\".\\\"source.id\\\" AS \\\"source.id\\\", \\\"service_tickets\\\".\\\"source.name\\\" AS \\\"source.name\\\", \\\"service_tickets\\\".\\\"source._info.source_href\\\" AS \\\"source._info.source_href\\\", \\\"service_tickets\\\".\\\"agreement.id\\\" AS \\\"agreement.id\\\", \\\"service_tickets\\\".\\\"agreement.name\\\" AS \\\"agreement.name\\\", \\\"service_tickets\\\".\\\"agreement._info.agreement_href\\\" AS \\\"agreement._info.agreement_href\\\", \\\"service_tickets\\\".\\\"severity\\\" AS \\\"severity\\\", \\\"service_tickets\\\".\\\"impact\\\" AS \\\"impact\\\", \\\"service_tickets\\\".\\\"allowAllClientsPortalView\\\" AS \\\"allowAllClientsPortalView\\\", \\\"service_tickets\\\".\\\"customerUpdatedFlag\\\" AS \\\"customerUpdatedFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailContactFlag\\\" AS \\\"automaticEmailContactFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailResourceFlag\\\" AS \\\"automaticEmailResourceFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailCcFlag\\\" AS \\\"automaticEmailCcFlag\\\", \\\"service_tickets\\\".\\\"closedDate\\\" AS \\\"closedDate\\\", \\\"service_tickets\\\".\\\"closedBy\\\" AS \\\"closedBy\\\", \\\"service_tickets\\\".\\\"closedFlag\\\" AS \\\"closedFlag\\\", \\\"service_tickets\\\".\\\"actualHours\\\" AS \\\"actualHours\\\", \\\"service_tickets\\\".\\\"approved\\\" AS \\\"approved\\\", \\\"service_tickets\\\".\\\"estimatedExpenseCost\\\" AS \\\"estimatedExpenseCost\\\", \\\"service_tickets\\\".\\\"estimatedExpenseRevenue\\\" AS \\\"estimatedExpenseRevenue\\\", \\\"service_tickets\\\".\\\"estimatedProductCost\\\" AS \\\"estimatedProductCost\\\", \\\"service_tickets\\\".\\\"estimatedProductRevenue\\\" AS \\\"estimatedProductRevenue\\\", \\\"service_tickets\\\".\\\"estimatedTimeCost\\\" AS \\\"estimatedTimeCost\\\", \\\"service_tickets\\\".\\\"estimatedTimeRevenue\\\" AS \\\"estimatedTimeRevenue\\\", \\\"service_tickets\\\".\\\"billingMethod\\\" AS \\\"billingMethod\\\", \\\"service_tickets\\\".\\\"dateResplan\\\" AS \\\"dateResplan\\\", \\\"service_tickets\\\".\\\"dateResponded\\\" AS \\\"dateResponded\\\", \\\"service_tickets\\\".\\\"resolveMinutes\\\" AS \\\"resolveMinutes\\\", \\\"service_tickets\\\".\\\"resPlanMinutes\\\" AS \\\"resPlanMinutes\\\", \\\"service_tickets\\\".\\\"respondMinutes\\\" AS \\\"respondMinutes\\\", \\\"service_tickets\\\".\\\"isInSla\\\" AS \\\"isInSla\\\", \\\"service_tickets\\\".\\\"hasChildTicket\\\" AS \\\"hasChildTicket\\\", \\\"service_tickets\\\".\\\"hasMergedChildTicketFlag\\\" AS \\\"hasMergedChildTicketFlag\\\", \\\"service_tickets\\\".\\\"billTime\\\" AS \\\"billTime\\\", \\\"service_tickets\\\".\\\"billExpenses\\\" AS \\\"billExpenses\\\", \\\"service_tickets\\\".\\\"billProducts\\\" AS \\\"billProducts\\\", \\\"service_tickets\\\".\\\"location.id\\\" AS \\\"location.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"location.name\\\" AS \\\"location.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.id\\\" AS \\\"department.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.identifier\\\" AS \\\"department.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.name\\\" AS \\\"department.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(service_tickets)\\\", \\\"service_tickets\\\".\\\"sla.id\\\" AS \\\"sla.id\\\", \\\"service_tickets\\\".\\\"sla.name\\\" AS \\\"sla.name\\\", \\\"service_tickets\\\".\\\"sla._info.sla_href\\\" AS \\\"sla._info.sla_href\\\", \\\"service_tickets\\\".\\\"currency.id\\\" AS \\\"currency.id\\\", \\\"service_tickets\\\".\\\"currency.symbol\\\" AS \\\"currency.symbol\\\", \\\"service_tickets\\\".\\\"currency.currencyCode\\\" AS \\\"currency.currencyCode\\\", \\\"service_tickets\\\".\\\"currency.decimalSeparator\\\" AS \\\"currency.decimalSeparator\\\", \\\"service_tickets\\\".\\\"currency.numberOfDecimals\\\" AS \\\"currency.numberOfDecimals\\\", \\\"service_tickets\\\".\\\"currency.thousandsSeparator\\\" AS \\\"currency.thousandsSeparator\\\", \\\"service_tickets\\\".\\\"currency.negativeParenthesesFlag\\\" AS \\\"currency.negativeParenthesesFlag\\\", \\\"service_tickets\\\".\\\"currency.displaySymbolFlag\\\" AS \\\"currency.displaySymbolFlag\\\", \\\"service_tickets\\\".\\\"currency.currencyIdentifier\\\" AS \\\"currency.currencyIdentifier\\\", \\\"service_tickets\\\".\\\"currency.displayIdFlag\\\" AS \\\"currency.displayIdFlag\\\", \\\"service_tickets\\\".\\\"currency.rightAlign\\\" AS \\\"currency.rightAlign\\\", \\\"service_tickets\\\".\\\"currency.name\\\" AS \\\"currency.name\\\", \\\"service_tickets\\\".\\\"currency._info.currency_href\\\" AS \\\"currency._info.currency_href\\\", \\\"service_tickets\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.scheduleentries_href\\\" AS \\\"_info.scheduleentries_href\\\", \\\"service_tickets\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.tasks_href\\\" AS \\\"_info.tasks_href\\\", \\\"service_tickets\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.products_href\\\" AS \\\"_info.products_href\\\", \\\"service_tickets\\\".\\\"_info.timeentries_href\\\" AS \\\"_info.timeentries_href\\\", \\\"service_tickets\\\".\\\"_info.expenseEntries_href\\\" AS \\\"_info.expenseEntries_href\\\", \\\"service_tickets\\\".\\\"escalationStartDateUTC\\\" AS \\\"escalationStartDateUTC\\\", \\\"service_tickets\\\".\\\"escalationLevel\\\" AS \\\"escalationLevel\\\", \\\"service_tickets\\\".\\\"minutesBeforeWaiting\\\" AS \\\"minutesBeforeWaiting\\\", \\\"service_tickets\\\".\\\"respondedSkippedMinutes\\\" AS \\\"respondedSkippedMinutes\\\", \\\"service_tickets\\\".\\\"resplanSkippedMinutes\\\" AS \\\"resplanSkippedMinutes\\\", \\\"service_tickets\\\".\\\"respondedHours\\\" AS \\\"respondedHours\\\", \\\"service_tickets\\\".\\\"respondedBy\\\" AS \\\"respondedBy\\\", \\\"service_tickets\\\".\\\"resplanHours\\\" AS \\\"resplanHours\\\", \\\"service_tickets\\\".\\\"resplanBy\\\" AS \\\"resplanBy\\\", \\\"service_tickets\\\".\\\"resolutionHours\\\" AS \\\"resolutionHours\\\", \\\"service_tickets\\\".\\\"minutesWaiting\\\" AS \\\"minutesWaiting\\\", \\\"service_tickets\\\".\\\"workType.id\\\" AS \\\"workType.id\\\", \\\"service_tickets\\\".\\\"workType.name\\\" AS \\\"workType.name\\\", \\\"service_tickets\\\".\\\"workType._info.workType_href\\\" AS \\\"workType._info.workType_href\\\", \\\"service_tickets\\\".\\\"resources\\\" AS \\\"resources\\\", \\\"service_tickets\\\".\\\"workRole.id\\\" AS \\\"workRole.id\\\", \\\"service_tickets\\\".\\\"workRole.name\\\" AS \\\"workRole.name\\\", \\\"service_tickets\\\".\\\"workRole._info.workRole_href\\\" AS \\\"workRole._info.workRole_href\\\", \\\"service_tickets\\\".\\\"type.id\\\" AS \\\"type.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"type.name\\\" AS \\\"type.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"requiredDate\\\" AS \\\"requiredDate\\\", \\\"service_tickets\\\".\\\"budgetHours\\\" AS \\\"budgetHours\\\", \\\"service_tickets\\\".\\\"requestForChangeFlag\\\" AS \\\"requestForChangeFlag\\\" FROM \\\"PJ-23\\\".\\\"company_companies\\\" AS \\\"company_companies\\\" INNER JOIN \\\"PJ-23\\\".\\\"company_configurations\\\" AS \\\"company_configurations\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"company_configurations\\\".\\\"id\\\" INNER JOIN \\\"PJ-23\\\".\\\"service_tickets\\\" AS \\\"service_tickets\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"service_tickets\\\".\\\"id\\\") temp_table ORDER BY \\\"CNTD(numberOfEmployees)\\\" ASC NULLS FIRST",
      "col_data": [],
      "row_data": [
          " \"CNTD(numberOfEmployees)\""
      ],
      "sheet_query_data": {
          "columns_data": [],
          "rows_data": [
              {
                  "column": "CNTD(numberOfEmployees)",
                  "data": [
                      1
                  ]
              }
          ]
      }
  },
  {
      "sheet_id": 10973,
      "sheet_name": "Company wise annual revenue",
      "chart_id": 24,
      "sheet_tag_name": "<p>Company wise annual revenue</p>",
      "sheet_data": null,
      "created_by": 17,
      "sheet_filter_ids": [],
      "sheet_filter_quereyset_ids": "11089",
      "datasource_queryset_id": null,
      "filters_data": [],
      "custom_query": "SELECT \\\"name\\\" AS \\\"name\\\", SUM(\\\"annualRevenue\\\") AS \\\"sum(annualRevenue)\\\" FROM (SELECT \\\"company_companies\\\".\\\"id\\\" AS \\\"id\\\", \\\"company_companies\\\".\\\"identifier\\\" AS \\\"identifier\\\", \\\"company_companies\\\".\\\"name\\\" AS \\\"name\\\", \\\"company_companies\\\".\\\"status.id\\\" AS \\\"status.id\\\", \\\"company_companies\\\".\\\"status.name\\\" AS \\\"status.name\\\", \\\"company_companies\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href\\\", \\\"company_companies\\\".\\\"country.id\\\" AS \\\"country.id\\\", \\\"company_companies\\\".\\\"country.name\\\" AS \\\"country.name\\\", \\\"company_companies\\\".\\\"country._info.country_href\\\" AS \\\"country._info.country_href\\\", \\\"company_companies\\\".\\\"phoneNumber\\\" AS \\\"phoneNumber\\\", \\\"company_companies\\\".\\\"website\\\" AS \\\"website\\\", \\\"company_companies\\\".\\\"territory.id\\\" AS \\\"territory.id\\\", \\\"company_companies\\\".\\\"territory.name\\\" AS \\\"territory.name\\\", \\\"company_companies\\\".\\\"territory._info.location_href\\\" AS \\\"territory._info.location_href\\\", \\\"company_companies\\\".\\\"market.id\\\" AS \\\"market.id\\\", \\\"company_companies\\\".\\\"market.name\\\" AS \\\"market.name\\\", \\\"company_companies\\\".\\\"market._info.Market_href\\\" AS \\\"market._info.Market_href\\\", \\\"company_companies\\\".\\\"defaultContact.id\\\" AS \\\"defaultContact.id\\\", \\\"company_companies\\\".\\\"defaultContact.name\\\" AS \\\"defaultContact.name\\\", \\\"company_companies\\\".\\\"defaultContact._info.contact_href\\\" AS \\\"defaultContact._info.contact_href\\\", \\\"company_companies\\\".\\\"dateAcquired\\\" AS \\\"dateAcquired\\\", \\\"company_companies\\\".\\\"annualRevenue\\\" AS \\\"annualRevenue\\\", \\\"company_companies\\\".\\\"timeZoneSetup.id\\\" AS \\\"timeZoneSetup.id\\\", \\\"company_companies\\\".\\\"timeZoneSetup.name\\\" AS \\\"timeZoneSetup.name\\\", \\\"company_companies\\\".\\\"timeZoneSetup._info.timeZoneSetup_href\\\" AS \\\"timeZoneSetup._info.timeZoneSetup_href\\\", \\\"company_companies\\\".\\\"leadFlag\\\" AS \\\"leadFlag\\\", \\\"company_companies\\\".\\\"unsubscribeFlag\\\" AS \\\"unsubscribeFlag\\\", \\\"company_companies\\\".\\\"taxCode.id\\\" AS \\\"taxCode.id\\\", \\\"company_companies\\\".\\\"taxCode.name\\\" AS \\\"taxCode.name\\\", \\\"company_companies\\\".\\\"taxCode._info.taxCode_href\\\" AS \\\"taxCode._info.taxCode_href\\\", \\\"company_companies\\\".\\\"billingTerms.id\\\" AS \\\"billingTerms.id\\\", \\\"company_companies\\\".\\\"billingTerms.name\\\" AS \\\"billingTerms.name\\\", \\\"company_companies\\\".\\\"billToCompany.id\\\" AS \\\"billToCompany.id\\\", \\\"company_companies\\\".\\\"billToCompany.identifier\\\" AS \\\"billToCompany.identifier\\\", \\\"company_companies\\\".\\\"billToCompany.name\\\" AS \\\"billToCompany.name\\\", \\\"company_companies\\\".\\\"billToCompany._info.company_href\\\" AS \\\"billToCompany._info.company_href\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.id\\\" AS \\\"invoiceDeliveryMethod.id\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.name\\\" AS \\\"invoiceDeliveryMethod.name\\\", \\\"company_companies\\\".\\\"deletedFlag\\\" AS \\\"deletedFlag\\\", \\\"company_companies\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid\\\", \\\"company_companies\\\".\\\"isVendorFlag\\\" AS \\\"isVendorFlag\\\", \\\"company_companies\\\".\\\"types[0].id\\\" AS \\\"types[0].id\\\", \\\"company_companies\\\".\\\"types[0].name\\\" AS \\\"types[0].name\\\", \\\"company_companies\\\".\\\"types[0]._info.type_href\\\" AS \\\"types[0]._info.type_href\\\", \\\"company_companies\\\".\\\"site.id\\\" AS \\\"site.id\\\", \\\"company_companies\\\".\\\"site.name\\\" AS \\\"site.name\\\", \\\"company_companies\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href\\\", \\\"company_companies\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated\\\", \\\"company_companies\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy\\\", \\\"company_companies\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered\\\", \\\"company_companies\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy\\\", \\\"company_companies\\\".\\\"_info.contacts_href\\\" AS \\\"_info.contacts_href\\\", \\\"company_companies\\\".\\\"_info.agreements_href\\\" AS \\\"_info.agreements_href\\\", \\\"company_companies\\\".\\\"_info.tickets_href\\\" AS \\\"_info.tickets_href\\\", \\\"company_companies\\\".\\\"_info.opportunities_href\\\" AS \\\"_info.opportunities_href\\\", \\\"company_companies\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href\\\", \\\"company_companies\\\".\\\"_info.projects_href\\\" AS \\\"_info.projects_href\\\", \\\"company_companies\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href\\\", \\\"company_companies\\\".\\\"_info.orders_href\\\" AS \\\"_info.orders_href\\\", \\\"company_companies\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href\\\", \\\"company_companies\\\".\\\"_info.sites_href\\\" AS \\\"_info.sites_href\\\", \\\"company_companies\\\".\\\"_info.teams_href\\\" AS \\\"_info.teams_href\\\", \\\"company_companies\\\".\\\"_info.reports_href\\\" AS \\\"_info.reports_href\\\", \\\"company_companies\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href\\\", \\\"company_companies\\\".\\\"addressLine1\\\" AS \\\"addressLine1\\\", \\\"company_companies\\\".\\\"addressLine2\\\" AS \\\"addressLine2\\\", \\\"company_companies\\\".\\\"city\\\" AS \\\"city\\\", \\\"company_companies\\\".\\\"state\\\" AS \\\"state\\\", \\\"company_companies\\\".\\\"zip\\\" AS \\\"zip\\\", \\\"company_companies\\\".\\\"faxNumber\\\" AS \\\"faxNumber\\\", \\\"company_companies\\\".\\\"accountNumber\\\" AS \\\"accountNumber\\\", \\\"company_companies\\\".\\\"numberOfEmployees\\\" AS \\\"numberOfEmployees\\\", \\\"company_companies\\\".\\\"leadSource\\\" AS \\\"leadSource\\\", \\\"company_companies\\\".\\\"billingContact.id\\\" AS \\\"billingContact.id\\\", \\\"company_companies\\\".\\\"billingContact.name\\\" AS \\\"billingContact.name\\\", \\\"company_companies\\\".\\\"billingContact._info.contact_href\\\" AS \\\"billingContact._info.contact_href\\\", \\\"company_companies\\\".\\\"invoiceToEmailAddress\\\" AS \\\"invoiceToEmailAddress\\\", \\\"company_companies\\\".\\\"billingSite.id\\\" AS \\\"billingSite.id\\\", \\\"company_companies\\\".\\\"billingSite.name\\\" AS \\\"billingSite.name\\\", \\\"company_companies\\\".\\\"billingSite._info.site_href\\\" AS \\\"billingSite._info.site_href\\\", \\\"company_configurations\\\".\\\"id\\\" AS \\\"id(company_configurations)\\\", \\\"company_configurations\\\".\\\"name\\\" AS \\\"name(company_configurations)\\\", \\\"company_configurations\\\".\\\"type.id\\\" AS \\\"type.id\\\", \\\"company_configurations\\\".\\\"type.name\\\" AS \\\"type.name\\\", \\\"company_configurations\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href\\\", \\\"company_configurations\\\".\\\"status.id\\\" AS \\\"status.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"status.name\\\" AS \\\"status.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"company.id\\\" AS \\\"company.id\\\", \\\"company_configurations\\\".\\\"company.identifier\\\" AS \\\"company.identifier\\\", \\\"company_configurations\\\".\\\"company.name\\\" AS \\\"company.name\\\", \\\"company_configurations\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href\\\", \\\"company_configurations\\\".\\\"contact.id\\\" AS \\\"contact.id\\\", \\\"company_configurations\\\".\\\"contact.name\\\" AS \\\"contact.name\\\", \\\"company_configurations\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href\\\", \\\"company_configurations\\\".\\\"site.id\\\" AS \\\"site.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"site.name\\\" AS \\\"site.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"locationId\\\" AS \\\"locationId\\\", \\\"company_configurations\\\".\\\"location.id\\\" AS \\\"location.id\\\", \\\"company_configurations\\\".\\\"location.name\\\" AS \\\"location.name\\\", \\\"company_configurations\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href\\\", \\\"company_configurations\\\".\\\"businessUnitId\\\" AS \\\"businessUnitId\\\", \\\"company_configurations\\\".\\\"department.id\\\" AS \\\"department.id\\\", \\\"company_configurations\\\".\\\"department.identifier\\\" AS \\\"department.identifier\\\", \\\"company_configurations\\\".\\\"department.name\\\" AS \\\"department.name\\\", \\\"company_configurations\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href\\\", \\\"company_configurations\\\".\\\"serialNumber\\\" AS \\\"serialNumber\\\", \\\"company_configurations\\\".\\\"modelNumber\\\" AS \\\"modelNumber\\\", \\\"company_configurations\\\".\\\"tagNumber\\\" AS \\\"tagNumber\\\", \\\"company_configurations\\\".\\\"warrantyExpirationDate\\\" AS \\\"warrantyExpirationDate\\\", \\\"company_configurations\\\".\\\"notes\\\" AS \\\"notes\\\", \\\"company_configurations\\\".\\\"billFlag\\\" AS \\\"billFlag\\\", \\\"company_configurations\\\".\\\"vendor.id\\\" AS \\\"vendor.id\\\", \\\"company_configurations\\\".\\\"vendor.identifier\\\" AS \\\"vendor.identifier\\\", \\\"company_configurations\\\".\\\"vendor.name\\\" AS \\\"vendor.name\\\", \\\"company_configurations\\\".\\\"vendor._info.company_href\\\" AS \\\"vendor._info.company_href\\\", \\\"company_configurations\\\".\\\"activeFlag\\\" AS \\\"activeFlag\\\", \\\"company_configurations\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(company_configurations)\\\", \\\"company_configurations\\\".\\\"companyLocationId\\\" AS \\\"companyLocationId\\\", \\\"company_configurations\\\".\\\"showRemoteFlag\\\" AS \\\"showRemoteFlag\\\", \\\"company_configurations\\\".\\\"showAutomateFlag\\\" AS \\\"showAutomateFlag\\\", \\\"company_configurations\\\".\\\"needsRenewalFlag\\\" AS \\\"needsRenewalFlag\\\", \\\"company_configurations\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"backupSuccesses\\\" AS \\\"backupSuccesses\\\", \\\"company_configurations\\\".\\\"backupIncomplete\\\" AS \\\"backupIncomplete\\\", \\\"company_configurations\\\".\\\"backupFailed\\\" AS \\\"backupFailed\\\", \\\"company_configurations\\\".\\\"backupRestores\\\" AS \\\"backupRestores\\\", \\\"company_configurations\\\".\\\"backupBillableSpaceGb\\\" AS \\\"backupBillableSpaceGb\\\", \\\"company_configurations\\\".\\\"backupYear\\\" AS \\\"backupYear\\\", \\\"company_configurations\\\".\\\"backupMonth\\\" AS \\\"backupMonth\\\", \\\"service_tickets\\\".\\\"id\\\" AS \\\"id(service_tickets)\\\", \\\"service_tickets\\\".\\\"summary\\\" AS \\\"summary\\\", \\\"service_tickets\\\".\\\"recordType\\\" AS \\\"recordType\\\", \\\"service_tickets\\\".\\\"board.id\\\" AS \\\"board.id\\\", \\\"service_tickets\\\".\\\"board.name\\\" AS \\\"board.name\\\", \\\"service_tickets\\\".\\\"board._info.board_href\\\" AS \\\"board._info.board_href\\\", \\\"service_tickets\\\".\\\"status.id\\\" AS \\\"status.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.name\\\" AS \\\"status.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.Sort\\\" AS \\\"status.Sort\\\", \\\"service_tickets\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.id\\\" AS \\\"company.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.identifier\\\" AS \\\"company.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.name\\\" AS \\\"company.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.mobileGuid\\\" AS \\\"company._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"site.id\\\" AS \\\"site.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"site.name\\\" AS \\\"site.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.mobileGuid\\\" AS \\\"site._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"addressLine1\\\" AS \\\"addressLine1(service_tickets)\\\", \\\"service_tickets\\\".\\\"addressLine2\\\" AS \\\"addressLine2(service_tickets)\\\", \\\"service_tickets\\\".\\\"city\\\" AS \\\"city(service_tickets)\\\", \\\"service_tickets\\\".\\\"stateIdentifier\\\" AS \\\"stateIdentifier\\\", \\\"service_tickets\\\".\\\"zip\\\" AS \\\"zip(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.id\\\" AS \\\"contact.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.name\\\" AS \\\"contact.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact._info.mobileGuid\\\" AS \\\"contact._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"contactName\\\" AS \\\"contactName\\\", \\\"service_tickets\\\".\\\"contactPhoneNumber\\\" AS \\\"contactPhoneNumber\\\", \\\"service_tickets\\\".\\\"contactPhoneExtension\\\" AS \\\"contactPhoneExtension\\\", \\\"service_tickets\\\".\\\"contactEmailAddress\\\" AS \\\"contactEmailAddress\\\", \\\"service_tickets\\\".\\\"team.id\\\" AS \\\"team.id\\\", \\\"service_tickets\\\".\\\"team.name\\\" AS \\\"team.name\\\", \\\"service_tickets\\\".\\\"team._info.team_href\\\" AS \\\"team._info.team_href\\\", \\\"service_tickets\\\".\\\"priority.id\\\" AS \\\"priority.id\\\", \\\"service_tickets\\\".\\\"priority.name\\\" AS \\\"priority.name\\\", \\\"service_tickets\\\".\\\"priority.sort\\\" AS \\\"priority.sort\\\", \\\"service_tickets\\\".\\\"priority._info.priority_href\\\" AS \\\"priority._info.priority_href\\\", \\\"service_tickets\\\".\\\"priority._info.image_href\\\" AS \\\"priority._info.image_href\\\", \\\"service_tickets\\\".\\\"serviceLocation.id\\\" AS \\\"serviceLocation.id\\\", \\\"service_tickets\\\".\\\"serviceLocation.name\\\" AS \\\"serviceLocation.name\\\", \\\"service_tickets\\\".\\\"serviceLocation._info.location_href\\\" AS \\\"serviceLocation._info.location_href\\\", \\\"service_tickets\\\".\\\"source.id\\\" AS \\\"source.id\\\", \\\"service_tickets\\\".\\\"source.name\\\" AS \\\"source.name\\\", \\\"service_tickets\\\".\\\"source._info.source_href\\\" AS \\\"source._info.source_href\\\", \\\"service_tickets\\\".\\\"agreement.id\\\" AS \\\"agreement.id\\\", \\\"service_tickets\\\".\\\"agreement.name\\\" AS \\\"agreement.name\\\", \\\"service_tickets\\\".\\\"agreement._info.agreement_href\\\" AS \\\"agreement._info.agreement_href\\\", \\\"service_tickets\\\".\\\"severity\\\" AS \\\"severity\\\", \\\"service_tickets\\\".\\\"impact\\\" AS \\\"impact\\\", \\\"service_tickets\\\".\\\"allowAllClientsPortalView\\\" AS \\\"allowAllClientsPortalView\\\", \\\"service_tickets\\\".\\\"customerUpdatedFlag\\\" AS \\\"customerUpdatedFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailContactFlag\\\" AS \\\"automaticEmailContactFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailResourceFlag\\\" AS \\\"automaticEmailResourceFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailCcFlag\\\" AS \\\"automaticEmailCcFlag\\\", \\\"service_tickets\\\".\\\"closedDate\\\" AS \\\"closedDate\\\", \\\"service_tickets\\\".\\\"closedBy\\\" AS \\\"closedBy\\\", \\\"service_tickets\\\".\\\"closedFlag\\\" AS \\\"closedFlag\\\", \\\"service_tickets\\\".\\\"actualHours\\\" AS \\\"actualHours\\\", \\\"service_tickets\\\".\\\"approved\\\" AS \\\"approved\\\", \\\"service_tickets\\\".\\\"estimatedExpenseCost\\\" AS \\\"estimatedExpenseCost\\\", \\\"service_tickets\\\".\\\"estimatedExpenseRevenue\\\" AS \\\"estimatedExpenseRevenue\\\", \\\"service_tickets\\\".\\\"estimatedProductCost\\\" AS \\\"estimatedProductCost\\\", \\\"service_tickets\\\".\\\"estimatedProductRevenue\\\" AS \\\"estimatedProductRevenue\\\", \\\"service_tickets\\\".\\\"estimatedTimeCost\\\" AS \\\"estimatedTimeCost\\\", \\\"service_tickets\\\".\\\"estimatedTimeRevenue\\\" AS \\\"estimatedTimeRevenue\\\", \\\"service_tickets\\\".\\\"billingMethod\\\" AS \\\"billingMethod\\\", \\\"service_tickets\\\".\\\"dateResplan\\\" AS \\\"dateResplan\\\", \\\"service_tickets\\\".\\\"dateResponded\\\" AS \\\"dateResponded\\\", \\\"service_tickets\\\".\\\"resolveMinutes\\\" AS \\\"resolveMinutes\\\", \\\"service_tickets\\\".\\\"resPlanMinutes\\\" AS \\\"resPlanMinutes\\\", \\\"service_tickets\\\".\\\"respondMinutes\\\" AS \\\"respondMinutes\\\", \\\"service_tickets\\\".\\\"isInSla\\\" AS \\\"isInSla\\\", \\\"service_tickets\\\".\\\"hasChildTicket\\\" AS \\\"hasChildTicket\\\", \\\"service_tickets\\\".\\\"hasMergedChildTicketFlag\\\" AS \\\"hasMergedChildTicketFlag\\\", \\\"service_tickets\\\".\\\"billTime\\\" AS \\\"billTime\\\", \\\"service_tickets\\\".\\\"billExpenses\\\" AS \\\"billExpenses\\\", \\\"service_tickets\\\".\\\"billProducts\\\" AS \\\"billProducts\\\", \\\"service_tickets\\\".\\\"location.id\\\" AS \\\"location.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"location.name\\\" AS \\\"location.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.id\\\" AS \\\"department.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.identifier\\\" AS \\\"department.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.name\\\" AS \\\"department.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(service_tickets)\\\", \\\"service_tickets\\\".\\\"sla.id\\\" AS \\\"sla.id\\\", \\\"service_tickets\\\".\\\"sla.name\\\" AS \\\"sla.name\\\", \\\"service_tickets\\\".\\\"sla._info.sla_href\\\" AS \\\"sla._info.sla_href\\\", \\\"service_tickets\\\".\\\"currency.id\\\" AS \\\"currency.id\\\", \\\"service_tickets\\\".\\\"currency.symbol\\\" AS \\\"currency.symbol\\\", \\\"service_tickets\\\".\\\"currency.currencyCode\\\" AS \\\"currency.currencyCode\\\", \\\"service_tickets\\\".\\\"currency.decimalSeparator\\\" AS \\\"currency.decimalSeparator\\\", \\\"service_tickets\\\".\\\"currency.numberOfDecimals\\\" AS \\\"currency.numberOfDecimals\\\", \\\"service_tickets\\\".\\\"currency.thousandsSeparator\\\" AS \\\"currency.thousandsSeparator\\\", \\\"service_tickets\\\".\\\"currency.negativeParenthesesFlag\\\" AS \\\"currency.negativeParenthesesFlag\\\", \\\"service_tickets\\\".\\\"currency.displaySymbolFlag\\\" AS \\\"currency.displaySymbolFlag\\\", \\\"service_tickets\\\".\\\"currency.currencyIdentifier\\\" AS \\\"currency.currencyIdentifier\\\", \\\"service_tickets\\\".\\\"currency.displayIdFlag\\\" AS \\\"currency.displayIdFlag\\\", \\\"service_tickets\\\".\\\"currency.rightAlign\\\" AS \\\"currency.rightAlign\\\", \\\"service_tickets\\\".\\\"currency.name\\\" AS \\\"currency.name\\\", \\\"service_tickets\\\".\\\"currency._info.currency_href\\\" AS \\\"currency._info.currency_href\\\", \\\"service_tickets\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.scheduleentries_href\\\" AS \\\"_info.scheduleentries_href\\\", \\\"service_tickets\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.tasks_href\\\" AS \\\"_info.tasks_href\\\", \\\"service_tickets\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.products_href\\\" AS \\\"_info.products_href\\\", \\\"service_tickets\\\".\\\"_info.timeentries_href\\\" AS \\\"_info.timeentries_href\\\", \\\"service_tickets\\\".\\\"_info.expenseEntries_href\\\" AS \\\"_info.expenseEntries_href\\\", \\\"service_tickets\\\".\\\"escalationStartDateUTC\\\" AS \\\"escalationStartDateUTC\\\", \\\"service_tickets\\\".\\\"escalationLevel\\\" AS \\\"escalationLevel\\\", \\\"service_tickets\\\".\\\"minutesBeforeWaiting\\\" AS \\\"minutesBeforeWaiting\\\", \\\"service_tickets\\\".\\\"respondedSkippedMinutes\\\" AS \\\"respondedSkippedMinutes\\\", \\\"service_tickets\\\".\\\"resplanSkippedMinutes\\\" AS \\\"resplanSkippedMinutes\\\", \\\"service_tickets\\\".\\\"respondedHours\\\" AS \\\"respondedHours\\\", \\\"service_tickets\\\".\\\"respondedBy\\\" AS \\\"respondedBy\\\", \\\"service_tickets\\\".\\\"resplanHours\\\" AS \\\"resplanHours\\\", \\\"service_tickets\\\".\\\"resplanBy\\\" AS \\\"resplanBy\\\", \\\"service_tickets\\\".\\\"resolutionHours\\\" AS \\\"resolutionHours\\\", \\\"service_tickets\\\".\\\"minutesWaiting\\\" AS \\\"minutesWaiting\\\", \\\"service_tickets\\\".\\\"workType.id\\\" AS \\\"workType.id\\\", \\\"service_tickets\\\".\\\"workType.name\\\" AS \\\"workType.name\\\", \\\"service_tickets\\\".\\\"workType._info.workType_href\\\" AS \\\"workType._info.workType_href\\\", \\\"service_tickets\\\".\\\"resources\\\" AS \\\"resources\\\", \\\"service_tickets\\\".\\\"workRole.id\\\" AS \\\"workRole.id\\\", \\\"service_tickets\\\".\\\"workRole.name\\\" AS \\\"workRole.name\\\", \\\"service_tickets\\\".\\\"workRole._info.workRole_href\\\" AS \\\"workRole._info.workRole_href\\\", \\\"service_tickets\\\".\\\"type.id\\\" AS \\\"type.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"type.name\\\" AS \\\"type.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"requiredDate\\\" AS \\\"requiredDate\\\", \\\"service_tickets\\\".\\\"budgetHours\\\" AS \\\"budgetHours\\\", \\\"service_tickets\\\".\\\"requestForChangeFlag\\\" AS \\\"requestForChangeFlag\\\" FROM \\\"PJ-23\\\".\\\"company_companies\\\" AS \\\"company_companies\\\" INNER JOIN \\\"PJ-23\\\".\\\"company_configurations\\\" AS \\\"company_configurations\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"company_configurations\\\".\\\"id\\\" INNER JOIN \\\"PJ-23\\\".\\\"service_tickets\\\" AS \\\"service_tickets\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"service_tickets\\\".\\\"id\\\") temp_table GROUP BY \\\"name\\\", \\\"name\\\" ORDER BY \\\"name\\\" ASC NULLS FIRST",
      "col_data": [
          " \"name\""
      ],
      "row_data": [
          "\"sum(annualRevenue)\""
      ],
      "sheet_query_data": {
          "columns_data": [
              {
                  "column": "name",
                  "data": [
                      "Big Design, Inc.",
                      "ConnectWise"
                  ]
              }
          ],
          "rows_data": [
              {
                  "column": "sum(annualRevenue)",
                  "data": [
                      2000000.0,
                      0.0
                  ]
              }
          ]
      }
  },
  {
      "sheet_id": 10972,
      "sheet_name": "Company wise Hours status",
      "chart_id": 8,
      "sheet_tag_name": "<p>Company wise Hours status</p>",
      "sheet_data": null,
      "created_by": 17,
      "sheet_filter_ids": [],
      "sheet_filter_quereyset_ids": "11088",
      "datasource_queryset_id": null,
      "filters_data": [],
      "custom_query": "SELECT \\\"name(company_configurations)\\\" AS \\\"name(company_configurations)\\\", COUNT(\\\"actualHours\\\") AS \\\"count(actualHours)\\\", COUNT(\\\"respondedHours\\\") AS \\\"count(respondedHours)\\\", COUNT(\\\"budgetHours\\\") AS \\\"count(budgetHours)\\\" FROM (SELECT \\\"company_companies\\\".\\\"id\\\" AS \\\"id\\\", \\\"company_companies\\\".\\\"identifier\\\" AS \\\"identifier\\\", \\\"company_companies\\\".\\\"name\\\" AS \\\"name\\\", \\\"company_companies\\\".\\\"status.id\\\" AS \\\"status.id\\\", \\\"company_companies\\\".\\\"status.name\\\" AS \\\"status.name\\\", \\\"company_companies\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href\\\", \\\"company_companies\\\".\\\"country.id\\\" AS \\\"country.id\\\", \\\"company_companies\\\".\\\"country.name\\\" AS \\\"country.name\\\", \\\"company_companies\\\".\\\"country._info.country_href\\\" AS \\\"country._info.country_href\\\", \\\"company_companies\\\".\\\"phoneNumber\\\" AS \\\"phoneNumber\\\", \\\"company_companies\\\".\\\"website\\\" AS \\\"website\\\", \\\"company_companies\\\".\\\"territory.id\\\" AS \\\"territory.id\\\", \\\"company_companies\\\".\\\"territory.name\\\" AS \\\"territory.name\\\", \\\"company_companies\\\".\\\"territory._info.location_href\\\" AS \\\"territory._info.location_href\\\", \\\"company_companies\\\".\\\"market.id\\\" AS \\\"market.id\\\", \\\"company_companies\\\".\\\"market.name\\\" AS \\\"market.name\\\", \\\"company_companies\\\".\\\"market._info.Market_href\\\" AS \\\"market._info.Market_href\\\", \\\"company_companies\\\".\\\"defaultContact.id\\\" AS \\\"defaultContact.id\\\", \\\"company_companies\\\".\\\"defaultContact.name\\\" AS \\\"defaultContact.name\\\", \\\"company_companies\\\".\\\"defaultContact._info.contact_href\\\" AS \\\"defaultContact._info.contact_href\\\", \\\"company_companies\\\".\\\"dateAcquired\\\" AS \\\"dateAcquired\\\", \\\"company_companies\\\".\\\"annualRevenue\\\" AS \\\"annualRevenue\\\", \\\"company_companies\\\".\\\"timeZoneSetup.id\\\" AS \\\"timeZoneSetup.id\\\", \\\"company_companies\\\".\\\"timeZoneSetup.name\\\" AS \\\"timeZoneSetup.name\\\", \\\"company_companies\\\".\\\"timeZoneSetup._info.timeZoneSetup_href\\\" AS \\\"timeZoneSetup._info.timeZoneSetup_href\\\", \\\"company_companies\\\".\\\"leadFlag\\\" AS \\\"leadFlag\\\", \\\"company_companies\\\".\\\"unsubscribeFlag\\\" AS \\\"unsubscribeFlag\\\", \\\"company_companies\\\".\\\"taxCode.id\\\" AS \\\"taxCode.id\\\", \\\"company_companies\\\".\\\"taxCode.name\\\" AS \\\"taxCode.name\\\", \\\"company_companies\\\".\\\"taxCode._info.taxCode_href\\\" AS \\\"taxCode._info.taxCode_href\\\", \\\"company_companies\\\".\\\"billingTerms.id\\\" AS \\\"billingTerms.id\\\", \\\"company_companies\\\".\\\"billingTerms.name\\\" AS \\\"billingTerms.name\\\", \\\"company_companies\\\".\\\"billToCompany.id\\\" AS \\\"billToCompany.id\\\", \\\"company_companies\\\".\\\"billToCompany.identifier\\\" AS \\\"billToCompany.identifier\\\", \\\"company_companies\\\".\\\"billToCompany.name\\\" AS \\\"billToCompany.name\\\", \\\"company_companies\\\".\\\"billToCompany._info.company_href\\\" AS \\\"billToCompany._info.company_href\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.id\\\" AS \\\"invoiceDeliveryMethod.id\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.name\\\" AS \\\"invoiceDeliveryMethod.name\\\", \\\"company_companies\\\".\\\"deletedFlag\\\" AS \\\"deletedFlag\\\", \\\"company_companies\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid\\\", \\\"company_companies\\\".\\\"isVendorFlag\\\" AS \\\"isVendorFlag\\\", \\\"company_companies\\\".\\\"types[0].id\\\" AS \\\"types[0].id\\\", \\\"company_companies\\\".\\\"types[0].name\\\" AS \\\"types[0].name\\\", \\\"company_companies\\\".\\\"types[0]._info.type_href\\\" AS \\\"types[0]._info.type_href\\\", \\\"company_companies\\\".\\\"site.id\\\" AS \\\"site.id\\\", \\\"company_companies\\\".\\\"site.name\\\" AS \\\"site.name\\\", \\\"company_companies\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href\\\", \\\"company_companies\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated\\\", \\\"company_companies\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy\\\", \\\"company_companies\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered\\\", \\\"company_companies\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy\\\", \\\"company_companies\\\".\\\"_info.contacts_href\\\" AS \\\"_info.contacts_href\\\", \\\"company_companies\\\".\\\"_info.agreements_href\\\" AS \\\"_info.agreements_href\\\", \\\"company_companies\\\".\\\"_info.tickets_href\\\" AS \\\"_info.tickets_href\\\", \\\"company_companies\\\".\\\"_info.opportunities_href\\\" AS \\\"_info.opportunities_href\\\", \\\"company_companies\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href\\\", \\\"company_companies\\\".\\\"_info.projects_href\\\" AS \\\"_info.projects_href\\\", \\\"company_companies\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href\\\", \\\"company_companies\\\".\\\"_info.orders_href\\\" AS \\\"_info.orders_href\\\", \\\"company_companies\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href\\\", \\\"company_companies\\\".\\\"_info.sites_href\\\" AS \\\"_info.sites_href\\\", \\\"company_companies\\\".\\\"_info.teams_href\\\" AS \\\"_info.teams_href\\\", \\\"company_companies\\\".\\\"_info.reports_href\\\" AS \\\"_info.reports_href\\\", \\\"company_companies\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href\\\", \\\"company_companies\\\".\\\"addressLine1\\\" AS \\\"addressLine1\\\", \\\"company_companies\\\".\\\"addressLine2\\\" AS \\\"addressLine2\\\", \\\"company_companies\\\".\\\"city\\\" AS \\\"city\\\", \\\"company_companies\\\".\\\"state\\\" AS \\\"state\\\", \\\"company_companies\\\".\\\"zip\\\" AS \\\"zip\\\", \\\"company_companies\\\".\\\"faxNumber\\\" AS \\\"faxNumber\\\", \\\"company_companies\\\".\\\"accountNumber\\\" AS \\\"accountNumber\\\", \\\"company_companies\\\".\\\"numberOfEmployees\\\" AS \\\"numberOfEmployees\\\", \\\"company_companies\\\".\\\"leadSource\\\" AS \\\"leadSource\\\", \\\"company_companies\\\".\\\"billingContact.id\\\" AS \\\"billingContact.id\\\", \\\"company_companies\\\".\\\"billingContact.name\\\" AS \\\"billingContact.name\\\", \\\"company_companies\\\".\\\"billingContact._info.contact_href\\\" AS \\\"billingContact._info.contact_href\\\", \\\"company_companies\\\".\\\"invoiceToEmailAddress\\\" AS \\\"invoiceToEmailAddress\\\", \\\"company_companies\\\".\\\"billingSite.id\\\" AS \\\"billingSite.id\\\", \\\"company_companies\\\".\\\"billingSite.name\\\" AS \\\"billingSite.name\\\", \\\"company_companies\\\".\\\"billingSite._info.site_href\\\" AS \\\"billingSite._info.site_href\\\", \\\"company_configurations\\\".\\\"id\\\" AS \\\"id(company_configurations)\\\", \\\"company_configurations\\\".\\\"name\\\" AS \\\"name(company_configurations)\\\", \\\"company_configurations\\\".\\\"type.id\\\" AS \\\"type.id\\\", \\\"company_configurations\\\".\\\"type.name\\\" AS \\\"type.name\\\", \\\"company_configurations\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href\\\", \\\"company_configurations\\\".\\\"status.id\\\" AS \\\"status.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"status.name\\\" AS \\\"status.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"company.id\\\" AS \\\"company.id\\\", \\\"company_configurations\\\".\\\"company.identifier\\\" AS \\\"company.identifier\\\", \\\"company_configurations\\\".\\\"company.name\\\" AS \\\"company.name\\\", \\\"company_configurations\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href\\\", \\\"company_configurations\\\".\\\"contact.id\\\" AS \\\"contact.id\\\", \\\"company_configurations\\\".\\\"contact.name\\\" AS \\\"contact.name\\\", \\\"company_configurations\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href\\\", \\\"company_configurations\\\".\\\"site.id\\\" AS \\\"site.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"site.name\\\" AS \\\"site.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"locationId\\\" AS \\\"locationId\\\", \\\"company_configurations\\\".\\\"location.id\\\" AS \\\"location.id\\\", \\\"company_configurations\\\".\\\"location.name\\\" AS \\\"location.name\\\", \\\"company_configurations\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href\\\", \\\"company_configurations\\\".\\\"businessUnitId\\\" AS \\\"businessUnitId\\\", \\\"company_configurations\\\".\\\"department.id\\\" AS \\\"department.id\\\", \\\"company_configurations\\\".\\\"department.identifier\\\" AS \\\"department.identifier\\\", \\\"company_configurations\\\".\\\"department.name\\\" AS \\\"department.name\\\", \\\"company_configurations\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href\\\", \\\"company_configurations\\\".\\\"serialNumber\\\" AS \\\"serialNumber\\\", \\\"company_configurations\\\".\\\"modelNumber\\\" AS \\\"modelNumber\\\", \\\"company_configurations\\\".\\\"tagNumber\\\" AS \\\"tagNumber\\\", \\\"company_configurations\\\".\\\"warrantyExpirationDate\\\" AS \\\"warrantyExpirationDate\\\", \\\"company_configurations\\\".\\\"notes\\\" AS \\\"notes\\\", \\\"company_configurations\\\".\\\"billFlag\\\" AS \\\"billFlag\\\", \\\"company_configurations\\\".\\\"vendor.id\\\" AS \\\"vendor.id\\\", \\\"company_configurations\\\".\\\"vendor.identifier\\\" AS \\\"vendor.identifier\\\", \\\"company_configurations\\\".\\\"vendor.name\\\" AS \\\"vendor.name\\\", \\\"company_configurations\\\".\\\"vendor._info.company_href\\\" AS \\\"vendor._info.company_href\\\", \\\"company_configurations\\\".\\\"activeFlag\\\" AS \\\"activeFlag\\\", \\\"company_configurations\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(company_configurations)\\\", \\\"company_configurations\\\".\\\"companyLocationId\\\" AS \\\"companyLocationId\\\", \\\"company_configurations\\\".\\\"showRemoteFlag\\\" AS \\\"showRemoteFlag\\\", \\\"company_configurations\\\".\\\"showAutomateFlag\\\" AS \\\"showAutomateFlag\\\", \\\"company_configurations\\\".\\\"needsRenewalFlag\\\" AS \\\"needsRenewalFlag\\\", \\\"company_configurations\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"backupSuccesses\\\" AS \\\"backupSuccesses\\\", \\\"company_configurations\\\".\\\"backupIncomplete\\\" AS \\\"backupIncomplete\\\", \\\"company_configurations\\\".\\\"backupFailed\\\" AS \\\"backupFailed\\\", \\\"company_configurations\\\".\\\"backupRestores\\\" AS \\\"backupRestores\\\", \\\"company_configurations\\\".\\\"backupBillableSpaceGb\\\" AS \\\"backupBillableSpaceGb\\\", \\\"company_configurations\\\".\\\"backupYear\\\" AS \\\"backupYear\\\", \\\"company_configurations\\\".\\\"backupMonth\\\" AS \\\"backupMonth\\\", \\\"service_tickets\\\".\\\"id\\\" AS \\\"id(service_tickets)\\\", \\\"service_tickets\\\".\\\"summary\\\" AS \\\"summary\\\", \\\"service_tickets\\\".\\\"recordType\\\" AS \\\"recordType\\\", \\\"service_tickets\\\".\\\"board.id\\\" AS \\\"board.id\\\", \\\"service_tickets\\\".\\\"board.name\\\" AS \\\"board.name\\\", \\\"service_tickets\\\".\\\"board._info.board_href\\\" AS \\\"board._info.board_href\\\", \\\"service_tickets\\\".\\\"status.id\\\" AS \\\"status.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.name\\\" AS \\\"status.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.Sort\\\" AS \\\"status.Sort\\\", \\\"service_tickets\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.id\\\" AS \\\"company.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.identifier\\\" AS \\\"company.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.name\\\" AS \\\"company.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.mobileGuid\\\" AS \\\"company._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"site.id\\\" AS \\\"site.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"site.name\\\" AS \\\"site.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.mobileGuid\\\" AS \\\"site._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"addressLine1\\\" AS \\\"addressLine1(service_tickets)\\\", \\\"service_tickets\\\".\\\"addressLine2\\\" AS \\\"addressLine2(service_tickets)\\\", \\\"service_tickets\\\".\\\"city\\\" AS \\\"city(service_tickets)\\\", \\\"service_tickets\\\".\\\"stateIdentifier\\\" AS \\\"stateIdentifier\\\", \\\"service_tickets\\\".\\\"zip\\\" AS \\\"zip(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.id\\\" AS \\\"contact.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.name\\\" AS \\\"contact.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact._info.mobileGuid\\\" AS \\\"contact._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"contactName\\\" AS \\\"contactName\\\", \\\"service_tickets\\\".\\\"contactPhoneNumber\\\" AS \\\"contactPhoneNumber\\\", \\\"service_tickets\\\".\\\"contactPhoneExtension\\\" AS \\\"contactPhoneExtension\\\", \\\"service_tickets\\\".\\\"contactEmailAddress\\\" AS \\\"contactEmailAddress\\\", \\\"service_tickets\\\".\\\"team.id\\\" AS \\\"team.id\\\", \\\"service_tickets\\\".\\\"team.name\\\" AS \\\"team.name\\\", \\\"service_tickets\\\".\\\"team._info.team_href\\\" AS \\\"team._info.team_href\\\", \\\"service_tickets\\\".\\\"priority.id\\\" AS \\\"priority.id\\\", \\\"service_tickets\\\".\\\"priority.name\\\" AS \\\"priority.name\\\", \\\"service_tickets\\\".\\\"priority.sort\\\" AS \\\"priority.sort\\\", \\\"service_tickets\\\".\\\"priority._info.priority_href\\\" AS \\\"priority._info.priority_href\\\", \\\"service_tickets\\\".\\\"priority._info.image_href\\\" AS \\\"priority._info.image_href\\\", \\\"service_tickets\\\".\\\"serviceLocation.id\\\" AS \\\"serviceLocation.id\\\", \\\"service_tickets\\\".\\\"serviceLocation.name\\\" AS \\\"serviceLocation.name\\\", \\\"service_tickets\\\".\\\"serviceLocation._info.location_href\\\" AS \\\"serviceLocation._info.location_href\\\", \\\"service_tickets\\\".\\\"source.id\\\" AS \\\"source.id\\\", \\\"service_tickets\\\".\\\"source.name\\\" AS \\\"source.name\\\", \\\"service_tickets\\\".\\\"source._info.source_href\\\" AS \\\"source._info.source_href\\\", \\\"service_tickets\\\".\\\"agreement.id\\\" AS \\\"agreement.id\\\", \\\"service_tickets\\\".\\\"agreement.name\\\" AS \\\"agreement.name\\\", \\\"service_tickets\\\".\\\"agreement._info.agreement_href\\\" AS \\\"agreement._info.agreement_href\\\", \\\"service_tickets\\\".\\\"severity\\\" AS \\\"severity\\\", \\\"service_tickets\\\".\\\"impact\\\" AS \\\"impact\\\", \\\"service_tickets\\\".\\\"allowAllClientsPortalView\\\" AS \\\"allowAllClientsPortalView\\\", \\\"service_tickets\\\".\\\"customerUpdatedFlag\\\" AS \\\"customerUpdatedFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailContactFlag\\\" AS \\\"automaticEmailContactFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailResourceFlag\\\" AS \\\"automaticEmailResourceFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailCcFlag\\\" AS \\\"automaticEmailCcFlag\\\", \\\"service_tickets\\\".\\\"closedDate\\\" AS \\\"closedDate\\\", \\\"service_tickets\\\".\\\"closedBy\\\" AS \\\"closedBy\\\", \\\"service_tickets\\\".\\\"closedFlag\\\" AS \\\"closedFlag\\\", \\\"service_tickets\\\".\\\"actualHours\\\" AS \\\"actualHours\\\", \\\"service_tickets\\\".\\\"approved\\\" AS \\\"approved\\\", \\\"service_tickets\\\".\\\"estimatedExpenseCost\\\" AS \\\"estimatedExpenseCost\\\", \\\"service_tickets\\\".\\\"estimatedExpenseRevenue\\\" AS \\\"estimatedExpenseRevenue\\\", \\\"service_tickets\\\".\\\"estimatedProductCost\\\" AS \\\"estimatedProductCost\\\", \\\"service_tickets\\\".\\\"estimatedProductRevenue\\\" AS \\\"estimatedProductRevenue\\\", \\\"service_tickets\\\".\\\"estimatedTimeCost\\\" AS \\\"estimatedTimeCost\\\", \\\"service_tickets\\\".\\\"estimatedTimeRevenue\\\" AS \\\"estimatedTimeRevenue\\\", \\\"service_tickets\\\".\\\"billingMethod\\\" AS \\\"billingMethod\\\", \\\"service_tickets\\\".\\\"dateResplan\\\" AS \\\"dateResplan\\\", \\\"service_tickets\\\".\\\"dateResponded\\\" AS \\\"dateResponded\\\", \\\"service_tickets\\\".\\\"resolveMinutes\\\" AS \\\"resolveMinutes\\\", \\\"service_tickets\\\".\\\"resPlanMinutes\\\" AS \\\"resPlanMinutes\\\", \\\"service_tickets\\\".\\\"respondMinutes\\\" AS \\\"respondMinutes\\\", \\\"service_tickets\\\".\\\"isInSla\\\" AS \\\"isInSla\\\", \\\"service_tickets\\\".\\\"hasChildTicket\\\" AS \\\"hasChildTicket\\\", \\\"service_tickets\\\".\\\"hasMergedChildTicketFlag\\\" AS \\\"hasMergedChildTicketFlag\\\", \\\"service_tickets\\\".\\\"billTime\\\" AS \\\"billTime\\\", \\\"service_tickets\\\".\\\"billExpenses\\\" AS \\\"billExpenses\\\", \\\"service_tickets\\\".\\\"billProducts\\\" AS \\\"billProducts\\\", \\\"service_tickets\\\".\\\"location.id\\\" AS \\\"location.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"location.name\\\" AS \\\"location.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.id\\\" AS \\\"department.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.identifier\\\" AS \\\"department.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.name\\\" AS \\\"department.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(service_tickets)\\\", \\\"service_tickets\\\".\\\"sla.id\\\" AS \\\"sla.id\\\", \\\"service_tickets\\\".\\\"sla.name\\\" AS \\\"sla.name\\\", \\\"service_tickets\\\".\\\"sla._info.sla_href\\\" AS \\\"sla._info.sla_href\\\", \\\"service_tickets\\\".\\\"currency.id\\\" AS \\\"currency.id\\\", \\\"service_tickets\\\".\\\"currency.symbol\\\" AS \\\"currency.symbol\\\", \\\"service_tickets\\\".\\\"currency.currencyCode\\\" AS \\\"currency.currencyCode\\\", \\\"service_tickets\\\".\\\"currency.decimalSeparator\\\" AS \\\"currency.decimalSeparator\\\", \\\"service_tickets\\\".\\\"currency.numberOfDecimals\\\" AS \\\"currency.numberOfDecimals\\\", \\\"service_tickets\\\".\\\"currency.thousandsSeparator\\\" AS \\\"currency.thousandsSeparator\\\", \\\"service_tickets\\\".\\\"currency.negativeParenthesesFlag\\\" AS \\\"currency.negativeParenthesesFlag\\\", \\\"service_tickets\\\".\\\"currency.displaySymbolFlag\\\" AS \\\"currency.displaySymbolFlag\\\", \\\"service_tickets\\\".\\\"currency.currencyIdentifier\\\" AS \\\"currency.currencyIdentifier\\\", \\\"service_tickets\\\".\\\"currency.displayIdFlag\\\" AS \\\"currency.displayIdFlag\\\", \\\"service_tickets\\\".\\\"currency.rightAlign\\\" AS \\\"currency.rightAlign\\\", \\\"service_tickets\\\".\\\"currency.name\\\" AS \\\"currency.name\\\", \\\"service_tickets\\\".\\\"currency._info.currency_href\\\" AS \\\"currency._info.currency_href\\\", \\\"service_tickets\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.scheduleentries_href\\\" AS \\\"_info.scheduleentries_href\\\", \\\"service_tickets\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.tasks_href\\\" AS \\\"_info.tasks_href\\\", \\\"service_tickets\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.products_href\\\" AS \\\"_info.products_href\\\", \\\"service_tickets\\\".\\\"_info.timeentries_href\\\" AS \\\"_info.timeentries_href\\\", \\\"service_tickets\\\".\\\"_info.expenseEntries_href\\\" AS \\\"_info.expenseEntries_href\\\", \\\"service_tickets\\\".\\\"escalationStartDateUTC\\\" AS \\\"escalationStartDateUTC\\\", \\\"service_tickets\\\".\\\"escalationLevel\\\" AS \\\"escalationLevel\\\", \\\"service_tickets\\\".\\\"minutesBeforeWaiting\\\" AS \\\"minutesBeforeWaiting\\\", \\\"service_tickets\\\".\\\"respondedSkippedMinutes\\\" AS \\\"respondedSkippedMinutes\\\", \\\"service_tickets\\\".\\\"resplanSkippedMinutes\\\" AS \\\"resplanSkippedMinutes\\\", \\\"service_tickets\\\".\\\"respondedHours\\\" AS \\\"respondedHours\\\", \\\"service_tickets\\\".\\\"respondedBy\\\" AS \\\"respondedBy\\\", \\\"service_tickets\\\".\\\"resplanHours\\\" AS \\\"resplanHours\\\", \\\"service_tickets\\\".\\\"resplanBy\\\" AS \\\"resplanBy\\\", \\\"service_tickets\\\".\\\"resolutionHours\\\" AS \\\"resolutionHours\\\", \\\"service_tickets\\\".\\\"minutesWaiting\\\" AS \\\"minutesWaiting\\\", \\\"service_tickets\\\".\\\"workType.id\\\" AS \\\"workType.id\\\", \\\"service_tickets\\\".\\\"workType.name\\\" AS \\\"workType.name\\\", \\\"service_tickets\\\".\\\"workType._info.workType_href\\\" AS \\\"workType._info.workType_href\\\", \\\"service_tickets\\\".\\\"resources\\\" AS \\\"resources\\\", \\\"service_tickets\\\".\\\"workRole.id\\\" AS \\\"workRole.id\\\", \\\"service_tickets\\\".\\\"workRole.name\\\" AS \\\"workRole.name\\\", \\\"service_tickets\\\".\\\"workRole._info.workRole_href\\\" AS \\\"workRole._info.workRole_href\\\", \\\"service_tickets\\\".\\\"type.id\\\" AS \\\"type.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"type.name\\\" AS \\\"type.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"requiredDate\\\" AS \\\"requiredDate\\\", \\\"service_tickets\\\".\\\"budgetHours\\\" AS \\\"budgetHours\\\", \\\"service_tickets\\\".\\\"requestForChangeFlag\\\" AS \\\"requestForChangeFlag\\\" FROM \\\"PJ-23\\\".\\\"company_companies\\\" AS \\\"company_companies\\\" INNER JOIN \\\"PJ-23\\\".\\\"company_configurations\\\" AS \\\"company_configurations\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"company_configurations\\\".\\\"id\\\" INNER JOIN \\\"PJ-23\\\".\\\"service_tickets\\\" AS \\\"service_tickets\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"service_tickets\\\".\\\"id\\\") temp_table GROUP BY \\\"name(company_configurations)\\\", \\\"name(company_configurations)\\\" ORDER BY \\\"name(company_configurations)\\\" ASC NULLS FIRST",
      "col_data": [
          " \"name(company_configurations)\""
      ],
      "row_data": [
          "\"count(actualHours)\"",
          "\"count(respondedHours)\"",
          "\"count(budgetHours)\""
      ],
      "sheet_query_data": {
          "columns_data": [
              {
                  "column": "name(company_configurations)",
                  "data": [
                      "PSA Software",
                      "Test"
                  ]
              }
          ],
          "rows_data": [
              {
                  "column": "count(actualHours)",
                  "data": [
                      1,
                      0
                  ]
              },
              {
                  "column": "count(respondedHours)",
                  "data": [
                      1,
                      1
                  ]
              },
              {
                  "column": "count(budgetHours)",
                  "data": [
                      0,
                      0
                  ]
              }
          ]
      }
  },
  {
      "sheet_id": 10971,
      "sheet_name": "Ticket Status",
      "chart_id": 1,
      "sheet_tag_name": "<p>Ticket Status</p>",
      "sheet_data": null,
      "created_by": 17,
      "sheet_filter_ids": [],
      "sheet_filter_quereyset_ids": "11087",
      "datasource_queryset_id": null,
      "filters_data": [],
      "custom_query": "SELECT \\\"name(company_configurations)\\\" AS \\\"name(company_configurations)\\\", COUNT(DISTINCT \\\"escalationLevel\\\") AS \\\"CNTD(escalationLevel)\\\", CASE WHEN \\\"approved\\\" THEN 'True' ELSE 'False' END AS \\\"approved\\\", \\\"severity\\\" AS \\\"severity\\\" FROM (SELECT \\\"company_companies\\\".\\\"id\\\" AS \\\"id\\\", \\\"company_companies\\\".\\\"identifier\\\" AS \\\"identifier\\\", \\\"company_companies\\\".\\\"name\\\" AS \\\"name\\\", \\\"company_companies\\\".\\\"status.id\\\" AS \\\"status.id\\\", \\\"company_companies\\\".\\\"status.name\\\" AS \\\"status.name\\\", \\\"company_companies\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href\\\", \\\"company_companies\\\".\\\"country.id\\\" AS \\\"country.id\\\", \\\"company_companies\\\".\\\"country.name\\\" AS \\\"country.name\\\", \\\"company_companies\\\".\\\"country._info.country_href\\\" AS \\\"country._info.country_href\\\", \\\"company_companies\\\".\\\"phoneNumber\\\" AS \\\"phoneNumber\\\", \\\"company_companies\\\".\\\"website\\\" AS \\\"website\\\", \\\"company_companies\\\".\\\"territory.id\\\" AS \\\"territory.id\\\", \\\"company_companies\\\".\\\"territory.name\\\" AS \\\"territory.name\\\", \\\"company_companies\\\".\\\"territory._info.location_href\\\" AS \\\"territory._info.location_href\\\", \\\"company_companies\\\".\\\"market.id\\\" AS \\\"market.id\\\", \\\"company_companies\\\".\\\"market.name\\\" AS \\\"market.name\\\", \\\"company_companies\\\".\\\"market._info.Market_href\\\" AS \\\"market._info.Market_href\\\", \\\"company_companies\\\".\\\"defaultContact.id\\\" AS \\\"defaultContact.id\\\", \\\"company_companies\\\".\\\"defaultContact.name\\\" AS \\\"defaultContact.name\\\", \\\"company_companies\\\".\\\"defaultContact._info.contact_href\\\" AS \\\"defaultContact._info.contact_href\\\", \\\"company_companies\\\".\\\"dateAcquired\\\" AS \\\"dateAcquired\\\", \\\"company_companies\\\".\\\"annualRevenue\\\" AS \\\"annualRevenue\\\", \\\"company_companies\\\".\\\"timeZoneSetup.id\\\" AS \\\"timeZoneSetup.id\\\", \\\"company_companies\\\".\\\"timeZoneSetup.name\\\" AS \\\"timeZoneSetup.name\\\", \\\"company_companies\\\".\\\"timeZoneSetup._info.timeZoneSetup_href\\\" AS \\\"timeZoneSetup._info.timeZoneSetup_href\\\", \\\"company_companies\\\".\\\"leadFlag\\\" AS \\\"leadFlag\\\", \\\"company_companies\\\".\\\"unsubscribeFlag\\\" AS \\\"unsubscribeFlag\\\", \\\"company_companies\\\".\\\"taxCode.id\\\" AS \\\"taxCode.id\\\", \\\"company_companies\\\".\\\"taxCode.name\\\" AS \\\"taxCode.name\\\", \\\"company_companies\\\".\\\"taxCode._info.taxCode_href\\\" AS \\\"taxCode._info.taxCode_href\\\", \\\"company_companies\\\".\\\"billingTerms.id\\\" AS \\\"billingTerms.id\\\", \\\"company_companies\\\".\\\"billingTerms.name\\\" AS \\\"billingTerms.name\\\", \\\"company_companies\\\".\\\"billToCompany.id\\\" AS \\\"billToCompany.id\\\", \\\"company_companies\\\".\\\"billToCompany.identifier\\\" AS \\\"billToCompany.identifier\\\", \\\"company_companies\\\".\\\"billToCompany.name\\\" AS \\\"billToCompany.name\\\", \\\"company_companies\\\".\\\"billToCompany._info.company_href\\\" AS \\\"billToCompany._info.company_href\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.id\\\" AS \\\"invoiceDeliveryMethod.id\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.name\\\" AS \\\"invoiceDeliveryMethod.name\\\", \\\"company_companies\\\".\\\"deletedFlag\\\" AS \\\"deletedFlag\\\", \\\"company_companies\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid\\\", \\\"company_companies\\\".\\\"isVendorFlag\\\" AS \\\"isVendorFlag\\\", \\\"company_companies\\\".\\\"types[0].id\\\" AS \\\"types[0].id\\\", \\\"company_companies\\\".\\\"types[0].name\\\" AS \\\"types[0].name\\\", \\\"company_companies\\\".\\\"types[0]._info.type_href\\\" AS \\\"types[0]._info.type_href\\\", \\\"company_companies\\\".\\\"site.id\\\" AS \\\"site.id\\\", \\\"company_companies\\\".\\\"site.name\\\" AS \\\"site.name\\\", \\\"company_companies\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href\\\", \\\"company_companies\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated\\\", \\\"company_companies\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy\\\", \\\"company_companies\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered\\\", \\\"company_companies\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy\\\", \\\"company_companies\\\".\\\"_info.contacts_href\\\" AS \\\"_info.contacts_href\\\", \\\"company_companies\\\".\\\"_info.agreements_href\\\" AS \\\"_info.agreements_href\\\", \\\"company_companies\\\".\\\"_info.tickets_href\\\" AS \\\"_info.tickets_href\\\", \\\"company_companies\\\".\\\"_info.opportunities_href\\\" AS \\\"_info.opportunities_href\\\", \\\"company_companies\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href\\\", \\\"company_companies\\\".\\\"_info.projects_href\\\" AS \\\"_info.projects_href\\\", \\\"company_companies\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href\\\", \\\"company_companies\\\".\\\"_info.orders_href\\\" AS \\\"_info.orders_href\\\", \\\"company_companies\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href\\\", \\\"company_companies\\\".\\\"_info.sites_href\\\" AS \\\"_info.sites_href\\\", \\\"company_companies\\\".\\\"_info.teams_href\\\" AS \\\"_info.teams_href\\\", \\\"company_companies\\\".\\\"_info.reports_href\\\" AS \\\"_info.reports_href\\\", \\\"company_companies\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href\\\", \\\"company_companies\\\".\\\"addressLine1\\\" AS \\\"addressLine1\\\", \\\"company_companies\\\".\\\"addressLine2\\\" AS \\\"addressLine2\\\", \\\"company_companies\\\".\\\"city\\\" AS \\\"city\\\", \\\"company_companies\\\".\\\"state\\\" AS \\\"state\\\", \\\"company_companies\\\".\\\"zip\\\" AS \\\"zip\\\", \\\"company_companies\\\".\\\"faxNumber\\\" AS \\\"faxNumber\\\", \\\"company_companies\\\".\\\"accountNumber\\\" AS \\\"accountNumber\\\", \\\"company_companies\\\".\\\"numberOfEmployees\\\" AS \\\"numberOfEmployees\\\", \\\"company_companies\\\".\\\"leadSource\\\" AS \\\"leadSource\\\", \\\"company_companies\\\".\\\"billingContact.id\\\" AS \\\"billingContact.id\\\", \\\"company_companies\\\".\\\"billingContact.name\\\" AS \\\"billingContact.name\\\", \\\"company_companies\\\".\\\"billingContact._info.contact_href\\\" AS \\\"billingContact._info.contact_href\\\", \\\"company_companies\\\".\\\"invoiceToEmailAddress\\\" AS \\\"invoiceToEmailAddress\\\", \\\"company_companies\\\".\\\"billingSite.id\\\" AS \\\"billingSite.id\\\", \\\"company_companies\\\".\\\"billingSite.name\\\" AS \\\"billingSite.name\\\", \\\"company_companies\\\".\\\"billingSite._info.site_href\\\" AS \\\"billingSite._info.site_href\\\", \\\"company_configurations\\\".\\\"id\\\" AS \\\"id(company_configurations)\\\", \\\"company_configurations\\\".\\\"name\\\" AS \\\"name(company_configurations)\\\", \\\"company_configurations\\\".\\\"type.id\\\" AS \\\"type.id\\\", \\\"company_configurations\\\".\\\"type.name\\\" AS \\\"type.name\\\", \\\"company_configurations\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href\\\", \\\"company_configurations\\\".\\\"status.id\\\" AS \\\"status.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"status.name\\\" AS \\\"status.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"company.id\\\" AS \\\"company.id\\\", \\\"company_configurations\\\".\\\"company.identifier\\\" AS \\\"company.identifier\\\", \\\"company_configurations\\\".\\\"company.name\\\" AS \\\"company.name\\\", \\\"company_configurations\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href\\\", \\\"company_configurations\\\".\\\"contact.id\\\" AS \\\"contact.id\\\", \\\"company_configurations\\\".\\\"contact.name\\\" AS \\\"contact.name\\\", \\\"company_configurations\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href\\\", \\\"company_configurations\\\".\\\"site.id\\\" AS \\\"site.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"site.name\\\" AS \\\"site.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"locationId\\\" AS \\\"locationId\\\", \\\"company_configurations\\\".\\\"location.id\\\" AS \\\"location.id\\\", \\\"company_configurations\\\".\\\"location.name\\\" AS \\\"location.name\\\", \\\"company_configurations\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href\\\", \\\"company_configurations\\\".\\\"businessUnitId\\\" AS \\\"businessUnitId\\\", \\\"company_configurations\\\".\\\"department.id\\\" AS \\\"department.id\\\", \\\"company_configurations\\\".\\\"department.identifier\\\" AS \\\"department.identifier\\\", \\\"company_configurations\\\".\\\"department.name\\\" AS \\\"department.name\\\", \\\"company_configurations\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href\\\", \\\"company_configurations\\\".\\\"serialNumber\\\" AS \\\"serialNumber\\\", \\\"company_configurations\\\".\\\"modelNumber\\\" AS \\\"modelNumber\\\", \\\"company_configurations\\\".\\\"tagNumber\\\" AS \\\"tagNumber\\\", \\\"company_configurations\\\".\\\"warrantyExpirationDate\\\" AS \\\"warrantyExpirationDate\\\", \\\"company_configurations\\\".\\\"notes\\\" AS \\\"notes\\\", \\\"company_configurations\\\".\\\"billFlag\\\" AS \\\"billFlag\\\", \\\"company_configurations\\\".\\\"vendor.id\\\" AS \\\"vendor.id\\\", \\\"company_configurations\\\".\\\"vendor.identifier\\\" AS \\\"vendor.identifier\\\", \\\"company_configurations\\\".\\\"vendor.name\\\" AS \\\"vendor.name\\\", \\\"company_configurations\\\".\\\"vendor._info.company_href\\\" AS \\\"vendor._info.company_href\\\", \\\"company_configurations\\\".\\\"activeFlag\\\" AS \\\"activeFlag\\\", \\\"company_configurations\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(company_configurations)\\\", \\\"company_configurations\\\".\\\"companyLocationId\\\" AS \\\"companyLocationId\\\", \\\"company_configurations\\\".\\\"showRemoteFlag\\\" AS \\\"showRemoteFlag\\\", \\\"company_configurations\\\".\\\"showAutomateFlag\\\" AS \\\"showAutomateFlag\\\", \\\"company_configurations\\\".\\\"needsRenewalFlag\\\" AS \\\"needsRenewalFlag\\\", \\\"company_configurations\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"backupSuccesses\\\" AS \\\"backupSuccesses\\\", \\\"company_configurations\\\".\\\"backupIncomplete\\\" AS \\\"backupIncomplete\\\", \\\"company_configurations\\\".\\\"backupFailed\\\" AS \\\"backupFailed\\\", \\\"company_configurations\\\".\\\"backupRestores\\\" AS \\\"backupRestores\\\", \\\"company_configurations\\\".\\\"backupBillableSpaceGb\\\" AS \\\"backupBillableSpaceGb\\\", \\\"company_configurations\\\".\\\"backupYear\\\" AS \\\"backupYear\\\", \\\"company_configurations\\\".\\\"backupMonth\\\" AS \\\"backupMonth\\\", \\\"service_tickets\\\".\\\"id\\\" AS \\\"id(service_tickets)\\\", \\\"service_tickets\\\".\\\"summary\\\" AS \\\"summary\\\", \\\"service_tickets\\\".\\\"recordType\\\" AS \\\"recordType\\\", \\\"service_tickets\\\".\\\"board.id\\\" AS \\\"board.id\\\", \\\"service_tickets\\\".\\\"board.name\\\" AS \\\"board.name\\\", \\\"service_tickets\\\".\\\"board._info.board_href\\\" AS \\\"board._info.board_href\\\", \\\"service_tickets\\\".\\\"status.id\\\" AS \\\"status.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.name\\\" AS \\\"status.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.Sort\\\" AS \\\"status.Sort\\\", \\\"service_tickets\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.id\\\" AS \\\"company.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.identifier\\\" AS \\\"company.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.name\\\" AS \\\"company.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.mobileGuid\\\" AS \\\"company._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"site.id\\\" AS \\\"site.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"site.name\\\" AS \\\"site.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.mobileGuid\\\" AS \\\"site._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"addressLine1\\\" AS \\\"addressLine1(service_tickets)\\\", \\\"service_tickets\\\".\\\"addressLine2\\\" AS \\\"addressLine2(service_tickets)\\\", \\\"service_tickets\\\".\\\"city\\\" AS \\\"city(service_tickets)\\\", \\\"service_tickets\\\".\\\"stateIdentifier\\\" AS \\\"stateIdentifier\\\", \\\"service_tickets\\\".\\\"zip\\\" AS \\\"zip(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.id\\\" AS \\\"contact.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.name\\\" AS \\\"contact.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact._info.mobileGuid\\\" AS \\\"contact._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"contactName\\\" AS \\\"contactName\\\", \\\"service_tickets\\\".\\\"contactPhoneNumber\\\" AS \\\"contactPhoneNumber\\\", \\\"service_tickets\\\".\\\"contactPhoneExtension\\\" AS \\\"contactPhoneExtension\\\", \\\"service_tickets\\\".\\\"contactEmailAddress\\\" AS \\\"contactEmailAddress\\\", \\\"service_tickets\\\".\\\"team.id\\\" AS \\\"team.id\\\", \\\"service_tickets\\\".\\\"team.name\\\" AS \\\"team.name\\\", \\\"service_tickets\\\".\\\"team._info.team_href\\\" AS \\\"team._info.team_href\\\", \\\"service_tickets\\\".\\\"priority.id\\\" AS \\\"priority.id\\\", \\\"service_tickets\\\".\\\"priority.name\\\" AS \\\"priority.name\\\", \\\"service_tickets\\\".\\\"priority.sort\\\" AS \\\"priority.sort\\\", \\\"service_tickets\\\".\\\"priority._info.priority_href\\\" AS \\\"priority._info.priority_href\\\", \\\"service_tickets\\\".\\\"priority._info.image_href\\\" AS \\\"priority._info.image_href\\\", \\\"service_tickets\\\".\\\"serviceLocation.id\\\" AS \\\"serviceLocation.id\\\", \\\"service_tickets\\\".\\\"serviceLocation.name\\\" AS \\\"serviceLocation.name\\\", \\\"service_tickets\\\".\\\"serviceLocation._info.location_href\\\" AS \\\"serviceLocation._info.location_href\\\", \\\"service_tickets\\\".\\\"source.id\\\" AS \\\"source.id\\\", \\\"service_tickets\\\".\\\"source.name\\\" AS \\\"source.name\\\", \\\"service_tickets\\\".\\\"source._info.source_href\\\" AS \\\"source._info.source_href\\\", \\\"service_tickets\\\".\\\"agreement.id\\\" AS \\\"agreement.id\\\", \\\"service_tickets\\\".\\\"agreement.name\\\" AS \\\"agreement.name\\\", \\\"service_tickets\\\".\\\"agreement._info.agreement_href\\\" AS \\\"agreement._info.agreement_href\\\", \\\"service_tickets\\\".\\\"severity\\\" AS \\\"severity\\\", \\\"service_tickets\\\".\\\"impact\\\" AS \\\"impact\\\", \\\"service_tickets\\\".\\\"allowAllClientsPortalView\\\" AS \\\"allowAllClientsPortalView\\\", \\\"service_tickets\\\".\\\"customerUpdatedFlag\\\" AS \\\"customerUpdatedFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailContactFlag\\\" AS \\\"automaticEmailContactFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailResourceFlag\\\" AS \\\"automaticEmailResourceFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailCcFlag\\\" AS \\\"automaticEmailCcFlag\\\", \\\"service_tickets\\\".\\\"closedDate\\\" AS \\\"closedDate\\\", \\\"service_tickets\\\".\\\"closedBy\\\" AS \\\"closedBy\\\", \\\"service_tickets\\\".\\\"closedFlag\\\" AS \\\"closedFlag\\\", \\\"service_tickets\\\".\\\"actualHours\\\" AS \\\"actualHours\\\", \\\"service_tickets\\\".\\\"approved\\\" AS \\\"approved\\\", \\\"service_tickets\\\".\\\"estimatedExpenseCost\\\" AS \\\"estimatedExpenseCost\\\", \\\"service_tickets\\\".\\\"estimatedExpenseRevenue\\\" AS \\\"estimatedExpenseRevenue\\\", \\\"service_tickets\\\".\\\"estimatedProductCost\\\" AS \\\"estimatedProductCost\\\", \\\"service_tickets\\\".\\\"estimatedProductRevenue\\\" AS \\\"estimatedProductRevenue\\\", \\\"service_tickets\\\".\\\"estimatedTimeCost\\\" AS \\\"estimatedTimeCost\\\", \\\"service_tickets\\\".\\\"estimatedTimeRevenue\\\" AS \\\"estimatedTimeRevenue\\\", \\\"service_tickets\\\".\\\"billingMethod\\\" AS \\\"billingMethod\\\", \\\"service_tickets\\\".\\\"dateResplan\\\" AS \\\"dateResplan\\\", \\\"service_tickets\\\".\\\"dateResponded\\\" AS \\\"dateResponded\\\", \\\"service_tickets\\\".\\\"resolveMinutes\\\" AS \\\"resolveMinutes\\\", \\\"service_tickets\\\".\\\"resPlanMinutes\\\" AS \\\"resPlanMinutes\\\", \\\"service_tickets\\\".\\\"respondMinutes\\\" AS \\\"respondMinutes\\\", \\\"service_tickets\\\".\\\"isInSla\\\" AS \\\"isInSla\\\", \\\"service_tickets\\\".\\\"hasChildTicket\\\" AS \\\"hasChildTicket\\\", \\\"service_tickets\\\".\\\"hasMergedChildTicketFlag\\\" AS \\\"hasMergedChildTicketFlag\\\", \\\"service_tickets\\\".\\\"billTime\\\" AS \\\"billTime\\\", \\\"service_tickets\\\".\\\"billExpenses\\\" AS \\\"billExpenses\\\", \\\"service_tickets\\\".\\\"billProducts\\\" AS \\\"billProducts\\\", \\\"service_tickets\\\".\\\"location.id\\\" AS \\\"location.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"location.name\\\" AS \\\"location.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.id\\\" AS \\\"department.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.identifier\\\" AS \\\"department.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.name\\\" AS \\\"department.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(service_tickets)\\\", \\\"service_tickets\\\".\\\"sla.id\\\" AS \\\"sla.id\\\", \\\"service_tickets\\\".\\\"sla.name\\\" AS \\\"sla.name\\\", \\\"service_tickets\\\".\\\"sla._info.sla_href\\\" AS \\\"sla._info.sla_href\\\", \\\"service_tickets\\\".\\\"currency.id\\\" AS \\\"currency.id\\\", \\\"service_tickets\\\".\\\"currency.symbol\\\" AS \\\"currency.symbol\\\", \\\"service_tickets\\\".\\\"currency.currencyCode\\\" AS \\\"currency.currencyCode\\\", \\\"service_tickets\\\".\\\"currency.decimalSeparator\\\" AS \\\"currency.decimalSeparator\\\", \\\"service_tickets\\\".\\\"currency.numberOfDecimals\\\" AS \\\"currency.numberOfDecimals\\\", \\\"service_tickets\\\".\\\"currency.thousandsSeparator\\\" AS \\\"currency.thousandsSeparator\\\", \\\"service_tickets\\\".\\\"currency.negativeParenthesesFlag\\\" AS \\\"currency.negativeParenthesesFlag\\\", \\\"service_tickets\\\".\\\"currency.displaySymbolFlag\\\" AS \\\"currency.displaySymbolFlag\\\", \\\"service_tickets\\\".\\\"currency.currencyIdentifier\\\" AS \\\"currency.currencyIdentifier\\\", \\\"service_tickets\\\".\\\"currency.displayIdFlag\\\" AS \\\"currency.displayIdFlag\\\", \\\"service_tickets\\\".\\\"currency.rightAlign\\\" AS \\\"currency.rightAlign\\\", \\\"service_tickets\\\".\\\"currency.name\\\" AS \\\"currency.name\\\", \\\"service_tickets\\\".\\\"currency._info.currency_href\\\" AS \\\"currency._info.currency_href\\\", \\\"service_tickets\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.scheduleentries_href\\\" AS \\\"_info.scheduleentries_href\\\", \\\"service_tickets\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.tasks_href\\\" AS \\\"_info.tasks_href\\\", \\\"service_tickets\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.products_href\\\" AS \\\"_info.products_href\\\", \\\"service_tickets\\\".\\\"_info.timeentries_href\\\" AS \\\"_info.timeentries_href\\\", \\\"service_tickets\\\".\\\"_info.expenseEntries_href\\\" AS \\\"_info.expenseEntries_href\\\", \\\"service_tickets\\\".\\\"escalationStartDateUTC\\\" AS \\\"escalationStartDateUTC\\\", \\\"service_tickets\\\".\\\"escalationLevel\\\" AS \\\"escalationLevel\\\", \\\"service_tickets\\\".\\\"minutesBeforeWaiting\\\" AS \\\"minutesBeforeWaiting\\\", \\\"service_tickets\\\".\\\"respondedSkippedMinutes\\\" AS \\\"respondedSkippedMinutes\\\", \\\"service_tickets\\\".\\\"resplanSkippedMinutes\\\" AS \\\"resplanSkippedMinutes\\\", \\\"service_tickets\\\".\\\"respondedHours\\\" AS \\\"respondedHours\\\", \\\"service_tickets\\\".\\\"respondedBy\\\" AS \\\"respondedBy\\\", \\\"service_tickets\\\".\\\"resplanHours\\\" AS \\\"resplanHours\\\", \\\"service_tickets\\\".\\\"resplanBy\\\" AS \\\"resplanBy\\\", \\\"service_tickets\\\".\\\"resolutionHours\\\" AS \\\"resolutionHours\\\", \\\"service_tickets\\\".\\\"minutesWaiting\\\" AS \\\"minutesWaiting\\\", \\\"service_tickets\\\".\\\"workType.id\\\" AS \\\"workType.id\\\", \\\"service_tickets\\\".\\\"workType.name\\\" AS \\\"workType.name\\\", \\\"service_tickets\\\".\\\"workType._info.workType_href\\\" AS \\\"workType._info.workType_href\\\", \\\"service_tickets\\\".\\\"resources\\\" AS \\\"resources\\\", \\\"service_tickets\\\".\\\"workRole.id\\\" AS \\\"workRole.id\\\", \\\"service_tickets\\\".\\\"workRole.name\\\" AS \\\"workRole.name\\\", \\\"service_tickets\\\".\\\"workRole._info.workRole_href\\\" AS \\\"workRole._info.workRole_href\\\", \\\"service_tickets\\\".\\\"type.id\\\" AS \\\"type.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"type.name\\\" AS \\\"type.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"requiredDate\\\" AS \\\"requiredDate\\\", \\\"service_tickets\\\".\\\"budgetHours\\\" AS \\\"budgetHours\\\", \\\"service_tickets\\\".\\\"requestForChangeFlag\\\" AS \\\"requestForChangeFlag\\\" FROM \\\"PJ-23\\\".\\\"company_companies\\\" AS \\\"company_companies\\\" INNER JOIN \\\"PJ-23\\\".\\\"company_configurations\\\" AS \\\"company_configurations\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"company_configurations\\\".\\\"id\\\" INNER JOIN \\\"PJ-23\\\".\\\"service_tickets\\\" AS \\\"service_tickets\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"service_tickets\\\".\\\"id\\\") temp_table GROUP BY \\\"name(company_configurations)\\\", \\\"name(company_configurations)\\\", \\\"approved\\\", \\\"severity\\\" ORDER BY \\\"name(company_configurations)\\\" ASC NULLS FIRST",
      "col_data": [
          " \"name(company_configurations)\""
      ],
      "row_data": [
          " \"CNTD(escalationLevel)\"",
          " \"approved\"",
          " \"severity\""
      ],
      "sheet_query_data": {
          "columns_data": [
              {
                  "column": "name(company_configurations)",
                  "data": [
                      "PSA Software",
                      "Test"
                  ]
              }
          ],
          "rows_data": [
              {
                  "column": "CNTD(escalationLevel)",
                  "data": [
                      1,
                      1
                  ]
              },
              {
                  "column": "approved",
                  "data": [
                      "True",
                      "True"
                  ]
              },
              {
                  "column": "severity",
                  "data": [
                      "Medium",
                      "Medium"
                  ]
              }
          ]
      }
  },
  {
      "sheet_id": 10970,
      "sheet_name": "Ticket Info",
      "chart_id": 1,
      "sheet_tag_name": "<p>Ticket Info</p>",
      "sheet_data": null,
      "created_by": 17,
      "sheet_filter_ids": [],
      "sheet_filter_quereyset_ids": "11086",
      "datasource_queryset_id": null,
      "filters_data": [],
      "custom_query": "SELECT \\\"name\\\" AS \\\"name\\\", \\\"estimatedProductCost\\\" AS \\\"estimatedProductCost\\\", \\\"billTime\\\" AS \\\"billTime\\\", \\\"billProducts\\\" AS \\\"billProducts\\\", SUM(\\\"estimatedProductCost\\\") AS \\\"sum(estimatedProductCost)\\\", \\\"currency.name\\\" AS \\\"currency.name\\\", SUM(\\\"estimatedTimeCost\\\") AS \\\"sum(estimatedTimeCost)\\\" FROM (SELECT \\\"company_companies\\\".\\\"id\\\" AS \\\"id\\\", \\\"company_companies\\\".\\\"identifier\\\" AS \\\"identifier\\\", \\\"company_companies\\\".\\\"name\\\" AS \\\"name\\\", \\\"company_companies\\\".\\\"status.id\\\" AS \\\"status.id\\\", \\\"company_companies\\\".\\\"status.name\\\" AS \\\"status.name\\\", \\\"company_companies\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href\\\", \\\"company_companies\\\".\\\"country.id\\\" AS \\\"country.id\\\", \\\"company_companies\\\".\\\"country.name\\\" AS \\\"country.name\\\", \\\"company_companies\\\".\\\"country._info.country_href\\\" AS \\\"country._info.country_href\\\", \\\"company_companies\\\".\\\"phoneNumber\\\" AS \\\"phoneNumber\\\", \\\"company_companies\\\".\\\"website\\\" AS \\\"website\\\", \\\"company_companies\\\".\\\"territory.id\\\" AS \\\"territory.id\\\", \\\"company_companies\\\".\\\"territory.name\\\" AS \\\"territory.name\\\", \\\"company_companies\\\".\\\"territory._info.location_href\\\" AS \\\"territory._info.location_href\\\", \\\"company_companies\\\".\\\"market.id\\\" AS \\\"market.id\\\", \\\"company_companies\\\".\\\"market.name\\\" AS \\\"market.name\\\", \\\"company_companies\\\".\\\"market._info.Market_href\\\" AS \\\"market._info.Market_href\\\", \\\"company_companies\\\".\\\"defaultContact.id\\\" AS \\\"defaultContact.id\\\", \\\"company_companies\\\".\\\"defaultContact.name\\\" AS \\\"defaultContact.name\\\", \\\"company_companies\\\".\\\"defaultContact._info.contact_href\\\" AS \\\"defaultContact._info.contact_href\\\", \\\"company_companies\\\".\\\"dateAcquired\\\" AS \\\"dateAcquired\\\", \\\"company_companies\\\".\\\"annualRevenue\\\" AS \\\"annualRevenue\\\", \\\"company_companies\\\".\\\"timeZoneSetup.id\\\" AS \\\"timeZoneSetup.id\\\", \\\"company_companies\\\".\\\"timeZoneSetup.name\\\" AS \\\"timeZoneSetup.name\\\", \\\"company_companies\\\".\\\"timeZoneSetup._info.timeZoneSetup_href\\\" AS \\\"timeZoneSetup._info.timeZoneSetup_href\\\", \\\"company_companies\\\".\\\"leadFlag\\\" AS \\\"leadFlag\\\", \\\"company_companies\\\".\\\"unsubscribeFlag\\\" AS \\\"unsubscribeFlag\\\", \\\"company_companies\\\".\\\"taxCode.id\\\" AS \\\"taxCode.id\\\", \\\"company_companies\\\".\\\"taxCode.name\\\" AS \\\"taxCode.name\\\", \\\"company_companies\\\".\\\"taxCode._info.taxCode_href\\\" AS \\\"taxCode._info.taxCode_href\\\", \\\"company_companies\\\".\\\"billingTerms.id\\\" AS \\\"billingTerms.id\\\", \\\"company_companies\\\".\\\"billingTerms.name\\\" AS \\\"billingTerms.name\\\", \\\"company_companies\\\".\\\"billToCompany.id\\\" AS \\\"billToCompany.id\\\", \\\"company_companies\\\".\\\"billToCompany.identifier\\\" AS \\\"billToCompany.identifier\\\", \\\"company_companies\\\".\\\"billToCompany.name\\\" AS \\\"billToCompany.name\\\", \\\"company_companies\\\".\\\"billToCompany._info.company_href\\\" AS \\\"billToCompany._info.company_href\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.id\\\" AS \\\"invoiceDeliveryMethod.id\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.name\\\" AS \\\"invoiceDeliveryMethod.name\\\", \\\"company_companies\\\".\\\"deletedFlag\\\" AS \\\"deletedFlag\\\", \\\"company_companies\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid\\\", \\\"company_companies\\\".\\\"isVendorFlag\\\" AS \\\"isVendorFlag\\\", \\\"company_companies\\\".\\\"types[0].id\\\" AS \\\"types[0].id\\\", \\\"company_companies\\\".\\\"types[0].name\\\" AS \\\"types[0].name\\\", \\\"company_companies\\\".\\\"types[0]._info.type_href\\\" AS \\\"types[0]._info.type_href\\\", \\\"company_companies\\\".\\\"site.id\\\" AS \\\"site.id\\\", \\\"company_companies\\\".\\\"site.name\\\" AS \\\"site.name\\\", \\\"company_companies\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href\\\", \\\"company_companies\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated\\\", \\\"company_companies\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy\\\", \\\"company_companies\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered\\\", \\\"company_companies\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy\\\", \\\"company_companies\\\".\\\"_info.contacts_href\\\" AS \\\"_info.contacts_href\\\", \\\"company_companies\\\".\\\"_info.agreements_href\\\" AS \\\"_info.agreements_href\\\", \\\"company_companies\\\".\\\"_info.tickets_href\\\" AS \\\"_info.tickets_href\\\", \\\"company_companies\\\".\\\"_info.opportunities_href\\\" AS \\\"_info.opportunities_href\\\", \\\"company_companies\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href\\\", \\\"company_companies\\\".\\\"_info.projects_href\\\" AS \\\"_info.projects_href\\\", \\\"company_companies\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href\\\", \\\"company_companies\\\".\\\"_info.orders_href\\\" AS \\\"_info.orders_href\\\", \\\"company_companies\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href\\\", \\\"company_companies\\\".\\\"_info.sites_href\\\" AS \\\"_info.sites_href\\\", \\\"company_companies\\\".\\\"_info.teams_href\\\" AS \\\"_info.teams_href\\\", \\\"company_companies\\\".\\\"_info.reports_href\\\" AS \\\"_info.reports_href\\\", \\\"company_companies\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href\\\", \\\"company_companies\\\".\\\"addressLine1\\\" AS \\\"addressLine1\\\", \\\"company_companies\\\".\\\"addressLine2\\\" AS \\\"addressLine2\\\", \\\"company_companies\\\".\\\"city\\\" AS \\\"city\\\", \\\"company_companies\\\".\\\"state\\\" AS \\\"state\\\", \\\"company_companies\\\".\\\"zip\\\" AS \\\"zip\\\", \\\"company_companies\\\".\\\"faxNumber\\\" AS \\\"faxNumber\\\", \\\"company_companies\\\".\\\"accountNumber\\\" AS \\\"accountNumber\\\", \\\"company_companies\\\".\\\"numberOfEmployees\\\" AS \\\"numberOfEmployees\\\", \\\"company_companies\\\".\\\"leadSource\\\" AS \\\"leadSource\\\", \\\"company_companies\\\".\\\"billingContact.id\\\" AS \\\"billingContact.id\\\", \\\"company_companies\\\".\\\"billingContact.name\\\" AS \\\"billingContact.name\\\", \\\"company_companies\\\".\\\"billingContact._info.contact_href\\\" AS \\\"billingContact._info.contact_href\\\", \\\"company_companies\\\".\\\"invoiceToEmailAddress\\\" AS \\\"invoiceToEmailAddress\\\", \\\"company_companies\\\".\\\"billingSite.id\\\" AS \\\"billingSite.id\\\", \\\"company_companies\\\".\\\"billingSite.name\\\" AS \\\"billingSite.name\\\", \\\"company_companies\\\".\\\"billingSite._info.site_href\\\" AS \\\"billingSite._info.site_href\\\", \\\"company_configurations\\\".\\\"id\\\" AS \\\"id(company_configurations)\\\", \\\"company_configurations\\\".\\\"name\\\" AS \\\"name(company_configurations)\\\", \\\"company_configurations\\\".\\\"type.id\\\" AS \\\"type.id\\\", \\\"company_configurations\\\".\\\"type.name\\\" AS \\\"type.name\\\", \\\"company_configurations\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href\\\", \\\"company_configurations\\\".\\\"status.id\\\" AS \\\"status.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"status.name\\\" AS \\\"status.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"company.id\\\" AS \\\"company.id\\\", \\\"company_configurations\\\".\\\"company.identifier\\\" AS \\\"company.identifier\\\", \\\"company_configurations\\\".\\\"company.name\\\" AS \\\"company.name\\\", \\\"company_configurations\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href\\\", \\\"company_configurations\\\".\\\"contact.id\\\" AS \\\"contact.id\\\", \\\"company_configurations\\\".\\\"contact.name\\\" AS \\\"contact.name\\\", \\\"company_configurations\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href\\\", \\\"company_configurations\\\".\\\"site.id\\\" AS \\\"site.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"site.name\\\" AS \\\"site.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"locationId\\\" AS \\\"locationId\\\", \\\"company_configurations\\\".\\\"location.id\\\" AS \\\"location.id\\\", \\\"company_configurations\\\".\\\"location.name\\\" AS \\\"location.name\\\", \\\"company_configurations\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href\\\", \\\"company_configurations\\\".\\\"businessUnitId\\\" AS \\\"businessUnitId\\\", \\\"company_configurations\\\".\\\"department.id\\\" AS \\\"department.id\\\", \\\"company_configurations\\\".\\\"department.identifier\\\" AS \\\"department.identifier\\\", \\\"company_configurations\\\".\\\"department.name\\\" AS \\\"department.name\\\", \\\"company_configurations\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href\\\", \\\"company_configurations\\\".\\\"serialNumber\\\" AS \\\"serialNumber\\\", \\\"company_configurations\\\".\\\"modelNumber\\\" AS \\\"modelNumber\\\", \\\"company_configurations\\\".\\\"tagNumber\\\" AS \\\"tagNumber\\\", \\\"company_configurations\\\".\\\"warrantyExpirationDate\\\" AS \\\"warrantyExpirationDate\\\", \\\"company_configurations\\\".\\\"notes\\\" AS \\\"notes\\\", \\\"company_configurations\\\".\\\"billFlag\\\" AS \\\"billFlag\\\", \\\"company_configurations\\\".\\\"vendor.id\\\" AS \\\"vendor.id\\\", \\\"company_configurations\\\".\\\"vendor.identifier\\\" AS \\\"vendor.identifier\\\", \\\"company_configurations\\\".\\\"vendor.name\\\" AS \\\"vendor.name\\\", \\\"company_configurations\\\".\\\"vendor._info.company_href\\\" AS \\\"vendor._info.company_href\\\", \\\"company_configurations\\\".\\\"activeFlag\\\" AS \\\"activeFlag\\\", \\\"company_configurations\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(company_configurations)\\\", \\\"company_configurations\\\".\\\"companyLocationId\\\" AS \\\"companyLocationId\\\", \\\"company_configurations\\\".\\\"showRemoteFlag\\\" AS \\\"showRemoteFlag\\\", \\\"company_configurations\\\".\\\"showAutomateFlag\\\" AS \\\"showAutomateFlag\\\", \\\"company_configurations\\\".\\\"needsRenewalFlag\\\" AS \\\"needsRenewalFlag\\\", \\\"company_configurations\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"backupSuccesses\\\" AS \\\"backupSuccesses\\\", \\\"company_configurations\\\".\\\"backupIncomplete\\\" AS \\\"backupIncomplete\\\", \\\"company_configurations\\\".\\\"backupFailed\\\" AS \\\"backupFailed\\\", \\\"company_configurations\\\".\\\"backupRestores\\\" AS \\\"backupRestores\\\", \\\"company_configurations\\\".\\\"backupBillableSpaceGb\\\" AS \\\"backupBillableSpaceGb\\\", \\\"company_configurations\\\".\\\"backupYear\\\" AS \\\"backupYear\\\", \\\"company_configurations\\\".\\\"backupMonth\\\" AS \\\"backupMonth\\\", \\\"service_tickets\\\".\\\"id\\\" AS \\\"id(service_tickets)\\\", \\\"service_tickets\\\".\\\"summary\\\" AS \\\"summary\\\", \\\"service_tickets\\\".\\\"recordType\\\" AS \\\"recordType\\\", \\\"service_tickets\\\".\\\"board.id\\\" AS \\\"board.id\\\", \\\"service_tickets\\\".\\\"board.name\\\" AS \\\"board.name\\\", \\\"service_tickets\\\".\\\"board._info.board_href\\\" AS \\\"board._info.board_href\\\", \\\"service_tickets\\\".\\\"status.id\\\" AS \\\"status.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.name\\\" AS \\\"status.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.Sort\\\" AS \\\"status.Sort\\\", \\\"service_tickets\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.id\\\" AS \\\"company.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.identifier\\\" AS \\\"company.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.name\\\" AS \\\"company.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.mobileGuid\\\" AS \\\"company._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"site.id\\\" AS \\\"site.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"site.name\\\" AS \\\"site.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.mobileGuid\\\" AS \\\"site._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"addressLine1\\\" AS \\\"addressLine1(service_tickets)\\\", \\\"service_tickets\\\".\\\"addressLine2\\\" AS \\\"addressLine2(service_tickets)\\\", \\\"service_tickets\\\".\\\"city\\\" AS \\\"city(service_tickets)\\\", \\\"service_tickets\\\".\\\"stateIdentifier\\\" AS \\\"stateIdentifier\\\", \\\"service_tickets\\\".\\\"zip\\\" AS \\\"zip(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.id\\\" AS \\\"contact.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.name\\\" AS \\\"contact.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact._info.mobileGuid\\\" AS \\\"contact._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"contactName\\\" AS \\\"contactName\\\", \\\"service_tickets\\\".\\\"contactPhoneNumber\\\" AS \\\"contactPhoneNumber\\\", \\\"service_tickets\\\".\\\"contactPhoneExtension\\\" AS \\\"contactPhoneExtension\\\", \\\"service_tickets\\\".\\\"contactEmailAddress\\\" AS \\\"contactEmailAddress\\\", \\\"service_tickets\\\".\\\"team.id\\\" AS \\\"team.id\\\", \\\"service_tickets\\\".\\\"team.name\\\" AS \\\"team.name\\\", \\\"service_tickets\\\".\\\"team._info.team_href\\\" AS \\\"team._info.team_href\\\", \\\"service_tickets\\\".\\\"priority.id\\\" AS \\\"priority.id\\\", \\\"service_tickets\\\".\\\"priority.name\\\" AS \\\"priority.name\\\", \\\"service_tickets\\\".\\\"priority.sort\\\" AS \\\"priority.sort\\\", \\\"service_tickets\\\".\\\"priority._info.priority_href\\\" AS \\\"priority._info.priority_href\\\", \\\"service_tickets\\\".\\\"priority._info.image_href\\\" AS \\\"priority._info.image_href\\\", \\\"service_tickets\\\".\\\"serviceLocation.id\\\" AS \\\"serviceLocation.id\\\", \\\"service_tickets\\\".\\\"serviceLocation.name\\\" AS \\\"serviceLocation.name\\\", \\\"service_tickets\\\".\\\"serviceLocation._info.location_href\\\" AS \\\"serviceLocation._info.location_href\\\", \\\"service_tickets\\\".\\\"source.id\\\" AS \\\"source.id\\\", \\\"service_tickets\\\".\\\"source.name\\\" AS \\\"source.name\\\", \\\"service_tickets\\\".\\\"source._info.source_href\\\" AS \\\"source._info.source_href\\\", \\\"service_tickets\\\".\\\"agreement.id\\\" AS \\\"agreement.id\\\", \\\"service_tickets\\\".\\\"agreement.name\\\" AS \\\"agreement.name\\\", \\\"service_tickets\\\".\\\"agreement._info.agreement_href\\\" AS \\\"agreement._info.agreement_href\\\", \\\"service_tickets\\\".\\\"severity\\\" AS \\\"severity\\\", \\\"service_tickets\\\".\\\"impact\\\" AS \\\"impact\\\", \\\"service_tickets\\\".\\\"allowAllClientsPortalView\\\" AS \\\"allowAllClientsPortalView\\\", \\\"service_tickets\\\".\\\"customerUpdatedFlag\\\" AS \\\"customerUpdatedFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailContactFlag\\\" AS \\\"automaticEmailContactFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailResourceFlag\\\" AS \\\"automaticEmailResourceFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailCcFlag\\\" AS \\\"automaticEmailCcFlag\\\", \\\"service_tickets\\\".\\\"closedDate\\\" AS \\\"closedDate\\\", \\\"service_tickets\\\".\\\"closedBy\\\" AS \\\"closedBy\\\", \\\"service_tickets\\\".\\\"closedFlag\\\" AS \\\"closedFlag\\\", \\\"service_tickets\\\".\\\"actualHours\\\" AS \\\"actualHours\\\", \\\"service_tickets\\\".\\\"approved\\\" AS \\\"approved\\\", \\\"service_tickets\\\".\\\"estimatedExpenseCost\\\" AS \\\"estimatedExpenseCost\\\", \\\"service_tickets\\\".\\\"estimatedExpenseRevenue\\\" AS \\\"estimatedExpenseRevenue\\\", \\\"service_tickets\\\".\\\"estimatedProductCost\\\" AS \\\"estimatedProductCost\\\", \\\"service_tickets\\\".\\\"estimatedProductRevenue\\\" AS \\\"estimatedProductRevenue\\\", \\\"service_tickets\\\".\\\"estimatedTimeCost\\\" AS \\\"estimatedTimeCost\\\", \\\"service_tickets\\\".\\\"estimatedTimeRevenue\\\" AS \\\"estimatedTimeRevenue\\\", \\\"service_tickets\\\".\\\"billingMethod\\\" AS \\\"billingMethod\\\", \\\"service_tickets\\\".\\\"dateResplan\\\" AS \\\"dateResplan\\\", \\\"service_tickets\\\".\\\"dateResponded\\\" AS \\\"dateResponded\\\", \\\"service_tickets\\\".\\\"resolveMinutes\\\" AS \\\"resolveMinutes\\\", \\\"service_tickets\\\".\\\"resPlanMinutes\\\" AS \\\"resPlanMinutes\\\", \\\"service_tickets\\\".\\\"respondMinutes\\\" AS \\\"respondMinutes\\\", \\\"service_tickets\\\".\\\"isInSla\\\" AS \\\"isInSla\\\", \\\"service_tickets\\\".\\\"hasChildTicket\\\" AS \\\"hasChildTicket\\\", \\\"service_tickets\\\".\\\"hasMergedChildTicketFlag\\\" AS \\\"hasMergedChildTicketFlag\\\", \\\"service_tickets\\\".\\\"billTime\\\" AS \\\"billTime\\\", \\\"service_tickets\\\".\\\"billExpenses\\\" AS \\\"billExpenses\\\", \\\"service_tickets\\\".\\\"billProducts\\\" AS \\\"billProducts\\\", \\\"service_tickets\\\".\\\"location.id\\\" AS \\\"location.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"location.name\\\" AS \\\"location.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.id\\\" AS \\\"department.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.identifier\\\" AS \\\"department.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.name\\\" AS \\\"department.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(service_tickets)\\\", \\\"service_tickets\\\".\\\"sla.id\\\" AS \\\"sla.id\\\", \\\"service_tickets\\\".\\\"sla.name\\\" AS \\\"sla.name\\\", \\\"service_tickets\\\".\\\"sla._info.sla_href\\\" AS \\\"sla._info.sla_href\\\", \\\"service_tickets\\\".\\\"currency.id\\\" AS \\\"currency.id\\\", \\\"service_tickets\\\".\\\"currency.symbol\\\" AS \\\"currency.symbol\\\", \\\"service_tickets\\\".\\\"currency.currencyCode\\\" AS \\\"currency.currencyCode\\\", \\\"service_tickets\\\".\\\"currency.decimalSeparator\\\" AS \\\"currency.decimalSeparator\\\", \\\"service_tickets\\\".\\\"currency.numberOfDecimals\\\" AS \\\"currency.numberOfDecimals\\\", \\\"service_tickets\\\".\\\"currency.thousandsSeparator\\\" AS \\\"currency.thousandsSeparator\\\", \\\"service_tickets\\\".\\\"currency.negativeParenthesesFlag\\\" AS \\\"currency.negativeParenthesesFlag\\\", \\\"service_tickets\\\".\\\"currency.displaySymbolFlag\\\" AS \\\"currency.displaySymbolFlag\\\", \\\"service_tickets\\\".\\\"currency.currencyIdentifier\\\" AS \\\"currency.currencyIdentifier\\\", \\\"service_tickets\\\".\\\"currency.displayIdFlag\\\" AS \\\"currency.displayIdFlag\\\", \\\"service_tickets\\\".\\\"currency.rightAlign\\\" AS \\\"currency.rightAlign\\\", \\\"service_tickets\\\".\\\"currency.name\\\" AS \\\"currency.name\\\", \\\"service_tickets\\\".\\\"currency._info.currency_href\\\" AS \\\"currency._info.currency_href\\\", \\\"service_tickets\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.scheduleentries_href\\\" AS \\\"_info.scheduleentries_href\\\", \\\"service_tickets\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.tasks_href\\\" AS \\\"_info.tasks_href\\\", \\\"service_tickets\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.products_href\\\" AS \\\"_info.products_href\\\", \\\"service_tickets\\\".\\\"_info.timeentries_href\\\" AS \\\"_info.timeentries_href\\\", \\\"service_tickets\\\".\\\"_info.expenseEntries_href\\\" AS \\\"_info.expenseEntries_href\\\", \\\"service_tickets\\\".\\\"escalationStartDateUTC\\\" AS \\\"escalationStartDateUTC\\\", \\\"service_tickets\\\".\\\"escalationLevel\\\" AS \\\"escalationLevel\\\", \\\"service_tickets\\\".\\\"minutesBeforeWaiting\\\" AS \\\"minutesBeforeWaiting\\\", \\\"service_tickets\\\".\\\"respondedSkippedMinutes\\\" AS \\\"respondedSkippedMinutes\\\", \\\"service_tickets\\\".\\\"resplanSkippedMinutes\\\" AS \\\"resplanSkippedMinutes\\\", \\\"service_tickets\\\".\\\"respondedHours\\\" AS \\\"respondedHours\\\", \\\"service_tickets\\\".\\\"respondedBy\\\" AS \\\"respondedBy\\\", \\\"service_tickets\\\".\\\"resplanHours\\\" AS \\\"resplanHours\\\", \\\"service_tickets\\\".\\\"resplanBy\\\" AS \\\"resplanBy\\\", \\\"service_tickets\\\".\\\"resolutionHours\\\" AS \\\"resolutionHours\\\", \\\"service_tickets\\\".\\\"minutesWaiting\\\" AS \\\"minutesWaiting\\\", \\\"service_tickets\\\".\\\"workType.id\\\" AS \\\"workType.id\\\", \\\"service_tickets\\\".\\\"workType.name\\\" AS \\\"workType.name\\\", \\\"service_tickets\\\".\\\"workType._info.workType_href\\\" AS \\\"workType._info.workType_href\\\", \\\"service_tickets\\\".\\\"resources\\\" AS \\\"resources\\\", \\\"service_tickets\\\".\\\"workRole.id\\\" AS \\\"workRole.id\\\", \\\"service_tickets\\\".\\\"workRole.name\\\" AS \\\"workRole.name\\\", \\\"service_tickets\\\".\\\"workRole._info.workRole_href\\\" AS \\\"workRole._info.workRole_href\\\", \\\"service_tickets\\\".\\\"type.id\\\" AS \\\"type.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"type.name\\\" AS \\\"type.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"requiredDate\\\" AS \\\"requiredDate\\\", \\\"service_tickets\\\".\\\"budgetHours\\\" AS \\\"budgetHours\\\", \\\"service_tickets\\\".\\\"requestForChangeFlag\\\" AS \\\"requestForChangeFlag\\\" FROM \\\"PJ-23\\\".\\\"company_companies\\\" AS \\\"company_companies\\\" INNER JOIN \\\"PJ-23\\\".\\\"company_configurations\\\" AS \\\"company_configurations\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"company_configurations\\\".\\\"id\\\" INNER JOIN \\\"PJ-23\\\".\\\"service_tickets\\\" AS \\\"service_tickets\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"service_tickets\\\".\\\"id\\\") temp_table GROUP BY \\\"name\\\", \\\"estimatedProductCost\\\", \\\"name\\\", \\\"estimatedProductCost\\\", \\\"billTime\\\", \\\"billProducts\\\", \\\"currency.name\\\" ORDER BY \\\"name\\\" ASC NULLS FIRST",
      "col_data": [
          " \"name\"",
          " \"estimatedProductCost\""
      ],
      "row_data": [
          " \"billTime\"",
          " \"billProducts\"",
          "\"sum(estimatedProductCost)\"",
          " \"currency.name\"",
          "\"sum(estimatedTimeCost)\""
      ],
      "sheet_query_data": {
          "columns_data": [
              {
                  "column": "name",
                  "data": [
                      "Big Design, Inc.",
                      "ConnectWise"
                  ]
              },
              {
                  "column": "estimatedProductCost",
                  "data": [
                      0.0,
                      0.0
                  ]
              }
          ],
          "rows_data": [
              {
                  "column": "billTime",
                  "data": [
                      "Billable",
                      "Billable"
                  ]
              },
              {
                  "column": "billProducts",
                  "data": [
                      "Billable",
                      "Billable"
                  ]
              },
              {
                  "column": "sum(estimatedProductCost)",
                  "data": [
                      0.0,
                      0.0
                  ]
              },
              {
                  "column": "currency.name",
                  "data": [
                      "US Dollars",
                      "US Dollars"
                  ]
              },
              {
                  "column": "sum(estimatedTimeCost)",
                  "data": [
                      0.0,
                      0.0
                  ]
              }
          ]
      }
  },
  {
      "sheet_id": 10969,
      "sheet_name": "Flags Info",
      "chart_id": 1,
      "sheet_tag_name": "<p>Flags Info</p>",
      "sheet_data": null,
      "created_by": 17,
      "sheet_filter_ids": [],
      "sheet_filter_quereyset_ids": "11085",
      "datasource_queryset_id": null,
      "filters_data": [],
      "custom_query": "SELECT \\\"name\\\" AS \\\"name\\\", CASE WHEN \\\"leadFlag\\\" THEN 'True' ELSE 'False' END AS \\\"leadFlag\\\", CASE WHEN \\\"deletedFlag\\\" THEN 'True' ELSE 'False' END AS \\\"deletedFlag\\\", CASE WHEN \\\"unsubscribeFlag\\\" THEN 'True' ELSE 'False' END AS \\\"unsubscribeFlag\\\", CASE WHEN \\\"isVendorFlag\\\" THEN 'True' ELSE 'False' END AS \\\"isVendorFlag\\\" FROM (SELECT \\\"company_companies\\\".\\\"id\\\" AS \\\"id\\\", \\\"company_companies\\\".\\\"identifier\\\" AS \\\"identifier\\\", \\\"company_companies\\\".\\\"name\\\" AS \\\"name\\\", \\\"company_companies\\\".\\\"status.id\\\" AS \\\"status.id\\\", \\\"company_companies\\\".\\\"status.name\\\" AS \\\"status.name\\\", \\\"company_companies\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href\\\", \\\"company_companies\\\".\\\"country.id\\\" AS \\\"country.id\\\", \\\"company_companies\\\".\\\"country.name\\\" AS \\\"country.name\\\", \\\"company_companies\\\".\\\"country._info.country_href\\\" AS \\\"country._info.country_href\\\", \\\"company_companies\\\".\\\"phoneNumber\\\" AS \\\"phoneNumber\\\", \\\"company_companies\\\".\\\"website\\\" AS \\\"website\\\", \\\"company_companies\\\".\\\"territory.id\\\" AS \\\"territory.id\\\", \\\"company_companies\\\".\\\"territory.name\\\" AS \\\"territory.name\\\", \\\"company_companies\\\".\\\"territory._info.location_href\\\" AS \\\"territory._info.location_href\\\", \\\"company_companies\\\".\\\"market.id\\\" AS \\\"market.id\\\", \\\"company_companies\\\".\\\"market.name\\\" AS \\\"market.name\\\", \\\"company_companies\\\".\\\"market._info.Market_href\\\" AS \\\"market._info.Market_href\\\", \\\"company_companies\\\".\\\"defaultContact.id\\\" AS \\\"defaultContact.id\\\", \\\"company_companies\\\".\\\"defaultContact.name\\\" AS \\\"defaultContact.name\\\", \\\"company_companies\\\".\\\"defaultContact._info.contact_href\\\" AS \\\"defaultContact._info.contact_href\\\", \\\"company_companies\\\".\\\"dateAcquired\\\" AS \\\"dateAcquired\\\", \\\"company_companies\\\".\\\"annualRevenue\\\" AS \\\"annualRevenue\\\", \\\"company_companies\\\".\\\"timeZoneSetup.id\\\" AS \\\"timeZoneSetup.id\\\", \\\"company_companies\\\".\\\"timeZoneSetup.name\\\" AS \\\"timeZoneSetup.name\\\", \\\"company_companies\\\".\\\"timeZoneSetup._info.timeZoneSetup_href\\\" AS \\\"timeZoneSetup._info.timeZoneSetup_href\\\", \\\"company_companies\\\".\\\"leadFlag\\\" AS \\\"leadFlag\\\", \\\"company_companies\\\".\\\"unsubscribeFlag\\\" AS \\\"unsubscribeFlag\\\", \\\"company_companies\\\".\\\"taxCode.id\\\" AS \\\"taxCode.id\\\", \\\"company_companies\\\".\\\"taxCode.name\\\" AS \\\"taxCode.name\\\", \\\"company_companies\\\".\\\"taxCode._info.taxCode_href\\\" AS \\\"taxCode._info.taxCode_href\\\", \\\"company_companies\\\".\\\"billingTerms.id\\\" AS \\\"billingTerms.id\\\", \\\"company_companies\\\".\\\"billingTerms.name\\\" AS \\\"billingTerms.name\\\", \\\"company_companies\\\".\\\"billToCompany.id\\\" AS \\\"billToCompany.id\\\", \\\"company_companies\\\".\\\"billToCompany.identifier\\\" AS \\\"billToCompany.identifier\\\", \\\"company_companies\\\".\\\"billToCompany.name\\\" AS \\\"billToCompany.name\\\", \\\"company_companies\\\".\\\"billToCompany._info.company_href\\\" AS \\\"billToCompany._info.company_href\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.id\\\" AS \\\"invoiceDeliveryMethod.id\\\", \\\"company_companies\\\".\\\"invoiceDeliveryMethod.name\\\" AS \\\"invoiceDeliveryMethod.name\\\", \\\"company_companies\\\".\\\"deletedFlag\\\" AS \\\"deletedFlag\\\", \\\"company_companies\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid\\\", \\\"company_companies\\\".\\\"isVendorFlag\\\" AS \\\"isVendorFlag\\\", \\\"company_companies\\\".\\\"types[0].id\\\" AS \\\"types[0].id\\\", \\\"company_companies\\\".\\\"types[0].name\\\" AS \\\"types[0].name\\\", \\\"company_companies\\\".\\\"types[0]._info.type_href\\\" AS \\\"types[0]._info.type_href\\\", \\\"company_companies\\\".\\\"site.id\\\" AS \\\"site.id\\\", \\\"company_companies\\\".\\\"site.name\\\" AS \\\"site.name\\\", \\\"company_companies\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href\\\", \\\"company_companies\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated\\\", \\\"company_companies\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy\\\", \\\"company_companies\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered\\\", \\\"company_companies\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy\\\", \\\"company_companies\\\".\\\"_info.contacts_href\\\" AS \\\"_info.contacts_href\\\", \\\"company_companies\\\".\\\"_info.agreements_href\\\" AS \\\"_info.agreements_href\\\", \\\"company_companies\\\".\\\"_info.tickets_href\\\" AS \\\"_info.tickets_href\\\", \\\"company_companies\\\".\\\"_info.opportunities_href\\\" AS \\\"_info.opportunities_href\\\", \\\"company_companies\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href\\\", \\\"company_companies\\\".\\\"_info.projects_href\\\" AS \\\"_info.projects_href\\\", \\\"company_companies\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href\\\", \\\"company_companies\\\".\\\"_info.orders_href\\\" AS \\\"_info.orders_href\\\", \\\"company_companies\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href\\\", \\\"company_companies\\\".\\\"_info.sites_href\\\" AS \\\"_info.sites_href\\\", \\\"company_companies\\\".\\\"_info.teams_href\\\" AS \\\"_info.teams_href\\\", \\\"company_companies\\\".\\\"_info.reports_href\\\" AS \\\"_info.reports_href\\\", \\\"company_companies\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href\\\", \\\"company_companies\\\".\\\"addressLine1\\\" AS \\\"addressLine1\\\", \\\"company_companies\\\".\\\"addressLine2\\\" AS \\\"addressLine2\\\", \\\"company_companies\\\".\\\"city\\\" AS \\\"city\\\", \\\"company_companies\\\".\\\"state\\\" AS \\\"state\\\", \\\"company_companies\\\".\\\"zip\\\" AS \\\"zip\\\", \\\"company_companies\\\".\\\"faxNumber\\\" AS \\\"faxNumber\\\", \\\"company_companies\\\".\\\"accountNumber\\\" AS \\\"accountNumber\\\", \\\"company_companies\\\".\\\"numberOfEmployees\\\" AS \\\"numberOfEmployees\\\", \\\"company_companies\\\".\\\"leadSource\\\" AS \\\"leadSource\\\", \\\"company_companies\\\".\\\"billingContact.id\\\" AS \\\"billingContact.id\\\", \\\"company_companies\\\".\\\"billingContact.name\\\" AS \\\"billingContact.name\\\", \\\"company_companies\\\".\\\"billingContact._info.contact_href\\\" AS \\\"billingContact._info.contact_href\\\", \\\"company_companies\\\".\\\"invoiceToEmailAddress\\\" AS \\\"invoiceToEmailAddress\\\", \\\"company_companies\\\".\\\"billingSite.id\\\" AS \\\"billingSite.id\\\", \\\"company_companies\\\".\\\"billingSite.name\\\" AS \\\"billingSite.name\\\", \\\"company_companies\\\".\\\"billingSite._info.site_href\\\" AS \\\"billingSite._info.site_href\\\", \\\"company_configurations\\\".\\\"id\\\" AS \\\"id(company_configurations)\\\", \\\"company_configurations\\\".\\\"name\\\" AS \\\"name(company_configurations)\\\", \\\"company_configurations\\\".\\\"type.id\\\" AS \\\"type.id\\\", \\\"company_configurations\\\".\\\"type.name\\\" AS \\\"type.name\\\", \\\"company_configurations\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href\\\", \\\"company_configurations\\\".\\\"status.id\\\" AS \\\"status.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"status.name\\\" AS \\\"status.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"company.id\\\" AS \\\"company.id\\\", \\\"company_configurations\\\".\\\"company.identifier\\\" AS \\\"company.identifier\\\", \\\"company_configurations\\\".\\\"company.name\\\" AS \\\"company.name\\\", \\\"company_configurations\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href\\\", \\\"company_configurations\\\".\\\"contact.id\\\" AS \\\"contact.id\\\", \\\"company_configurations\\\".\\\"contact.name\\\" AS \\\"contact.name\\\", \\\"company_configurations\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href\\\", \\\"company_configurations\\\".\\\"site.id\\\" AS \\\"site.id(company_configurations)\\\", \\\"company_configurations\\\".\\\"site.name\\\" AS \\\"site.name(company_configurations)\\\", \\\"company_configurations\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(company_configurations)\\\", \\\"company_configurations\\\".\\\"locationId\\\" AS \\\"locationId\\\", \\\"company_configurations\\\".\\\"location.id\\\" AS \\\"location.id\\\", \\\"company_configurations\\\".\\\"location.name\\\" AS \\\"location.name\\\", \\\"company_configurations\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href\\\", \\\"company_configurations\\\".\\\"businessUnitId\\\" AS \\\"businessUnitId\\\", \\\"company_configurations\\\".\\\"department.id\\\" AS \\\"department.id\\\", \\\"company_configurations\\\".\\\"department.identifier\\\" AS \\\"department.identifier\\\", \\\"company_configurations\\\".\\\"department.name\\\" AS \\\"department.name\\\", \\\"company_configurations\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href\\\", \\\"company_configurations\\\".\\\"serialNumber\\\" AS \\\"serialNumber\\\", \\\"company_configurations\\\".\\\"modelNumber\\\" AS \\\"modelNumber\\\", \\\"company_configurations\\\".\\\"tagNumber\\\" AS \\\"tagNumber\\\", \\\"company_configurations\\\".\\\"warrantyExpirationDate\\\" AS \\\"warrantyExpirationDate\\\", \\\"company_configurations\\\".\\\"notes\\\" AS \\\"notes\\\", \\\"company_configurations\\\".\\\"billFlag\\\" AS \\\"billFlag\\\", \\\"company_configurations\\\".\\\"vendor.id\\\" AS \\\"vendor.id\\\", \\\"company_configurations\\\".\\\"vendor.identifier\\\" AS \\\"vendor.identifier\\\", \\\"company_configurations\\\".\\\"vendor.name\\\" AS \\\"vendor.name\\\", \\\"company_configurations\\\".\\\"vendor._info.company_href\\\" AS \\\"vendor._info.company_href\\\", \\\"company_configurations\\\".\\\"activeFlag\\\" AS \\\"activeFlag\\\", \\\"company_configurations\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(company_configurations)\\\", \\\"company_configurations\\\".\\\"companyLocationId\\\" AS \\\"companyLocationId\\\", \\\"company_configurations\\\".\\\"showRemoteFlag\\\" AS \\\"showRemoteFlag\\\", \\\"company_configurations\\\".\\\"showAutomateFlag\\\" AS \\\"showAutomateFlag\\\", \\\"company_configurations\\\".\\\"needsRenewalFlag\\\" AS \\\"needsRenewalFlag\\\", \\\"company_configurations\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(company_configurations)\\\", \\\"company_configurations\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(company_configurations)\\\", \\\"company_configurations\\\".\\\"backupSuccesses\\\" AS \\\"backupSuccesses\\\", \\\"company_configurations\\\".\\\"backupIncomplete\\\" AS \\\"backupIncomplete\\\", \\\"company_configurations\\\".\\\"backupFailed\\\" AS \\\"backupFailed\\\", \\\"company_configurations\\\".\\\"backupRestores\\\" AS \\\"backupRestores\\\", \\\"company_configurations\\\".\\\"backupBillableSpaceGb\\\" AS \\\"backupBillableSpaceGb\\\", \\\"company_configurations\\\".\\\"backupYear\\\" AS \\\"backupYear\\\", \\\"company_configurations\\\".\\\"backupMonth\\\" AS \\\"backupMonth\\\", \\\"service_tickets\\\".\\\"id\\\" AS \\\"id(service_tickets)\\\", \\\"service_tickets\\\".\\\"summary\\\" AS \\\"summary\\\", \\\"service_tickets\\\".\\\"recordType\\\" AS \\\"recordType\\\", \\\"service_tickets\\\".\\\"board.id\\\" AS \\\"board.id\\\", \\\"service_tickets\\\".\\\"board.name\\\" AS \\\"board.name\\\", \\\"service_tickets\\\".\\\"board._info.board_href\\\" AS \\\"board._info.board_href\\\", \\\"service_tickets\\\".\\\"status.id\\\" AS \\\"status.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.name\\\" AS \\\"status.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"status.Sort\\\" AS \\\"status.Sort\\\", \\\"service_tickets\\\".\\\"status._info.status_href\\\" AS \\\"status._info.status_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.id\\\" AS \\\"company.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.identifier\\\" AS \\\"company.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"company.name\\\" AS \\\"company.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.company_href\\\" AS \\\"company._info.company_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"company._info.mobileGuid\\\" AS \\\"company._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"site.id\\\" AS \\\"site.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"site.name\\\" AS \\\"site.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.site_href\\\" AS \\\"site._info.site_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"site._info.mobileGuid\\\" AS \\\"site._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"addressLine1\\\" AS \\\"addressLine1(service_tickets)\\\", \\\"service_tickets\\\".\\\"addressLine2\\\" AS \\\"addressLine2(service_tickets)\\\", \\\"service_tickets\\\".\\\"city\\\" AS \\\"city(service_tickets)\\\", \\\"service_tickets\\\".\\\"stateIdentifier\\\" AS \\\"stateIdentifier\\\", \\\"service_tickets\\\".\\\"zip\\\" AS \\\"zip(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.id\\\" AS \\\"contact.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact.name\\\" AS \\\"contact.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"contact._info.mobileGuid\\\" AS \\\"contact._info.mobileGuid\\\", \\\"service_tickets\\\".\\\"contact._info.contact_href\\\" AS \\\"contact._info.contact_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"contactName\\\" AS \\\"contactName\\\", \\\"service_tickets\\\".\\\"contactPhoneNumber\\\" AS \\\"contactPhoneNumber\\\", \\\"service_tickets\\\".\\\"contactPhoneExtension\\\" AS \\\"contactPhoneExtension\\\", \\\"service_tickets\\\".\\\"contactEmailAddress\\\" AS \\\"contactEmailAddress\\\", \\\"service_tickets\\\".\\\"team.id\\\" AS \\\"team.id\\\", \\\"service_tickets\\\".\\\"team.name\\\" AS \\\"team.name\\\", \\\"service_tickets\\\".\\\"team._info.team_href\\\" AS \\\"team._info.team_href\\\", \\\"service_tickets\\\".\\\"priority.id\\\" AS \\\"priority.id\\\", \\\"service_tickets\\\".\\\"priority.name\\\" AS \\\"priority.name\\\", \\\"service_tickets\\\".\\\"priority.sort\\\" AS \\\"priority.sort\\\", \\\"service_tickets\\\".\\\"priority._info.priority_href\\\" AS \\\"priority._info.priority_href\\\", \\\"service_tickets\\\".\\\"priority._info.image_href\\\" AS \\\"priority._info.image_href\\\", \\\"service_tickets\\\".\\\"serviceLocation.id\\\" AS \\\"serviceLocation.id\\\", \\\"service_tickets\\\".\\\"serviceLocation.name\\\" AS \\\"serviceLocation.name\\\", \\\"service_tickets\\\".\\\"serviceLocation._info.location_href\\\" AS \\\"serviceLocation._info.location_href\\\", \\\"service_tickets\\\".\\\"source.id\\\" AS \\\"source.id\\\", \\\"service_tickets\\\".\\\"source.name\\\" AS \\\"source.name\\\", \\\"service_tickets\\\".\\\"source._info.source_href\\\" AS \\\"source._info.source_href\\\", \\\"service_tickets\\\".\\\"agreement.id\\\" AS \\\"agreement.id\\\", \\\"service_tickets\\\".\\\"agreement.name\\\" AS \\\"agreement.name\\\", \\\"service_tickets\\\".\\\"agreement._info.agreement_href\\\" AS \\\"agreement._info.agreement_href\\\", \\\"service_tickets\\\".\\\"severity\\\" AS \\\"severity\\\", \\\"service_tickets\\\".\\\"impact\\\" AS \\\"impact\\\", \\\"service_tickets\\\".\\\"allowAllClientsPortalView\\\" AS \\\"allowAllClientsPortalView\\\", \\\"service_tickets\\\".\\\"customerUpdatedFlag\\\" AS \\\"customerUpdatedFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailContactFlag\\\" AS \\\"automaticEmailContactFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailResourceFlag\\\" AS \\\"automaticEmailResourceFlag\\\", \\\"service_tickets\\\".\\\"automaticEmailCcFlag\\\" AS \\\"automaticEmailCcFlag\\\", \\\"service_tickets\\\".\\\"closedDate\\\" AS \\\"closedDate\\\", \\\"service_tickets\\\".\\\"closedBy\\\" AS \\\"closedBy\\\", \\\"service_tickets\\\".\\\"closedFlag\\\" AS \\\"closedFlag\\\", \\\"service_tickets\\\".\\\"actualHours\\\" AS \\\"actualHours\\\", \\\"service_tickets\\\".\\\"approved\\\" AS \\\"approved\\\", \\\"service_tickets\\\".\\\"estimatedExpenseCost\\\" AS \\\"estimatedExpenseCost\\\", \\\"service_tickets\\\".\\\"estimatedExpenseRevenue\\\" AS \\\"estimatedExpenseRevenue\\\", \\\"service_tickets\\\".\\\"estimatedProductCost\\\" AS \\\"estimatedProductCost\\\", \\\"service_tickets\\\".\\\"estimatedProductRevenue\\\" AS \\\"estimatedProductRevenue\\\", \\\"service_tickets\\\".\\\"estimatedTimeCost\\\" AS \\\"estimatedTimeCost\\\", \\\"service_tickets\\\".\\\"estimatedTimeRevenue\\\" AS \\\"estimatedTimeRevenue\\\", \\\"service_tickets\\\".\\\"billingMethod\\\" AS \\\"billingMethod\\\", \\\"service_tickets\\\".\\\"dateResplan\\\" AS \\\"dateResplan\\\", \\\"service_tickets\\\".\\\"dateResponded\\\" AS \\\"dateResponded\\\", \\\"service_tickets\\\".\\\"resolveMinutes\\\" AS \\\"resolveMinutes\\\", \\\"service_tickets\\\".\\\"resPlanMinutes\\\" AS \\\"resPlanMinutes\\\", \\\"service_tickets\\\".\\\"respondMinutes\\\" AS \\\"respondMinutes\\\", \\\"service_tickets\\\".\\\"isInSla\\\" AS \\\"isInSla\\\", \\\"service_tickets\\\".\\\"hasChildTicket\\\" AS \\\"hasChildTicket\\\", \\\"service_tickets\\\".\\\"hasMergedChildTicketFlag\\\" AS \\\"hasMergedChildTicketFlag\\\", \\\"service_tickets\\\".\\\"billTime\\\" AS \\\"billTime\\\", \\\"service_tickets\\\".\\\"billExpenses\\\" AS \\\"billExpenses\\\", \\\"service_tickets\\\".\\\"billProducts\\\" AS \\\"billProducts\\\", \\\"service_tickets\\\".\\\"location.id\\\" AS \\\"location.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"location.name\\\" AS \\\"location.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"location._info.location_href\\\" AS \\\"location._info.location_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.id\\\" AS \\\"department.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.identifier\\\" AS \\\"department.identifier(service_tickets)\\\", \\\"service_tickets\\\".\\\"department.name\\\" AS \\\"department.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"department._info.department_href\\\" AS \\\"department._info.department_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"mobileGuid\\\" AS \\\"mobileGuid(service_tickets)\\\", \\\"service_tickets\\\".\\\"sla.id\\\" AS \\\"sla.id\\\", \\\"service_tickets\\\".\\\"sla.name\\\" AS \\\"sla.name\\\", \\\"service_tickets\\\".\\\"sla._info.sla_href\\\" AS \\\"sla._info.sla_href\\\", \\\"service_tickets\\\".\\\"currency.id\\\" AS \\\"currency.id\\\", \\\"service_tickets\\\".\\\"currency.symbol\\\" AS \\\"currency.symbol\\\", \\\"service_tickets\\\".\\\"currency.currencyCode\\\" AS \\\"currency.currencyCode\\\", \\\"service_tickets\\\".\\\"currency.decimalSeparator\\\" AS \\\"currency.decimalSeparator\\\", \\\"service_tickets\\\".\\\"currency.numberOfDecimals\\\" AS \\\"currency.numberOfDecimals\\\", \\\"service_tickets\\\".\\\"currency.thousandsSeparator\\\" AS \\\"currency.thousandsSeparator\\\", \\\"service_tickets\\\".\\\"currency.negativeParenthesesFlag\\\" AS \\\"currency.negativeParenthesesFlag\\\", \\\"service_tickets\\\".\\\"currency.displaySymbolFlag\\\" AS \\\"currency.displaySymbolFlag\\\", \\\"service_tickets\\\".\\\"currency.currencyIdentifier\\\" AS \\\"currency.currencyIdentifier\\\", \\\"service_tickets\\\".\\\"currency.displayIdFlag\\\" AS \\\"currency.displayIdFlag\\\", \\\"service_tickets\\\".\\\"currency.rightAlign\\\" AS \\\"currency.rightAlign\\\", \\\"service_tickets\\\".\\\"currency.name\\\" AS \\\"currency.name\\\", \\\"service_tickets\\\".\\\"currency._info.currency_href\\\" AS \\\"currency._info.currency_href\\\", \\\"service_tickets\\\".\\\"_info.lastUpdated\\\" AS \\\"_info.lastUpdated(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.updatedBy\\\" AS \\\"_info.updatedBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.dateEntered\\\" AS \\\"_info.dateEntered(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.enteredBy\\\" AS \\\"_info.enteredBy(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.activities_href\\\" AS \\\"_info.activities_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.scheduleentries_href\\\" AS \\\"_info.scheduleentries_href\\\", \\\"service_tickets\\\".\\\"_info.documents_href\\\" AS \\\"_info.documents_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.configurations_href\\\" AS \\\"_info.configurations_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.tasks_href\\\" AS \\\"_info.tasks_href\\\", \\\"service_tickets\\\".\\\"_info.notes_href\\\" AS \\\"_info.notes_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"_info.products_href\\\" AS \\\"_info.products_href\\\", \\\"service_tickets\\\".\\\"_info.timeentries_href\\\" AS \\\"_info.timeentries_href\\\", \\\"service_tickets\\\".\\\"_info.expenseEntries_href\\\" AS \\\"_info.expenseEntries_href\\\", \\\"service_tickets\\\".\\\"escalationStartDateUTC\\\" AS \\\"escalationStartDateUTC\\\", \\\"service_tickets\\\".\\\"escalationLevel\\\" AS \\\"escalationLevel\\\", \\\"service_tickets\\\".\\\"minutesBeforeWaiting\\\" AS \\\"minutesBeforeWaiting\\\", \\\"service_tickets\\\".\\\"respondedSkippedMinutes\\\" AS \\\"respondedSkippedMinutes\\\", \\\"service_tickets\\\".\\\"resplanSkippedMinutes\\\" AS \\\"resplanSkippedMinutes\\\", \\\"service_tickets\\\".\\\"respondedHours\\\" AS \\\"respondedHours\\\", \\\"service_tickets\\\".\\\"respondedBy\\\" AS \\\"respondedBy\\\", \\\"service_tickets\\\".\\\"resplanHours\\\" AS \\\"resplanHours\\\", \\\"service_tickets\\\".\\\"resplanBy\\\" AS \\\"resplanBy\\\", \\\"service_tickets\\\".\\\"resolutionHours\\\" AS \\\"resolutionHours\\\", \\\"service_tickets\\\".\\\"minutesWaiting\\\" AS \\\"minutesWaiting\\\", \\\"service_tickets\\\".\\\"workType.id\\\" AS \\\"workType.id\\\", \\\"service_tickets\\\".\\\"workType.name\\\" AS \\\"workType.name\\\", \\\"service_tickets\\\".\\\"workType._info.workType_href\\\" AS \\\"workType._info.workType_href\\\", \\\"service_tickets\\\".\\\"resources\\\" AS \\\"resources\\\", \\\"service_tickets\\\".\\\"workRole.id\\\" AS \\\"workRole.id\\\", \\\"service_tickets\\\".\\\"workRole.name\\\" AS \\\"workRole.name\\\", \\\"service_tickets\\\".\\\"workRole._info.workRole_href\\\" AS \\\"workRole._info.workRole_href\\\", \\\"service_tickets\\\".\\\"type.id\\\" AS \\\"type.id(service_tickets)\\\", \\\"service_tickets\\\".\\\"type.name\\\" AS \\\"type.name(service_tickets)\\\", \\\"service_tickets\\\".\\\"type._info.type_href\\\" AS \\\"type._info.type_href(service_tickets)\\\", \\\"service_tickets\\\".\\\"requiredDate\\\" AS \\\"requiredDate\\\", \\\"service_tickets\\\".\\\"budgetHours\\\" AS \\\"budgetHours\\\", \\\"service_tickets\\\".\\\"requestForChangeFlag\\\" AS \\\"requestForChangeFlag\\\" FROM \\\"PJ-23\\\".\\\"company_companies\\\" AS \\\"company_companies\\\" INNER JOIN \\\"PJ-23\\\".\\\"company_configurations\\\" AS \\\"company_configurations\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"company_configurations\\\".\\\"id\\\" INNER JOIN \\\"PJ-23\\\".\\\"service_tickets\\\" AS \\\"service_tickets\\\" ON \\\"company_companies\\\".\\\"id\\\" = \\\"service_tickets\\\".\\\"id\\\") temp_table GROUP BY \\\"name\\\", \\\"name\\\", \\\"leadFlag\\\", \\\"deletedFlag\\\", \\\"unsubscribeFlag\\\", \\\"isVendorFlag\\\" ORDER BY \\\"name\\\" ASC NULLS FIRST",
      "col_data": [
          " \"name\""
      ],
      "row_data": [
          " \"leadFlag\"",
          " \"deletedFlag\"",
          " \"unsubscribeFlag\"",
          " \"isVendorFlag\""
      ],
      "sheet_query_data": {
          "columns_data": [
              {
                  "column": "name",
                  "data": [
                      "Big Design, Inc.",
                      "ConnectWise"
                  ]
              }
          ],
          "rows_data": [
              {
                  "column": "leadFlag",
                  "data": [
                      "False",
                      "False"
                  ]
              },
              {
                  "column": "deletedFlag",
                  "data": [
                      "False",
                      "False"
                  ]
              },
              {
                  "column": "unsubscribeFlag",
                  "data": [
                      "False",
                      "False"
                  ]
              },
              {
                  "column": "isVendorFlag",
                  "data": [
                      "False",
                      "True"
                  ]
              }
          ]
      }
  }
]
  
  tableList = [] as any;
  dragedTableName: any;
  databaseconnectionsList!:boolean;
  draggedtables = [] as any;
  getTableColumns = [] as any;
  getTableRows = [] as any;
  relationOfTables = [] as any;
  databaseId:any;
  fileId:any;
  databaseType:any;
  openPostgreSqlForm= false;
  openMySqlForm = false;
  openConnectWiseForm = false;
  openHaloPSAForm = false;
  openOracleForm = false;
  openMicrosoftSqlServerForm = false;
  openSnowflakeServerForm = false;
  openMongoDbForm = false;
  sqlLiteForm = false;
  openTablesUI = false;
  ibmDb2Form = false;
  databaseName:any;
  tableName:any;
  selectedClmnT1:any;
  selectedClmnT2:any;
  selectedCndn:any;
  tableRelationUi = false;
  custmT1Data = [] as any;
  custmT2Data = [] as any;
  connectionList =[] as any;
  searchDbName :any;
  viewNewDbs!:boolean;
  showPassword1 = false;
  toggleClass = "off-line";
  toggleClass1 = "off-line";
  gridView = true;

  itemsPerPage!:any;
  pageNo = 1;
  page: number = 1;
  totalItems:any;
  fileData:any;
  viewDatasourceList = false;
  selectedMicroSoftAuthType: string | null = null;
  constructor(private sharedDataService: SharedService,private modalService: NgbModal, private workbechService:WorkbenchService,private router:Router,private toasterservice:ToastrService,
    private viewTemplateService:ViewTemplateDrivenService,@Inject(DOCUMENT) private document: Document,private loaderService:LoaderService,private cd:ChangeDetectorRef,private eChart: InsightEchartComponent){ 
    localStorage.setItem('QuerySetId', '0');
    localStorage.setItem('customQuerySetId', '0');
    const currentUrl = this.router.url; 
    if(currentUrl.includes('analytify/datasources/view-connections')){
      this.databaseconnectionsList= true;  
       this.viewNewDbs= false;
    } 
    if(currentUrl.includes('analytify/datasources/new-connections')){
      this.viewNewDbs = true;
      this.databaseconnectionsList = false;
    }
    this.viewDatasourceList = this.viewTemplateService.viewDtabase();
  }
  routeNewDatabase(){
    this.router.navigate(['analytify/datasources/new-connections'])
  }
  routeViewDatabase(){
    this.router.navigate(['analytify/datasources/view-connections'])
  }

    postGreServerName = '';
    postGrePortName = '';
    postGreDatabaseName = '';
    postGreUserName = '';
    PostGrePassword = '';
    OracleServiceName = '';
    displayName ='';
    clientId = '';
    companyId = '';
    siteURL = '';
    siteURLPSA = '';
    clientSecret = '';
    clientIdPSA = '';
    publicKey = '';
    privateKey = '';
    path='';

  emptyVariables(){
    this.postGrePortName = '';
    this.postGreDatabaseName = '';
    this.postGreServerName = '';
    this.postGreUserName = '';
    this.PostGrePassword = '';
    this.OracleServiceName = '';
    this.displayName ='';
    this.path='';
    this.clientId = '';
    this.privateKey = '';
    this.publicKey = '';
    this.siteURL = '';
    this.companyId = '';
    this.siteURLPSA = '';
    this.clientIdPSA = '';
    this.clientSecret = '';
    
  }  
    openPostgreSql(){
    this.openPostgreSqlForm=true;
    this.databaseconnectionsList= false;
    this.viewNewDbs = false;
      this.emptyVariables();
    }
    postgreSignIn(){
      const obj={
          "database_type":"postgresql",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "database": this.postGreDatabaseName,
          "display_name":this.displayName
      }
        this.workbechService.postGreSqlConnection(obj).subscribe({next: (responce) => {
              console.log(responce);
              console.log('tablelist',this.tableList)
              if(responce){
                this.databaseName = responce.database.database_name
                this.databaseId = responce.database?.hierarchy_id
                this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                this.openPostgreSqlForm = false;
                const encodedId = btoa(this.databaseId.toString());
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            }
          }
        )

    }

    connectWiseUpdate(){
      const obj = {
        "company_id":this.companyId,
        "site_url": this.siteURL,
        "public_key":this.publicKey,
        "private_key": this.privateKey,
        "client_id": this.clientId,
        "display_name": this.displayName,
        "hierarchy_id":this.databaseId
    }

      this.workbechService.connectWiseConnectionUpdate(obj).subscribe({next: (responce) => {
            console.log(responce);
            this.modalService.dismissAll('close');
            if(responce){
              this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
            }
            this.getDbConnectionList();
          },
          error: (error) => {
            console.log(error);
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          }
        }
      )

    }
    
    haloPSAUpdate(){
      const obj = {
        "site_url": this.siteURLPSA,
        "client_id": this.clientIdPSA,
        "client_secret": this.clientSecret,
        "display_name": this.displayName,
        "hierarchy_id":this.databaseId
      }

      this.workbechService.haloPSAConnectionUpdate(obj).subscribe({next: (responce) => {
            console.log(responce);
            this.modalService.dismissAll('close');
            if(responce){
              this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
            }
            this.getDbConnectionList();
          },
          error: (error) => {
            console.log(error);
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          }
        }
      )

    }

    DatabaseUpdate(){
      const obj={
          // "database_type":"postgresql",
          "database_type":this.databaseType,
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "database": this.postGreDatabaseName,
          "display_name":this.displayName,
          "database_id":this.databaseId
      }as any
      if(this.databaseType === 'oracle'){
        delete obj.database
        obj.service_name=this.postGreDatabaseName;
      }
        this.workbechService.postGreSqlConnectionput(obj).subscribe({next: (responce) => {
              console.log(responce);
              this.modalService.dismissAll('close');
              if(responce){
                this.toasterservice.success('Updated Successfully','success',{ positionClass: 'toast-top-right'});
              }
              this.getDbConnectionList();
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            }
          }
        )

    }
    openOracle(){
      this.openOracleForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }


    OracleSignIn(){
      const obj={
          "database_type":"oracle",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "service_name":this.postGreDatabaseName

      }
        this.workbechService.postGreSqlConnection(obj).subscribe({next: (responce) => {
              console.log(responce);
              console.log('tablelist',this.tableList)
              if(responce){
                this.databaseName = responce.database.database_name
                this.databaseId = responce.database?.hierarchy_id
                this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                this.modalService.dismissAll();
                this.openOracleForm = false;
                const encodedId = btoa(this.databaseId.toString());
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            }
          }
        )
    }
    openMySql(){
      this.openMySqlForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    connectWise(){
      this.openConnectWiseForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }

    connectHaloPSA(){
      this.openHaloPSAForm = true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }

    companyIdError(){
      if(this.companyId){
        this.companyIDError = false;
      }else{
        this.companyIDError = true;
      }
    }

    siteUrlError(){
      if(this.siteURL){
        this.siteURLError = false;
      }else{
        this.siteURLError = true;
      }
    }
    siteUrlPSAError(){
      if(this.siteURLPSA){
        this.siteURLErrorPSA = false;
      }else{
        this.siteURLErrorPSA = true;
      }
    }
    clientSecretsError(){
      if(this.clientSecret){
        this.clientSecretError = false;
      }else{
        this.clientSecretError = true;
      }
    }
    clientIdErrorPSA(){
      if(this.clientIdPSA){
        this.clientIDPSAError = false;
      }else{
        this.clientIDPSAError = true;
      }
    }
    privateConnectWiseError(){
      if(this.privateKey){
        this.privateKeyError = false;
      }else{
        this.privateKeyError = true;
      }
    }
    publicConnectWiseError(){
      if(this.publicKey){
        this.publicKeyError = false;
      }else{
        this.publicKeyError = true;
      }
    }
    clientIdError(){
      if(this.clientId){
        this.clientIDError = false;
      }else{
        this.clientIDError = true;
      }
    }
    connectWiseSignIn(){
      const obj={
        "company_id":this.companyId,
        "site_url": this.siteURL,
        "public_key":this.publicKey,
        "private_key": this.privateKey,
        "client_id": this.clientId,
        "display_name": this.displayName
    }
      this.workbechService.connectWiseConnection(obj).subscribe({next: (responce) => {
        console.log(responce)
            if(responce){
              this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
              this.databaseId=responce?.hierarchy_id;
              this.modalService.dismissAll();
              this.openConnectWiseForm = false;
              const encodedId = btoa(this.databaseId.toString());
              Swal.fire({
                position: "center",
                icon: "question",
                title: "Would like to view any sample dashboard?",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.buildSampleDashboard();
                } else {
                  this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
                }
              });
            }
          },
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            console.log(error);
          }
        }
      )
    }

    buildSampleDashboard(){
      this.workbechService.buildSampleDashbaord(this.databaseId).subscribe({next: (responce) => {
        console.log(responce)
            if(responce){
              responce.forEach((data:any) => {
                this.sheetUpdate();
              });
            }
          },
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            console.log(error);
          }
        }
      )
    }
  sheetUpdate() {
    let data: any = this.test[5];
    let chartData = this.eChart.pieChart();
    const obj={
      "chart_id": data.chart_id,
      "queryset_id":data.queryset_id,
      "server_id": data.hierarchy_id,
      "sheet_name": data.sheet_name,
      "sheet_tag_name": data.sheet_tag_name,
      "filter_id":data.sheet_filter_ids,
      "sheetfilter_querysets_id":data.sheet_filter_quereyset_ids,
      "filter_data": data.filters_data,
      "datasource_querysetid": data.datasource_queryset_id,
      "col": data.col_data,
      "row": data.row_data,
      "custom_query":data.custom_query,
      "data":{
        "drillDownHierarchy":this.draggedDrillDownColumns,
        "isDrillDownData" : this.dateDrillDownSwitch,
      "columns": this.draggedColumns,
      "columns_data":draggedColumnsObj,
      "rows": this.draggedRows,
      "rows_data":this.draggedRowsData,
      "col":tablePreviewCol,
      "row":tablePreviewRow,
      "results": {
        "tableData":this.saveTableData,
        "tableColumns":this.savedisplayedColumns,
        "banding":this.banding,
        "color1":bandColor1,
        "color2":bandColor2,
        "items_per_page":this.itemsPerPage,
        "total_items":this.totalItems,
    
        "barYaxis":this.saveBar,
        "barXaxis":this.barXaxis,
      //  "barOptions":this.barOptions,
    
        "pieYaxis":this.savePie,
        "pieXaxis":this.pieXaxis,
      //   "pieOptions":this.pieOptions,
    
        "lineYaxis":this.lineYaxis,
        "lineXaxis": this.lineXaxis,
      //   "lineOptions":this.lineOptions,
    
        "areaYaxis":this.areaYaxis,
        "areaXaxis":this.areaXaxis,
      //   "areaOptions":this.areaOptions,
    
          "sidebysideBarYaxis": this.sidebysideBarYaxis,
          "sidebysideBarXaxis": this.sidebysideBarXaxis,
      //     "sidebysideBarOptions":this.sidebysideBarOptions,
       
          "stokedBarYaxis": this.stokedBarYaxis,
          "stokedBarXaxis": this.stokedBarXaxis,
      //     "stokedOptions":this.stokedOptions,
      
          "barLineYaxis":this.barLineYaxis,
          "barLineXaxis":this.barLineXaxis,
      //     "barLineOptions":this.barLineOptions,
    
        "hStockedYaxis": this.hStockedYaxis,
          "hStockedXaxis": this.hStockedXaxis,
      //     "hStockedOptions":this.hStockedOptions,
    
          "hgroupedYaxis": this.hgroupedYaxis,
          "hgroupedXaxis": this.hgroupedXaxis,
      //     "hgroupedOptions":this.hgroupedOptions,
    
          "multiLineYaxis":this.multiLineYaxis,
          "multiLineXaxis": this.multiLineXaxis,
      //     "multiLineOptions":this.multiLineOptions,
    
          "donutYaxis": this.donutYaxis,
          "donutXaxis": this.donutXaxis,
          "decimalplaces": this.donutDecimalPlaces,
      //     "donutOptions":this.donutOptions,
    
          "kpiData": kpiData,
          "kpiFontSize": kpiFontSize,
          "kpicolor": kpiColor,
          "kpiNumber" : this.KPINumber,
          "kpiPrefix" : this.KPIPrefix,
          "kpiSuffix" : this.KPISuffix,
          "kpiDecimalUnit" : this.KPIDisplayUnits,
          "kpiDecimalPlaces" : this.KPIDecimalPlaces
      },
      "isApexChart" : false,
      "isEChart" : true,
      "savedChartOptions" : chartData,
      "customizeOptions" : customizeObject,

    }
    }
    this.workbechService.sheetUpdate(obj,data.sheet_id).subscribe({next: (responce:any) => {
       if(responce){

       //  this.sheetRetrive();
       }

      //  })
     
     },
     error: (error) => {
       console.log(error);
       Swal.fire({
         icon: 'error',
         text: error.error.message,
         width: '200px',
       })
     }
   }
   )
  }

    haloPSASignIn(){
      const obj = {
        "site_url": this.siteURLPSA,
        "client_id": this.clientIdPSA,
        "client_secret": this.clientSecret,
        "display_name": this.displayName
      }
      this.workbechService.haloPSAConnection(obj).subscribe({next: (responce) => {
        console.log(responce)
            if(responce){
              this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
              this.databaseId=responce?.hierarchy_id;
              this.modalService.dismissAll();
              this.openHaloPSAForm = false;
              const encodedId = btoa(this.databaseId.toString());
              this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
            }
          },
          error: (error) => {
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            console.log(error);
          }
        }
      )
    }

    mySqlSignIn(){
      const obj={
          "database_type":"mysql",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "database": this.postGreDatabaseName,

      }
        this.workbechService.DbConnection(obj).subscribe({next: (responce) => {
          console.log(responce)
              if(responce){
                this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                this.databaseId=responce.database?.hierarchy_id
                this.modalService.dismissAll();
                this.openMySqlForm = false;
                const encodedId = btoa(this.databaseId.toString());
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            },
            error: (error) => {
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
              console.log(error);
            }
          }
        )
    }
    openMicrosoftSqlServer(){
      this.openMicrosoftSqlServerForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    microsoftSqlSignIn(){
      const obj={
          "database_type":"microsoftsqlserver",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "database": this.postGreDatabaseName,
          "authentication_type":this.selectedMicroSoftAuthType
      }
        this.workbechService.DbConnection(obj).subscribe({next: (responce) => {
          console.log(responce)
              if(responce){
                this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                this.databaseId=responce.database?.hierarchy_id
                this.modalService.dismissAll();
                this.openMicrosoftSqlServerForm = false;
                const encodedId = btoa(this.databaseId.toString());
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            }
          }
        )
    }
    openSnowflakeServer(){
      this.openSnowflakeServerForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    snowflakeSignIn(){
      const obj={
          "database_type":"snowflake",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "database": this.postGreDatabaseName,
      }
        this.workbechService.DbConnection(obj).subscribe({next: (responce) => {
          console.log(responce)
              if(responce){
                this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                this.databaseId=responce.database?.hierarchy_id
                this.modalService.dismissAll();
                this.openSnowflakeServerForm = false;
                const encodedId = btoa(this.databaseId.toString());
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            }
          }
        )
    }
    openMOngoDb(){
      this.openMongoDbForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    mongoDbSignIn(){
      const obj={
          "database_type":"mongodb",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "database": this.postGreDatabaseName,
      }
        this.workbechService.DbConnection(obj).subscribe({next: (responce) => {
          console.log(responce)
              if(responce){
                this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                this.databaseId=responce.database?.hierarchy_id
                this.modalService.dismissAll();
                this.openMongoDbForm = false;
                const encodedId = btoa(this.databaseId.toString());
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            }
          }
        )
    }
    openIbmDb2(){
      this.ibmDb2Form=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
      this.emptyVariables();
    }
    ibmDb2SignIn(){
      const obj={
          "database_type":"ibmdb2",
          "hostname":this.postGreServerName,
          "port":this.postGrePortName,
          "username":this.postGreUserName,
          "password":this.PostGrePassword,
          "display_name":this.displayName,
          "database": this.postGreDatabaseName,
      }
        this.workbechService.DbConnection(obj).subscribe({next: (responce) => {
          console.log(responce)
              if(responce){
                this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                this.databaseId=responce.database?.hierarchy_id
                this.modalService.dismissAll();
                this.ibmDb2Form = false;
                const encodedId = btoa(this.databaseId.toString());
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            }
          }
        )
    }

    opensqlLite(){
      this.sqlLiteForm=true;
      this.databaseconnectionsList= false;
      this.viewNewDbs = false;
    }
    uploadfile(event:any){
      const file:File = event.target.files[0];
      this.fileData = file
    }
    sqLiteSignIn(){
      const formData: FormData = new FormData();
      formData.append('path', this.fileData,this.fileData.name); 
      formData.append('database_type','sqlite');
      formData.append('display_name',this.displayName);

        this.workbechService.DbConnection(formData).subscribe({next: (responce) => {
          console.log(responce)
              if(responce){
                this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                this.databaseId=responce.database?.hierarchy_id
                this.modalService.dismissAll();
                this.ibmDb2Form = false;
                const encodedId = btoa(this.databaseId.toString());
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            }
          }
        )
    }

    triggerFileUpload(value:any) {
      if(value === 'csv'){
      this.fileInput.nativeElement.click();
      }else if(value === 'excel'){
        this.fileInput1.nativeElement.click();
      }
    }

    uploadfileCsv(event:any){
      const file:File = event.target.files[0];
      this.fileData = file;
      if(this.fileData){
        this.csvUpload(event.target);
      }

    }
    csvUpload(fileInput: any){
    const formData: FormData = new FormData();
      formData.append('file_path', this.fileData,this.fileData.name); 
      formData.append('file_type','csv');
      this.workbechService.DbConnectionFiles(formData).subscribe({next: (responce) => {
        console.log(responce)
            if(responce){
              this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
              this.fileId=responce.hierarchy_id
              const encodedId = btoa(this.fileId.toString());
              this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
            }
          },
          error: (error) => {
            console.log(error);
            this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
          },
          complete: () => {
            fileInput.value = '';
            this.cd.detectChanges();
          }
        }
      )
    }
    uploadfileExcel(event:any){
      const file:File = event.target.files[0];
      this.fileData = file;
      if(this.fileData){
        this.excelUpload(event.target);
      }

    }
    excelUpload(fileInput: any){
      const formData: FormData = new FormData();
        formData.append('file_path', this.fileData,this.fileData.name); 
        formData.append('file_type','excel');
        this.workbechService.DbConnectionFiles(formData).subscribe({next: (responce) => {
          console.log(responce)
              if(responce){
                this.toasterservice.success('Connected','success',{ positionClass: 'toast-top-right'});
                this.fileId=responce.hierarchy_id
                const encodedId = btoa(this.fileId.toString());
                this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
              }
            },
            error: (error) => {
              console.log(error);
              this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
            },
            complete: () => {
              fileInput.value = '';
              this.cd.detectChanges();
            }
          }
        )
      }
      // quickbooks Connection
      connectQuickBooks(){
        Swal.fire({
          title: 'This will redirect to QuickBooks SignIn page',
          // text: 'This will redirect to QuickBooks SignIn page',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result)=>{
          if(result.isConfirmed){
            this.workbechService.connectQuickBooks()
            .subscribe(
              {
                next: (data) => {
                  console.log(data);
                  // this.routeUrl = data.redirection_url
                  this.document.location.href = data.redirection_url;
                  this.loaderService.show();
                },
                error: (error) => {
                  console.log(error);
                }
              }
            )
          }}) 
      }
      connectSalesforce(){
        Swal.fire({
        title: 'This will redirect to Salesforce SignIn page',
        // text: 'This will redirect to Salesforce SignIn page',
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result)=>{
        if(result.isConfirmed){
          this.workbechService.connectSalesforce()
          .subscribe(
            {
              next: (data) => {
                console.log(data);
                // this.routeUrl = data.redirection_url
                this.document.location.href = data.redirection_url;
              },
              error: (error) => {
                console.log(error);
              }
            }
          )
        }}) 
      }

      connectxAmplify() {
        Swal.fire({
            title: 'This will redirect to xAmplify SignIn page',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to the specified URL
                window.location.href = 'https://xamplify.io/';
                // Optionally, if there's a loader or some other indication, show it here:
                // this.loaderService.show();
            }
        });
    }
    connectJira() {
      Swal.fire({
          title: 'This will redirect to Jira SignIn page',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
      }).then((result) => {
          if (result.isConfirmed) {
              // Redirect to the specified URL
              window.location.href = 'https://id.atlassian.com/login';
              // Optionally, if there's a loader or some other indication, show it here:
              // this.loaderService.show();
          }
      });
  }

    deleteDbConnection(id:any){
      // const obj ={
      //   database_id:dbId
      // }
      let obj: any = {};
        obj = { hierarchy_id: id };

      // if (dbId) {
      //   obj = { database_id: dbId };
      // } else if (fileId) {
      //   obj = { file_id: fileId };
      // }
      this.workbechService.deleteDbMsg(obj)
      .subscribe(
        {
          next:(data:any) => {
            console.log(data);      
            if(data){
              Swal.fire({
                title: 'Are you sure?',
                text: data.message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result)=>{
                if(result.isConfirmed){
                  if(id){
                  this.workbechService.deleteDbConnection(id)
                  .subscribe(
                    {
                      next:(data:any) => {
                        console.log(data);      
                        if(data){
                          this.toasterservice.success('Database Deleted Successfully','success',{ positionClass: 'toast-top-right'});
                        }
                        this.getDbConnectionList();
                      },
                      error:(error:any)=>{
                        this.toasterservice.error(error.error.message,'error',{ positionClass: 'toast-center-center'})
                        console.log(error)
                      }
                    } 
                  )
                  }
                  // if(fileId){
                  //   this.workbechService.deleteFileConnection(fileId)
                  //   .subscribe(
                  //     {
                  //       next:(data:any) => {
                  //         console.log(data);      
                  //         if(data){
                  //           // Swal.fire({
                  //           //   icon: 'success',
                  //           //   title: 'Deleted!',
                  //           //   text: 'Databse Deleted Successfully',
                  //           //   width: '400px',
                  //           // })
                  //           this.toasterservice.success('Database Deleted Successfully','success',{ positionClass: 'toast-top-right'});
                  //         }
                  //         this.getDbConnectionList();
                  //       },
                  //       error:(error:any)=>{
                  //         Swal.fire({
                  //           icon: 'warning',
                  //           text: error.error.message,
                  //           width: '300px',
                  //         })
                  //         console.log(error)
                  //       }
                  //     } 
                  //   )
                  // }
                }})
            }
          },
          error:(error:any)=>{
            Swal.fire({
              icon: 'warning',
              text: error.error.message,
              width: '300px',
            })
            console.log(error)
          }
        } 
      )





    }
    editDbConnectionModal(OpenmdoModal: any) {
      this.modalService.open(OpenmdoModal);
    }
  editDbDetails(id: any) {
    const editDataArray = this.connectionList.filter((item: { hierarchy_id: number; }) => item.hierarchy_id == id);
    console.log(editDataArray)
    const editData = editDataArray[0]
    this.databaseType = editData.database_type;
    this.databaseId = editData.hierarchy_id;
    if (this.databaseType == "connectwise") {
      this.companyId = editData.company_id;
        this.siteURL = editData.site_url;
        this.publicKey = editData.public_key;
        this.privateKey = editData.private_key;
        this.clientId = editData.client_id;
        this.displayName = editData.display_name;
    } else if (this.databaseType == "halops") {
      this.siteURLPSA = editData.site_url;
      this.clientIdPSA = editData.client_id;
      this.clientSecret = editData.client_secret;
      this.displayName = editData.display_name;
    } else {
      this.postGreServerName = editData.hostname;
      this.postGrePortName = editData.port;
      this.postGreUserName = editData.username;
      this.PostGrePassword = '';
      this.OracleServiceName = '';
      this.displayName = editData.display_name;
      if (this.databaseType === 'oracle') {
        this.postGreDatabaseName = editData.service_name;
      } else {
        this.postGreDatabaseName = editData.database;
      }
      this.errorCheck();
    }
  }

    Openmdo(OpenmdoModal: any) {
      this.modalService.open(OpenmdoModal);
    }
    toggleVisibility1() {
      this.showPassword1 = !this.showPassword1;
      if (this.toggleClass1 === "off-line") {
        this.toggleClass1 = "line";
      } else {
        this.toggleClass1 = "off-line";
      }
    }
  ngOnInit(): void {
    // {
    //   document.querySelector('html')?.getAttribute('data-toggled') != null
    //     ? document.querySelector('html')?.removeAttribute('data-toggled')
    //     : document
    //         .querySelector('html')
    //         ?.setAttribute('data-toggled', 'icon-overlay-close');    
    // }
    this.loaderService.hide();
    if(this.viewDatasourceList){
   this.getDbConnectionList();
    }
    this.errorCheck();
  }

  pageChangegetconnectionList(page:any){
    this.pageNo=page;
    this.getDbConnectionList();
  }
  searchDbConnectionList(){
    this.pageNo=1;
    this.getDbConnectionList();
  }
  getDbConnectionList(){
    const Obj ={
      search : this.searchDbName,
      page_no:this.pageNo,
      page_count:this.itemsPerPage

    }
    if(Obj.search == '' || Obj.search == null){
      delete Obj.search;
    }
    if(Obj.page_count == undefined || Obj.page_count == null){
      delete Obj.page_count
    }
    this.workbechService.getdatabaseConnectionsList(Obj).subscribe({
      next:(data)=>{
        console.log(data);
        this.connectionList = data.sheets;
        this.itemsPerPage = data.items_per_page;
        this.totalItems = data.total_items
        console.log('connectionlist',data)
       },
      error:(error)=>{
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'oops!',
          text: error.error.message,
          width: '400px',
        })
      }
    })
  }
  getTablesFromConnectedDb(id:any){
    // if(dbId === null){
    const encodedId = btoa(id.toString());
    this.router.navigate(['/analytify/database-connection/tables/'+encodedId]);
    // }
    // if(fileId === null){
    //   const encodedId = btoa(dbId.toString());
    //   this.router.navigate(['/insights/database-connection/tables/'+encodedId]);
    //   }
}

  onDeleteItem(index: number) {
     this.draggedtables.splice(index, 1); // Remove the item from the droppedItems array
     console.log(this.draggedtables)
  }

  gotoNewConnections(){
  this.openPostgreSqlForm=false;
  this.viewNewDbs=true;
  this.openMySqlForm=false;
  this.openOracleForm = false;
  this.openMongoDbForm = false;
  this.openMicrosoftSqlServerForm = false;
  this.openSnowflakeServerForm = false;
  this.ibmDb2Form= false;
  this.sqlLiteForm = false;
  this.openConnectWiseForm = false;
  this.openHaloPSAForm = false;

  this.postGreServerName = '';
  this.postGrePortName = '';
  this.postGreDatabaseName = '';
  this.postGreUserName = '';
  this.PostGrePassword = '';
  this.OracleServiceName = '';
  this.displayName ='';
  this.fileData = '';
  this.clientId = '';
  this.privateKey = '';
  this.publicKey = '';
  this.siteURL = '';
  this.companyId = '';
  this.siteURLPSA = '';
  }

  serverError:boolean = false;
  portError:boolean = false;
  databaseError:boolean = false;
  userNameError:boolean = false;
  displayNameError:boolean = false;
  passwordError:boolean = false;
  pathError:boolean = false;
  clientIDError:boolean = false;
  siteURLError:boolean = false;
  siteURLErrorPSA:boolean = false;
  clientIDPSAError:boolean = false;
  clientSecretError: boolean = false;
  privateKeyError:boolean = false;
  publicKeyError:boolean = false;
  companyIDError:boolean = false;
  disableConnectBtn = true;
  serverConditionError(){
    if(this.postGreServerName){
      this.serverError = false;
    }else{
      this.serverError = true;
    }
    this.errorCheck();
  }
  portConditionError(){
    if(this.postGrePortName){
      this.portError = false;
    }else{
      this.portError = true;
    }
    this.serverConditionError();
    this.errorCheck();
  }
  databaseConditionError(){
      if (this.postGreDatabaseName) {
        this.databaseError = false;
      } else {
        this.databaseError = true;
      }
    this.portConditionError();
    this.errorCheck();
  }
  userNameConditionError(){
    if(this.postGreUserName){
      this.userNameError = false;
    }else{
      this.userNameError = true;
    }
    this.databaseConditionError();
    this.errorCheck();
  }
  displayNameIntegrationConditionError(){
    if(this.displayName){
      this.displayNameError = false;
    }else{
      this.displayNameError = true;
    }
  }
  displayNameConditionError(){
    if(this.displayName){
      this.displayNameError = false;
    }else{
      this.displayNameError = true;
    }
    if(this.sqlLiteForm){
      this.pathConditionError();
    } else{
      this.userNameConditionError();
    }
    this.errorCheck();
  }
  passwordConditionError(){
    if(this.PostGrePassword){
      this.passwordError = false;
    }else{
      this.passwordError = true;
    }
    this.displayNameConditionError();
    this.errorCheck();
  }
  pathConditionError(){
    if(this.path){
      this.pathError = false;
    } else{
      this.pathError = true;
    }
  }
  errorCheck(){
    if(this.openMicrosoftSqlServerForm){
      if(this.selectedMicroSoftAuthType === 'Windows Authentication'){
        if(this.serverError || this.portError || this.databaseError || this.displayNameError){
          this.disableConnectBtn = true;
        } else if(!(this.postGreServerName && this.postGrePortName && this.postGreDatabaseName && this.displayName)) {
          this.disableConnectBtn = true;
        } else{
          this.disableConnectBtn = false;
        }
      }
      else{
         if(this.serverError || this.portError || this.databaseError || this.userNameError || this.displayNameError || this.passwordError){
          this.disableConnectBtn = true;
        } else if(!(this.postGreServerName && this.postGrePortName && this.postGreDatabaseName && this.postGreUserName && this.displayName && this.PostGrePassword)) {
          this.disableConnectBtn = true;
        } else{
          this.disableConnectBtn = false;
        }
      }
    }
    else if(this.serverError || this.portError || this.databaseError || this.userNameError || this.displayNameError || this.passwordError){
      this.disableConnectBtn = true;
    } else if(!(this.postGreServerName && this.postGrePortName && this.postGreDatabaseName && this.postGreUserName && this.displayName && this.PostGrePassword)) {
      this.disableConnectBtn = true;
    } else{
      this.disableConnectBtn = false;
    }
  }
}
