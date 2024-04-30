import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

loginForm:FormGroup;



  constructor(
    @Inject(DOCUMENT) private document: Document,private elementRef: ElementRef,    private router: Router,
    private renderer: Renderer2,private sanitizer: DomSanitizer,private formBuilder:FormBuilder,private authService:AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['', Validators.required],    })
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
 
    this.renderer.addClass(this.document.body, 'login-img');
    this.renderer.addClass(this.document.body, 'ltr');
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'login-img');
    this.renderer.removeClass(this.document.body, 'ltr');
}

onSubmit(){
this.authService.login(this.f['email'].value,this.f['password'].value)
.subscribe({
  next:(data:any) => {
    console.log(data);   
    const userToken = { Token: data.accessToken,};
    const userName = { userName: data.name};
    localStorage.setItem('currentUser', JSON.stringify(userToken));
    localStorage.setItem('username', JSON.stringify(userName));
    if(data.accessToken){
      this.router.navigate(['dashboard'])
    }
  },
  error:(error:any)=>{
    console.log(error);
  }
})
}
}
