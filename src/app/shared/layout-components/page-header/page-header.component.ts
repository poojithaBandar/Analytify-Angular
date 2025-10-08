import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() title1!:string;
  @Input() activeitem!: string;
  @Input() title2!:string;
  @Input() multiLevel = false;
  @Input() title2Route!:string;
  @Input() moduleId:any;
  @Input() isPublicUrl! : boolean;
  @Output() btnClickEvent: EventEmitter<any>;
  dashbaordName = '';

constructor(private route:Router,private sanitizer: DomSanitizer){
  this.btnClickEvent = new EventEmitter();
}

ngOnInit(){
  this.setDashboardName();
}

ngOnChanges(){
  this.setDashboardName();
  }

private setDashboardName(): void {
  const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, this.title ?? '');
  this.dashbaordName = sanitized ?? '';
}

helpRoute(){
  console.log(this.moduleId)
  // this.route.navigate([`/analytify/help-guide/${this.moduleId}`])

  const url = this.route.serializeUrl(
    this.moduleId ? this.route.createUrlTree([`/analytify/help-guide/${this.moduleId}`]) : this.route.createUrlTree([`/analytify/help-guide`])
  );
  const fullUrl = `${window.location.origin}${url}`;
  window.open(fullUrl, '_blank');
}
routeHome(){
  this.route.navigate(['/analytify/home'])
}

toggleSidebar(){
  this.btnClickEvent.emit();
}
}
