import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { NgOtpInputModule } from 'ng-otp-input';
import { SharedModule } from '../../../shared/sharedmodule';

@Component({
  selector: 'app-passkey-login',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule,SharedModule,NgOtpInputModule],
  templateUrl: './passkey-login.component.html',
  styleUrls: ['./passkey-login.component.scss']
})
export class PasskeyLoginComponent {
  emailForm: FormGroup;
  otpForm: FormGroup;
  showOtp = false;
  isLoading = false;
  config = {
    allowNumbersOnly: true,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: { width: '50px', height: '50px' },
  };
  display: any;
  resendOtp = false;
  displayTimer = false;
  showPasskeyPanel = false;
  otp: string = '';
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    });
  }

  private startTimer(minute: number) {
    this.displayTimer = true;
    this.resendOtp = false;
    let seconds = minute * 60;
    let textSec: any = '0';
    const prefix = minute < 10 ? '0' : '';
    const timer = setInterval(() => {
      seconds--;
      const statSec = seconds % 60;
      textSec = statSec < 10 ? '0' + statSec : statSec;
      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      if (seconds === 0) {
        clearInterval(timer);
        this.resendOtp = true;
        this.displayTimer = false;
      }
    }, 1000);
  }

  onOtpChange(value: string) {
    this.otp = value;
    this.otpForm.get('otp')?.setValue(value);
    if (value.length === this.config.length) {
      this.verifyOtp();
    }
  }

  sendRecoveryEmail(){
    if(this.emailForm.invalid){ return; }
    this.authService.sendRecoveryEmail(this.emailForm.value).subscribe({
      next: ()=>{
        this.showOtp = true;
        this.startTimer(1);
        this.successMessage = 'OTP sent to registered email';
        this.errorMessage = '';
      },
      error: ()=>{
        this.errorMessage = 'Failed to send OTP';
        this.successMessage = '';
      }
    });
  }

  verifyOtp(){
    if(this.otpForm.invalid){ return; }
    this.isLoading = true;
    const payload = {email: this.emailForm.value.email, otp: this.otpForm.value.otp};
    this.authService.verifyRecoveryOtp(payload).subscribe({
      next: ()=>{
        this.isLoading = false;
        localStorage.setItem('protected_access','true');
        localStorage.setItem('protected_email', this.emailForm.value.email);
        this.router.navigate(['/protected/home']);
      },
      error: (err)=>{ 
        this.isLoading = false; 
        this.errorMessage = err.error?.message || 'Invalid OTP';
      }
    });
  }

  resendOtpApi(){
    this.sendRecoveryEmail();
  }

  togglePasskeyPanel(){
    this.showPasskeyPanel = !this.showPasskeyPanel;
  }
}
