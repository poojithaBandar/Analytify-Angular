import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/sharedmodule';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { WorkbenchService } from '../workbench.service';
import { ToastrService } from 'ngx-toastr';
import { UpdatePasswordComponent } from '../update-password/update-password.component';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { NgOtpInputModule } from 'ng-otp-input';
import { error } from 'jquery';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgbModule,CommonModule,SharedModule,ImageCropperComponent,ReactiveFormsModule,UpdatePasswordComponent,NgOtpInputModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  activeTab: string = 'profile';
  profileForm!: FormGroup;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showImageCropper: boolean = false;
  profileImageUrl: string = './assets/images/users/18.jpg';
  defaultImageUrl: string = './assets/images/users/18.jpg'; // Keep reference to default

  profileImageFile: File | null = null; // Store the original file
  hasImageChanged: boolean = false;
  isLoading: boolean = false;
  userProfileData: any;

  // Email verification logic
  originalEmail: string = '';
  emailNeedsVerification: boolean = false;
  emailVerified: boolean = true; // Initially true, as the loaded email is already verified
  timerInterval: any;
  isEmbedSDK: boolean = false;


  constructor(private fb: FormBuilder,private workbechService:WorkbenchService, private toasterService: ToastrService,private authService:AuthService, private router: Router,private sharedService:SharedService) {
    this.initializeForms();
  }
  ngOnInit() {
    this.isEmbedSDK = localStorage.getItem("isEmbedSDK") == 'true';
     this.loadUserProfile();
  }
      loadUserProfile() {
       this.isLoading = true;
        this.workbechService.getUserProfileDetails().subscribe({
         next: (data: any) => {
           if (data) {
             console.log(data);
            this.userProfileData = data;
            this.populateForm(data);
            this.isLoading = false;
               if(this.isImageUpdated){
          this.sharedService.setprofileImage(data.imagepath);
          this.isImageUpdated = false;
         }
           }
         },
         error: (error: any) => {
        this.toasterService.error('Failed fetch details');
           console.log(error);
         },
       }); 
      }
      populateForm(userData:any): void {
      this.profileForm.patchValue({
        email: userData.email || '',
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        company:userData.company || '',
        bio: userData.bio || ''
      });
      this.setProfileImage(userData.imagepath);
      // Set original email and reset verification state
      this.originalEmail = userData.email || '';
      this.emailVerified = true;
      this.emailNeedsVerification = false;
      // Subscribe to email field changes
      this.profileForm.get('email')?.valueChanges.subscribe((value: string) => {
        this.onEmailChanged(value);
      });
    }
    setProfileImage(imageUrl: string | null): void {
  if (imageUrl && imageUrl.trim() !== '') {
    // Check if the image URL is a full URL or relative path
    if (imageUrl.startsWith('http') || imageUrl.startsWith('https')) {
      this.profileImageUrl = imageUrl;
    } 
    // Verify that the image actually loads
    this.verifyImageLoad(this.profileImageUrl);
  } else {
    // Use default image if no image provided
    this.profileImageUrl = this.defaultImageUrl;
  }
  }

// Verify image loads, fallback to default if not
  verifyImageLoad(imageUrl: string): void {
    const img = new Image();
    img.onload = () => {
      // Image loaded successfully, keep the URL
      console.log('Profile image loaded successfully');
    };
    img.onerror = () => {
      // Image failed to load, use default
      console.warn('Failed to load profile image, using default');
      this.profileImageUrl = this.defaultImageUrl;
    };
    img.src = imageUrl;
  }
    initializeForms(): void {
    // Profile Form with validations
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern(/^(?!\s*$).+/)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern(/^(?!\s*$).+/)]],
      email: ['', [Validators.required, Validators.email]],
      company: ['', [Validators.minLength(2)]],
      bio: ['', [Validators.maxLength(500)]]
    });
  }
    isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
    getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      if (field.errors['pattern']) {
        if (fieldName === 'username') return 'Username can only contain letters, numbers and underscores';
        if (fieldName === 'newPassword') return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
      }
      if (field.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }
    getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'name': 'Name',
      'username': 'Username',
      'email': 'Email',
      'first_name': 'First Name',
      'last_name': 'Last Name',
      'country': 'Country',
      'currentPassword': 'Current Password',
      'newPassword': 'New Password',
      'confirmPassword': 'Confirm Password'
    };
    return displayNames[fieldName] || fieldName;
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  signOut(){
    this.authService.logOut().subscribe((res) => {
      if (!res.success) {
        this.router.navigate(['/authentication/signin']);
      }
    });
  }
  isImageUpdated = false;

  onEmailChanged(newEmail: string): void {
    if (newEmail !== this.originalEmail) {
      this.emailNeedsVerification = true;
      this.emailVerified = false;
    } else {
      this.emailNeedsVerification = false;
      this.emailVerified = true;
    }
  }
