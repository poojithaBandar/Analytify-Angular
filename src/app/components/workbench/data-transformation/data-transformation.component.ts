import { Component, QueryList, ViewChildren } from '@angular/core';
import { SharedModule } from '../../../shared/sharedmodule';
import { NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { WorkbenchService } from '../workbench.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import _ from 'lodash';

@Component({
  selector: 'app-data-transformation',
  standalone: true,
  imports: [SharedModule,NgbModule,DragDropModule,CommonModule],
  templateUrl: './data-transformation.component.html',
  styleUrl: './data-transformation.component.scss'
})
export class DataTransformationComponent {
  active=0;
  defaults = ['Connections'];
  tables = [{tables : '', columns : []}];
  draggedTables: any[] = [];
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
  dateList = ['date', 'time', 'datetime', 'timestamp', 'timestamp with time zone', 'timestamp without time zone', 'timezone', 'time zone', 
    'timestamptz', 'nullable(date)', 'nullable(time)', 'nullable(datetime)', 'nullable(timestamp)', 'nullable(timestamp with time zone)',
    'nullable(timestamp without time zone)', 'nullable(timezone)', 'nullable(time zone)', 'nullable(timestamptz)', 'nullable(datetime)', 
    'datetime64', 'datetime32', 'date32', 'nullable(date32)', 'nullable(datetime64)', 'nullable(datetime32)', 'date', 'datetime', 'time', 
    'datetime64', 'datetime32', 'date32', 'nullable(date)', 'nullable(time)', 'nullable(datetime64)', 'nullable(datetime32)', 
    'nullable(date32)'
  ]
  isOpen : boolean = true;
  @ViewChildren('dropdownRef') dropdowns!: QueryList<NgbDropdown>;

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

    setTimeout(() => {
      if (this.dropdowns.length > 0) {
        const dropdownArray = this.dropdowns.toArray();
        let lastDropdown;
        if(this.draggedTables.length > 1){
          if(index == 0){
            lastDropdown = dropdownArray[this.selectedTransformations[index].length-1];
          } else if(index > 0){
            const keysList =  Object.keys(this.selectedTransformations);
            let totalTransformations = 0;
            keysList.forEach((key:any)=>{
              if(key <= index){
                totalTransformations += this.selectedTransformations[key].length;
              }
            });
            lastDropdown = dropdownArray[totalTransformations-1];
          }
        } else{
          lastDropdown = this.dropdowns.last;
        }
        if (lastDropdown) {
          lastDropdown.open();
        }
      }
    }, 100); 
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
    this.draggedTables.push(element);
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

  getTransformationLabel(index: number, transformationIndex: number): string {
    let selectedData = "";
    this.transformationTypes.forEach((transformation : any)=>{
      if(transformation.key === (this.selectedTransformations[index]?.[transformationIndex][0] || "")){
        selectedData = transformation.label;
      }
    });
    return selectedData;
  }
  removeTransformation(index: number, transformationIndex: number) {
    this.selectedTransformations[index].splice(transformationIndex, 1);
  }
  removeTable(index: number) {
    this.draggedTables.splice(index,1);
    delete this.selectedTransformations[index];

    const updatedTransformations: any = {};
    const keysList =  Object.keys(this.selectedTransformations);
    keysList.forEach((key:any)=>{
      if(key > index){
        updatedTransformations[key-1] = this.selectedTransformations[key];
      } else {
        updatedTransformations[key] = this.selectedTransformations[key];
      }
    })
    this.selectedTransformations = updatedTransformations;

    console.log(this.draggedTables);
    console.log(this.selectedTransformations);
  }

  getTablesForDataTransformation(){
    this.workbechService.getTablesForDataTransformation(this.hierarchyId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.tables = response.tables;
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

  setTransformations(isInvidualTableRun : boolean){
    let transformationList : any[] = []
    this.draggedTables.forEach((table:any,index:any)=>{
      let object = {
        database : this.schema,
        table : table.tables,
        transform : [] as any[]
      }
      this.selectedTransformations[index].forEach((tableWiseTransformations:any)=>{
        let obj = {
          type: tableWiseTransformations.key as string,
          keys: [] as any[]
        }
        if(tableWiseTransformations){
          if(['upper','lower','title'].includes(tableWiseTransformations.key)){
            obj.type = 'case_change';
            obj.keys.push(tableWiseTransformations.dropdown);
            obj.keys.push(tableWiseTransformations.key);
          } else if(tableWiseTransformations.key === 'replace_values'){
            obj.keys.push(tableWiseTransformations.dropdown);
            obj.keys.push(null);
            obj.keys.push(tableWiseTransformations.input);
          } else if(tableWiseTransformations.key === 'alter_datatypes'){
            obj.keys.push(tableWiseTransformations.dropdown);
            obj.keys.push(tableWiseTransformations.input);
          } else if(tableWiseTransformations.key === 'special_char_remove'){
            obj.keys.push(tableWiseTransformations.dropdown);
          }
        }
        object.transform.push(obj)
      });
      transformationList.push(object);
    });
    let object = {
      id : this.hierarchyId,
      transformation_list: transformationList,
      ...(isInvidualTableRun && { preview: isInvidualTableRun })
    }
    console.log('payload : ',object);
    this.workbechService.setTransformations(object).subscribe({
      next: (response: any) => {
        console.log(response);
        let encodedId = btoa(response.parent_id.toString());
        this.router.navigate(['/analytify/database-connection/tables/' + encodedId]);
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
}
