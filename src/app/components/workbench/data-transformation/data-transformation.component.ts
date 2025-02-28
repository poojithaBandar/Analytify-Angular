import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/sharedmodule';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { WorkbenchService } from '../workbench.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  draggedtables: any[] = [];
  isAddTransformation : boolean = false;
  credentials : any = {};
  selectedTransformations: { [key: number]: string[][] } = {};
  hierarchyId : any;
  schema : any;
  transformationTypes = [
    { key: 'deduplicate', label: 'Remove duplicates', needColumn: false },
    { key: 'replace_values', label: 'Handle null values', needColumn: true },
    { key: 'special_char_remove', label: 'Remove special characters', needColumn: true },
    { key: 'alter_datatypes', label: 'Change data types', needColumn: true },
    { key: 'upper', label: 'Upper case', needColumn: true },
    { key: 'lower', label: 'Lower case', needColumn: true },
    { key: 'title', label: 'Title case', needColumn: true }
  ];

  constructor(private workbechService: WorkbenchService, private route: ActivatedRoute, private router: Router) {
    if (this.router.url.includes('/analytify/databaseConnection/dataTransformation')) {
      if (route.snapshot.params['credentials']) {
        // this.credentials = +atob(JSON.parse(route.snapshot.params['credentials']));
        this.credentials = JSON.parse(route.snapshot.params['credentials'])
        console.log(this.credentials);
      }
    }
  }

  ngOnInit() {
    if(this.credentials){
      this.getTablesForDataTransformation();
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

  setTransformationType(index: number, transformationKey: string[]) {
    if (!this.selectedTransformations[index]) {
      this.selectedTransformations[index] = []; // Initialize if not set
    }
    this.selectedTransformations[index].push(transformationKey);
  }

  editTransformation(index:any, transformationIndex:any, transformationKey: string[]){
    if (!this.selectedTransformations[index]) {
      this.selectedTransformations[index] = [];
    }
    if (!this.selectedTransformations[index][transformationIndex]) {
      console.error(`Transformation at index ${transformationIndex} does not exist for table ${index}`);
      return;
    }

    this.selectedTransformations[index][transformationIndex] = transformationKey; 
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
    this.workbechService.getTablesForDataTransformation(this.credentials).subscribe({
      next: (response: any) => {
        console.log(response);
        this.tables = response.data.tables;
        this.hierarchyId = response.data.database.hierarchy_id;
        this.schema = response.data.schema
      },
      error: (error) => {
        console.log(error);
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