activationToken:any
showOtpInput: boolean = false;
otp: string = '';
otpError: string = '';
  verifyEmail(): void {
    // Call backend to send OTP and get activation token
    const obj = { email : this.profileForm.get('email')?.value}
    this.workbechService.updateEmail(obj).subscribe({
      next: (res: any) => {
        this.activationToken = res.emailActivationToken; // adjust key as per API
        this.showOtpInput = true;
        this.otp = '';
        this.otpError = '';
        this.startTimer();
        this.toasterService.success('OTP sent to your email!');
      },
      error: (error) => {
         this.toasterService.error(error.error.message);
      }
    });
  }

  onOtpChange(otp: string) {
    this.otp = otp;
    this.otpError = '';
  }

  validateOtp() {
    if (!this.otp || this.otp.length !== 5) {
      this.otpError = 'Please enter a valid 5-digit OTP.';
      return;
    }
    this.workbechService.validateEmailOtp(
      this.activationToken,
     this.otp
    ).subscribe({
      next: () => {
        this.originalEmail = this.profileForm.get('email')?.value || '';
        this.emailVerified = true;
        this.emailNeedsVerification = false;
        this.showOtpInput = false;
        this.otp = '';
        this.otpError = '';
        this.stopTimer();
        this.toasterService.success('Email verified!');
      },
      error: () => {
        this.otpError = 'Invalid OTP. Please try again.';
      }
    });
  }
  config = {
    allowNumbersOnly: true,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  display: any;
  resendOtp: boolean = false;
  displayTimer: boolean = false;
  emailActivationToken:any;
  startTimer() {
    this.display = 60;
    this.displayTimer = true;
    this.resendOtp = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.display--;
      if (this.display <= 0) {
        this.displayTimer = false;
        this.resendOtp = true;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  stopTimer() {
    this.displayTimer = false;
    this.resendOtp = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
}

  onProfileSubmit(): void {
    if (this.profileForm.valid && this.emailVerified) {
      this.isLoading = true;
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      // Add form fields
      const profileData = this.profileForm.value;
      formData.append('email', profileData.email || '');
      formData.append('first_name', profileData.firstName || '');
      formData.append('last_name', profileData.lastName || '');
      formData.append('company', profileData.company || '');
      formData.append('bio', profileData.bio || '');
      if (this.hasImageChanged && this.croppedImage) {
        try {
          const imageFile = this.base64ToFile(this.croppedImage, `profile_${Date.now()}.png`);
          formData.append('imagepath', imageFile, imageFile.name);
          if(imageFile){
            this.isImageUpdated = true;
          }
        } catch (error) {
          console.error('Error processing image:', error);
          this.isLoading = false;
          alert('Error processing image. Please try again.');
          return;
        }
      }
      console.log('FormData contents:',formData);
      this.updateUserProfile(formData);
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }
  updateUserProfile(formData: FormData): void {

          this.workbechService.updateProfile(formData).subscribe({
        next: (response: any) => {
           this.isLoading = false;
            this.hasImageChanged = false;
          this.toasterService.success('Profile updated successfully');
          this.loadUserProfile(); // Reload user profile data
      
        },
        error: (error: any) => {
           this.isLoading = false;
          this.toasterService.error('Failed to update profile');
          console.error('Error updating profile:', error);
        }
      });
  }

    markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
 onCancel(): void {
     if (this.userProfileData) {
    this.populateForm(this.userProfileData);
  }
  
  // Reset image changes
  if (this.hasImageChanged) {
    this.profileImageUrl = './assets/images/users/18.jpg'; // Reset to default or loaded image
    this.hasImageChanged = false;
    this.croppedImage = '';
    this.profileImageFile = null;
  }
  }
   // Image handling methods
onImageSelect(event: any): void {
  const file = event.target.files[0];
  if (file) {
    console.log('File selected:', file.name, file.type, file.size);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    
    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB.');
      return;
    }
    
    this.profileImageFile = file;
    this.imageChangedEvent = event;
    this.showImageCropper = true;
    this.croppedImage = ''; // Reset cropped image
    
    console.log('Image cropper opened');
  }
}
resetImageInput(): void {
  const fileInput = document.getElementById('profile-change') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}
  imageCropped(event: ImageCroppedEvent): void {
  console.log('Image cropped event triggered:', event);
  
  if (event.base64) {
    this.croppedImage = event.base64;
    console.log('Cropped image set:', this.croppedImage.substring(0, 50) + '...');
  } else if (event.blob) {
    // Convert blob to base64 if base64 is not available
    this.blobToBase64(event.blob).then(base64 => {
      this.croppedImage = base64;
      console.log('Cropped image converted from blob to base64');
    });
  } else {
    console.error('No cropped image data available');
  }
}
blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
  imageLoaded(image: LoadedImage): void {
  console.log('Image loaded successfully', image);
  }

  cropperReady(): void {
  console.log('Cropper is ready');
  }

  loadImageFailed(): void {
    console.error('Image load failed');
     this.cancelImageCrop();
  }

  applyCroppedImage(): void {
    if (this.croppedImage) {
       this.profileImageUrl = this.croppedImage;
    this.hasImageChanged = true;
    this.showImageCropper = false;
    this.imageChangedEvent = '';
    this.resetImageInput();
    }
  }

  cancelImageCrop(): void {
 this.showImageCropper = false;
  this.imageChangedEvent = '';
  this.croppedImage = '';
  this.profileImageFile = null;
  this.hasImageChanged = false;
  this.resetImageInput();
  }
  
base64ToFile(base64String: string, fileName: string): File {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
}
}
