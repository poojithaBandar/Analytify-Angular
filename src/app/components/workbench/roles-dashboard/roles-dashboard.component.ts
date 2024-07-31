import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/sharedmodule';
import { WorkbenchService } from '../workbench.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles-dashboard',
  standalone: true,
  imports: [SharedModule,CommonModule,FormsModule,NgbModule,NgxPaginationModule,ReactiveFormsModule],
  templateUrl: './roles-dashboard.component.html',
  styleUrl: './roles-dashboard.component.scss'
})
export class RolesDashboardComponent {
  gridView = false;
  roleName='';
  itemsPerPage:any;
  pageNo = 1;
  page: number = 1;
  totalItems:any;
  savedRolesList =[] as any;
   previlagesList =[] as any;
  selectControl = new FormControl([]);
  selectedArray = [] as any;
  originalSelectedArray = [] as any;
  selectControlSelected = new FormControl([]);
  searchPrevilage:any;
  searchrole:any;
  searchSelectedPrevilage:any;
  roleTitle='';
  selectedIds = [] as any;
constructor(public modalService:NgbModal,private workbechService:WorkbenchService){

}


ngOnInit(){
  this.getSavedRolesList()
}

addRolesModal(OpenmdoModal: any) {
  this.modalService.open(OpenmdoModal);
}
searchRoleList(){

} 
pageChangegetRolesList(page:any){

}
getSavedRolesList(){
  const obj ={
     search:this.searchrole
  }
  if(obj.search ===''||obj.search === null){
    delete obj.search
  }
  this.workbechService.getSavedRolesList(obj).subscribe({
    next:(data)=>{
      console.log(data);
      this.savedRolesList=data
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
getPrevilagesList(){
  const obj ={
    search : this.searchPrevilage
  }
  if(obj.search === '' || obj.search === null){
    delete obj.search
  }
  this.workbechService.getPrevilagesList(obj).subscribe({
    next:(data)=>{
      console.log(data);
      this. previlagesList=data
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
moveSelectedItems() {
  const selectedIds:any = this.selectControl.value;

  // Filter and move the selected items
  this.selectedArray = this.selectedArray.concat(
    this. previlagesList.filter((item: { id: any; }) => selectedIds.includes(item.id))
  );
console.log('getselectedprevilages',this.selectedArray)
  // remo the selected items from the original array
  this. previlagesList = this. previlagesList.filter((item: { id: any; }) => !selectedIds.includes(item.id));
  this.originalSelectedArray = [...this.selectedArray];
  this.selectControl.setValue([]);
}


selectAllAndMove() {
  // Select all IDs
  const allIds = this. previlagesList.map((item: { id: any; }) => item.id);

  // adding itms in selctdarray
  this.selectedArray = this.selectedArray.concat(this. previlagesList);
  this. previlagesList = [];
  this.originalSelectedArray = [...this.selectedArray];
  // clr selected
  this.selectControl.setValue([]);
}

moveBackSelectedItems() {
  const selectedIds:any = this.selectControlSelected.value;

  selectedIds.forEach((id: number) => {
    // item to move back
    const itemToMoveBack = this.selectedArray.find((item: { id: number; }) => item.id === id);

    if (itemToMoveBack) {
      // finding orgnl positionid
      const originalIndex = this.previlagesList.findIndex((item: { id: number; }) => item.id > id);
      
      if (originalIndex === -1) {
        this.previlagesList.push(itemToMoveBack);
      } else {
        this.previlagesList.splice(originalIndex, 0, itemToMoveBack);
      }

      // remve from selctdarray
      this.selectedArray = this.selectedArray.filter((item: { id: number; }) => item.id !== id);
    }
  });

  this.selectControlSelected.setValue([]);
}

removeAllSelected() {
  // Clear the selected array
  this.selectedArray = [];
  this.selectControlSelected.setValue([]);
  this.getPrevilagesList();
}

searchInSelectedArray() {
  const query = this.searchSelectedPrevilage.toLowerCase();
  if(query === ''){
    this.selectedArray = [...this.originalSelectedArray];
  }else{
  this.selectedArray = this.selectedArray.filter((item: { previlage: string; }) =>
    item.previlage.toLowerCase().includes(query)
  );
  }
}

getOriginalSelectedIds(): number[] {
  return this.originalSelectedArray.map((item: { id: any; }) => item.id);
}

addRoles(){
// this.selectedIds= this.originalSelectedArray.map((item: { id: any; }) => item.id);
console.log(this.selectedIds)
if(this.roleTitle === ''){
  Swal.fire({
    icon: 'error',
    title: 'oops!',
    text: 'Please add title',
    width: '400px',
  })
}else{
  const Obj = {
    role_name:this.roleTitle,
    previlages:this.getOriginalSelectedIds()
  }
  this.workbechService.addPrevilage(Obj).subscribe({
    next:(data)=>{
      console.log(data);
      this.modalService.dismissAll()
      Swal.fire({
        icon: 'success',
        title: 'Done!',
        text: data.message,
        width: '400px',
      })
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

}
}
