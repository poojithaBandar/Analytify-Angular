import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(
    @Inject(DOCUMENT) private document: Document,private elementRef: ElementRef,
    private renderer: Renderer2,private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
 
    this.renderer.addClass(this.document.body, 'login-img');
    this.renderer.addClass(this.document.body, 'ltr');
    this.renderer.addClass(this.document.body, 'app-sidebar-mini');

  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'login-img');
    this.renderer.removeClass(this.document.body, 'ltr');
}
showPassword = false;
showPassword1 = false;
toggleClass = "off-line";
toggleClass1 = "off-line";
toggleVisibility() {
  this.showPassword = !this.showPassword;
  if (this.toggleClass === "off-line") {
    this.toggleClass = "line";
  } else {
    this.toggleClass = "off-line";
  }
}
toggleVisibility1() {
  this.showPassword1 = !this.showPassword1;
  if (this.toggleClass1 === "off-line") {
    this.toggleClass1 = "line";
  } else {
    this.toggleClass1 = "off-line";
  }
}
}
