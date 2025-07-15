import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-passkey-login',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './passkey-login.component.html',
  styleUrls: ['./passkey-login.component.scss']
})
export class PasskeyLoginComponent {
  emailForm: FormGroup;
  otpForm: FormGroup;
  showOtp = false;
  emailToken: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    });
  }

  sendRecoveryEmail(){
    if(this.emailForm.invalid){ return; }
    this.authService.sendPasskeyEmail(this.emailForm.value).subscribe({
      next: (res)=>{ this.showOtp = true; this.emailToken = res.emailvalidation_token; },
      error: ()=>{}
    });
  }

  verifyOtp(){
    if(this.otpForm.invalid){ return; }
    if(!this.emailToken){ return; }
    const payload = { otp: this.otpForm.value.otp };
    this.authService.verifyOtp(this.emailToken, payload).subscribe({
      next: ()=>{
        localStorage.setItem('protected_access','true');
        localStorage.setItem('protected_email', this.emailForm.value.email);
        this.router.navigate(['/protected/home']);
      },
      error: ()=>{}
    });
  }
}
