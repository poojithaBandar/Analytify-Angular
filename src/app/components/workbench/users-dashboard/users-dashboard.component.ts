import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/sharedmodule';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';
import { PasswordValidators } from '../../../shared/password-validator';

@Component({
  selector: 'app-users-dashboard',
  standalone: true,
  imports: [SharedModule,CommonModule,FormsModule,NgbModule,NgxPaginationModule,ReactiveFormsModule],
  templateUrl: './users-dashboard.component.html',
  styleUrl: './users-dashboard.component.scss'
})
export class UsersDashboardComponent {
  gridView = true;
  userName ='';
  itemsPerPage:any;
  pageNo = 1;
  page: number = 1;
  totalItems:any;
  savedUsersList =[] as any;
  userAddedRolesList =[] as any;
  searchUser :any
  addUserForm:FormGroup;
  confirmPasswordError = false;
  constructor(public modalService:NgbModal,private workbechService:WorkbenchService,private formBuilder:FormBuilder){
    this.addUserForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstname:['', Validators.required],
      lastname:['', Validators.required],
      role:['',Validators.required],
      is_active:[''],
      email:['',[Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')],],
      password: ['', [Validators.required, Validators.compose([
        Validators.required,
        Validators.minLength(8),
        PasswordValidators.patternValidator(new RegExp("(?=.*[0-9])"), {
          requiresDigit: true
        }),
        PasswordValidators.patternValidator(new RegExp("(?=.*[A-Z])"), {
          requiresUppercase: true
        }),
        PasswordValidators.patternValidator(new RegExp("(?=.*[a-z])"), {
          requiresLowercase: true
        }),
        PasswordValidators.patternValidator(new RegExp("(?=.*[$@^!%*?&])"), {
          requiresSpecialChars: true
        })
        ])]],
      conformpassword: ['', Validators.required],
    })
  }

  ngOnInit(){
    this.getUserList()
  }
  get f() {
    return this.addUserForm.controls;
  }
  get passwordValid() {
    return this.addUserForm.controls["password"].errors === null;
  }
  
  get requiredValid() {
    return !this.addUserForm.controls["password"].hasError("required");
  }
  
  get minLengthValid() {
    return !this.addUserForm.controls["password"].hasError("minlength");
  }
  
  get requiresDigitValid() {
    return !this.addUserForm.controls["password"].hasError("requiresDigit");
  }
  
  get requiresUppercaseValid() {
    return !this.addUserForm.controls["password"].hasError("requiresUppercase");
  }
  
  get requiresLowercaseValid() {
    return !this.addUserForm.controls["password"].hasError("requiresLowercase");
  }
  
  get requiresSpecialCharsValid() {
    return !this.addUserForm.controls["password"].hasError("requiresSpecialChars");
  }
  checkConfirmPassword(){
    if(this.addUserForm.value.conformpassword === this.addUserForm.value.password ){
      this.confirmPasswordError = false;
    } else{
      this.confirmPasswordError = true;
    }
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

  searchUserList(){
    this.pageNo=1
    this.getUserList();
  }
  pageChangegetUserList(pageNo:any){
    this.pageNo=pageNo;
    this.getUserList();
  }
  getUserList(){
    const obj ={
      search : this.searchUser,
      page_no:this.pageNo,
    page_count:this.itemsPerPage
    }
    if(obj.search === '' || obj.search === null){
      delete obj.search
    }
    if(obj.page_count == undefined || obj.page_count == null){
      delete obj.page_count;
    }
    this.workbechService.getUserList(obj).subscribe({
      next:(data)=>{
        console.log(data);
        this.savedUsersList=data.sheets;
        this.itemsPerPage = data.items_per_page;
        this.totalItems = data.total_items;
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

  addUserModal(OpenmdoModal: any) {
    this.modalService.open(OpenmdoModal);
    this.getAddedRolesList();
  }

getAddedRolesList(){
  this.workbechService.getAddedRolesList().subscribe({
    next:(data)=>{
      console.log(data);
      this.userAddedRolesList=data;
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

addUser(){
  this.workbechService.addUserwithRoles(this.addUserForm.value).subscribe({
    next:(data)=>{
      console.log(data);
      this.modalService.dismissAll();
      Swal.fire({
        icon: 'success',
        title: 'Done!',
        text: data.message,
        width: '400px',
      })
      this.getUserList();
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
deleteUser(id:any){
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result)=>{
    if(result.isConfirmed){
      this.workbechService.deleteUser(id)
      .subscribe(
        {
          next:(data:any) => {
            console.log(data);      
            if(data){
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'User Deleted Successfully',
                width: '400px',
              })
            }
            this.getUserList();
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
    }})
}

}
