import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/sharedmodule';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { WorkbenchService } from '../workbench.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import _ from 'lodash';

@Component({
  selector: 'app-data-transformation',
  standalone: true,
  imports: [SharedModule,NgbModule,DragDropModule,CommonModule, NgbPopoverModule],
  templateUrl: './data-transformation.component.html',
  styleUrl: './data-transformation.component.scss'
})
export class DataTransformationComponent {
  active=0;
  defaults = ['Connections'];
  tables = [{tables : '', columns : []}];
  draggedtables: any[] = [];
  isAddTransformation : boolean = false;
  selectedTransformations: any = {};
  hierarchyId : any;
  schema : any;
  databaseName : any;
  transformationTypes = [
    { key: 'duplicate', label: 'Remove duplicates', needColumn: false },
    { key: 'replace_values', label: 'Handle null values', needColumn: true },
    { key: 'special_char_remove', label: 'Remove special characters', needColumn: true },
    { key: 'alter_datatypes', label: 'Change data types', needColumn: true },
    { key: 'upper', label: 'Upper case', needColumn: true },
    { key: 'lower', label: 'Lower case', needColumn: true },
    { key: 'title', label: 'Title case', needColumn: true }
  ];

  constructor(private workbechService: WorkbenchService, private route: ActivatedRoute, private router: Router) {
    if (this.router.url.includes('/analytify/databaseConnection/dataTransformation')) {
      if (route.snapshot.params['id']) {
        this.hierarchyId = +atob(route.snapshot.params['id']);
        console.log(this.hierarchyId);
      }
    }
  }

  ngOnInit() {
    if(this.hierarchyId){
      this.getTablesForDataTransformation();
    }
  }

  addNewTransform(index: number){
    if (!this.selectedTransformations[index]) {
      this.selectedTransformations[index] = [{}]; // Initialize if not set
    } else {
      this.selectedTransformations[index].push({});
    }
  }  
  drop(event: CdkDragDrop<any[]>) {
    let item: any = event.previousContainer.data[event.previousIndex];
    let copy: any = JSON.parse(JSON.stringify(item));
    let element: any = {};
    for (let attr in copy) {
      if (attr == 'title') {
        element[attr] = copy[attr];
      } else {
        element[attr] = copy[attr];
      }
    }
    this.draggedtables.push(element);
  }

  setTransformationType(index: number, transformationKey: any,event: any, isDropdown :boolean, isInput:boolean,transformationIndex: number) {
    if (!this.selectedTransformations[index]) {
      this.selectedTransformations[index] = []; // Initialize if not set
    }
    if(!this.selectedTransformations[index][transformationIndex]){
      this.selectedTransformations[index][transformationIndex] = {input : '',dropdown:'',keys:[],key:''}
    }
    if(isInput){
      this.selectedTransformations[index][transformationIndex].input = event.target.value;
    } else if(isDropdown){
      this.selectedTransformations[index][transformationIndex].dropdown = event.target.value;
    } if(transformationKey){
      this.selectedTransformations[index][transformationIndex].key = transformationKey;
    }

  }

  editTransformation(index:any, transformationIndex:any, transformationKey: string[]){
    if (!this.selectedTransformations[index]) {
      this.selectedTransformations[index] = [];
    }
    if (!this.selectedTransformations[index][transformationIndex]) {
      console.error(`Transformation at index ${transformationIndex} does not exist for table ${index}`);
      return;
    }

    // this.selectedTransformations[index][transformationIndex] = transformationKey; 
  }

  getTransformationLabel(index: number, transformationIndex: number): string {
    let selectedData = "";
    this.transformationTypes.forEach((transformation : any)=>{
      if(transformation.key === (this.selectedTransformations[index]?.[transformationIndex][0] || "")){
        selectedData = transformation.label;
      }
    });
    return selectedData;
  }

  isLastTransformation(index: number, transformationIndex: number): boolean {
    return transformationIndex === this.selectedTransformations[index]?.length - 1;
  }

  getValue(){
    console.log(this.draggedtables, this.selectedTransformations);
    this.setTransformations();
  }
  removeTransformation(index: number, transformationIndex: number) {
    this.selectedTransformations[index].splice(transformationIndex, 1);
  }
  removeTable(index: number) {
    this.draggedtables.splice(index,1);
    delete this.selectedTransformations[index];
  }

  getTablesForDataTransformation(){
    this.workbechService.getTablesForDataTransformation(this.hierarchyId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.tables = response.tables;
        // this.hierarchyId = response.data.database.hierarchy_id;
        this.schema = response.schema;
        this.databaseName = response.databas_name;
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'oops!',
          text: error.error.message,
          width: '400px',
        })
      }
    });
  }

  setTransformations(){
    let transformationList : any[] = []
    this.draggedtables.forEach((table:any,index:any)=>{
      let object = {
        database : this.schema,
        table : table.tables,
        transform : [] as any[]
      }
      this.selectedTransformations[index].forEach((tableWiseTransformations:any)=>{
        let obj = {
          type: tableWiseTransformations[0] as string,
          keys: [] as any[]
        }
        if(tableWiseTransformations.length > 1){
          if(['upper','lower','title'].includes(tableWiseTransformations[0])){
            obj.type = 'case_change';
            obj.keys.push(tableWiseTransformations[1]);
            obj.keys.push(tableWiseTransformations[0]);
          } else if(tableWiseTransformations[0] === 'replace_values'){
            obj.keys.push(tableWiseTransformations[1]);
            obj.keys.push(null);
          } else{
            obj.keys.push(tableWiseTransformations[1]);
          }
        }
        object.transform.push(obj)
      });
      transformationList.push(object);
    });
    let object = {
      id : this.hierarchyId,
      transformation_list: transformationList
    }
    console.log('payload : ',object);
    // this.workbechService.setTransformations(object).subscribe({
    //   next: (response: any) => {
    //     console.log(response);
    //     this.tables = response.data.tables;
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   }
    // });
  }
}
