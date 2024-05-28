import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/sharedmodule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkbenchService } from '../../workbench/workbench.service';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-sheets',
  standalone: true,
  imports: [SharedModule,NgSelectModule,NgbModule,FormsModule,ReactiveFormsModule,CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './sheets.component.html',
  styleUrl: './sheets.component.scss'
})
export class SheetsComponent {
  tableColumnsData = [] as any;
  draggedtables = [] as any;
  constructor(private workbechService:WorkbenchService){   
  }

  ngOnInit(): void {
    this.columnsData();
  }

  columnsData(){
    const obj={
      "db_id":"182",
      "queryset_id":"35",
  }
    this.workbechService.getColumnsData(obj).subscribe({next: (responce:any) => {
          console.log(responce);
          this.tableColumnsData = responce;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }

    drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('Transfering item to new container')
      // transferArrayItem(event.previousContainer.data,
      //                   event.container.data,
      //                   event.previousIndex,
      //                   event.currentIndex);
      //                   console.log('previouscont:'+event.previousContainer.data,
      //                   'eventcont:'+event.container.data)
      //                  console.log(event.previousContainer.data,'inex:'+event.currentIndex)


      let item: any = event.previousContainer.data[event.previousIndex];
      console.log('item' + JSON.stringify(item));
      let copy: any = JSON.parse(JSON.stringify(item));

      console.log('copy' + JSON.stringify(copy));
      let element: any = {};
      for (let attr in copy) {
        console.log('attr' + attr);
        if (attr == 'title') {
          element[attr] = copy[attr];
        } else {
          element[attr] = copy[attr];
        }
      }
      this.draggedtables.splice(event.currentIndex, 0, element);
     }
     this.columnsData();
    /* if(this.draggedtables.length > 1){
      const obj ={
        database_id : this.databaseId,
        tables : [[this.draggedtables[0].schema,this.draggedtables[0].table],[this.draggedtables[1].schema,this.draggedtables[1].table]]
      }
      this.workbechService.tableRelation(obj)
      .subscribe(
        {
          next:(data:any) =>{
            console.log(data)
            this.relationOfTables = data[2]?.relation?.condition
            console.log('relation',this.relationOfTables)
          },
          error:(error:any)=>{
          console.log(error)
        }
        })
     }*/
  }
  genders = [
    {id: 1,name: 'Texas'},
    {id: 2,name: 'Georgia'},
    {id: 3,name: 'California'},
    {id: 4,name: 'Washington D.C'},
    {id: 5,name: 'Virginia'},

  ];
  selectedGender = this.genders[1].name;
  selectedSimpleItem2 = 'Appple';
  cars1 = [
    { id: 1, name: 'Mango' },
    { id: 2, name: 'Orange' },
    { id: 3, name: 'Guava' },
    { id: 4, name: 'Pineapple' },
  ];
  templates = [
    {
      id: 1,
      name: 'Andrew',
      avatar: './assets/images/faces/select2/p-5.jpg',
      value:'p-1'
    },
    {
      id: 2,
      name: 'Maya',
      avatar: './assets/images/faces/select2/p-4.jpg',
      value:'p-2'
    },
    {
      id: 3,
      name: 'Brodus Axel',
      avatar: './assets/images/faces/select2/p-2.jpg',
      value:'p-3'
    },
    {
      id: 4,
      name: 'Goldens',
      avatar: './assets/images/faces/select2/p-1.jpg',
      value:'p-4'
    },
    {
      id: 5,
      name: 'Angelina',
      avatar: './assets/images/faces/select2/p-2.jpg',
      value:'p-5'
    },

  ];
  selectedTemplate = this.templates[1].name;
  simpleItems2: any = [];
  selectedCars2 = ['Andrew'];
  cars2 = [
    { id: 1, name: 'Maya' },
    { id: 2, name: 'Brodus Axel'},
    { id: 3, name: 'Goldhens' },
    { id: 4, name: 'Angelina' },
  ];

  selectedSimpleItem3= 'Selection-4';
  simpleItems3: any = [
    {id:1,name:'Selection-1'},
    {id:2,name:'Selection-2'},
    {id:3,name:'Selection-3'},
    {id:4,name:'Selection-4'}



  ];
  selectedmultiple=['Multiple-1']
  selectedCars3 = ['Selection-1'];
  cars3= [
    { id: 1, name: 'Selection-1' },
    { id: 2, name: 'Selection-2'},
    { id: 3, name: 'Selection-3' },
    { id: 4, name: 'Selection-4' },
  ];
  isCarsDisabled = false;
  enable() {
    this.isCarsDisabled = false;
  }
  disable(){
    this.isCarsDisabled = !this.isCarsDisabled;
  }
}
