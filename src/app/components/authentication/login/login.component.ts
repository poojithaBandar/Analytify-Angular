import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
    @Inject(DOCUMENT) private document: Document,private elementRef: ElementRef,
    private renderer: Renderer2,private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
 
    this.renderer.addClass(this.document.body, 'login-img');
    this.renderer.addClass(this.document.body, 'ltr');
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'login-img');
    this.renderer.removeClass(this.document.body, 'ltr');
}
}
