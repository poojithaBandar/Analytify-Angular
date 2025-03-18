import { Component, QueryList, ViewChildren } from '@angular/core';
import { SharedModule } from '../../../shared/sharedmodule';
import { NgbDropdown, NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { WorkbenchService } from '../workbench.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { FormsModule } from '@angular/forms';
import { TableFilterDTPipe } from '../../../shared/pipes/table-filter-dt.pipe';

@Component({
  selector: 'app-data-transformation',
  standalone: true,
  imports: [SharedModule,NgbModule,DragDropModule,CommonModule,FormsModule,TableFilterDTPipe],
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
    { key: 'deduplicate', label: 'Remove duplicates', needColumn: false },
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
  stringList = ['varchar', 'bp char', 'text', 'varchar2', 'NVchar2', 'long', 'char', 'Nchar', 'character varying', 'string', 'str', 
    'nullable(varchar)', 'nullable(bp char)', 'nullable(text)', 'nullable(varchar2)', 'nullable(NVchar2)', 'nullable(long)', 'nullable(char)', 
    'nullable(Nchar)','nullable(character varying)', 'nullable(string)', 'string', 'nullable(string)', 'array(string)', 'nullable(array(string))'
  ]
  isOpen : boolean = true;
  @ViewChildren('dropdownRef') dropdowns!: QueryList<NgbDropdown>;
  searchText : string = '';
  isApplyDisable : boolean = true;
  runButtonDisabled: boolean[] = [];
  tableHeader : any[] = [];
  tableData : any[] = [];
  tableName : string = '';
  isTablePreview : boolean = false;
  totalRows : number = 0;
  showingRows : number = 100;
  runTableIndex : number = -1;
  nonTransformedTables : any[] = [];
  tableModalSearch : string = '';
  isAllSelected : boolean = false;

  constructor(private workbechService: WorkbenchService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal) {
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
    this.isApplyDisable = true;
    this.runButtonDisabled[index] = true;
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
    if(this.draggedTables.length > 0 && Object.keys(this.selectedTransformations).length === 0){
      this.isApplyDisable = false;
    }
    this.checkTransformationsValid(false);
  }

  setTransformationType(index: number, transformationKey: any,event: any, isDropdown :boolean, isInput:boolean,transformationIndex: number) {
    if (!this.selectedTransformations[index]) {
      this.selectedTransformations[index] = []; // Initialize if not set
    }
    if(!this.selectedTransformations[index][transformationIndex]){
      this.selectedTransformations[index][transformationIndex] = {input : '',dropdown:'',keys:[],key:'',isError:false}
    }
    if(isInput){
      this.selectedTransformations[index][transformationIndex].input = event.target.value;
    } else if(isDropdown){
      this.selectedTransformations[index][transformationIndex].dropdown = event.target.value;
    } if(transformationKey){
      this.selectedTransformations[index][transformationIndex].key = transformationKey;
    }

    if(this.selectedTransformations[index][transformationIndex].key && this.selectedTransformations[index][transformationIndex].key == 'deduplicate'){
      this.selectedTransformations[index][transformationIndex].isError = false;
    } else if(this.selectedTransformations[index][transformationIndex].key && ['replace_values', 'alter_datatypes'].includes(this.selectedTransformations[index][transformationIndex].key) && this.selectedTransformations[index][transformationIndex].dropdown && this.selectedTransformations[index][transformationIndex].input){
      this.selectedTransformations[index][transformationIndex].isError = false;
    } else if(this.selectedTransformations[index][transformationIndex].key && !['deduplicate','replace_values', 'alter_datatypes'].includes(this.selectedTransformations[index][transformationIndex].key) && this.selectedTransformations[index][transformationIndex].dropdown){
      this.selectedTransformations[index][transformationIndex].isError = false;
    } else{
      this.selectedTransformations[index][transformationIndex].isError = true;
    }
    
    this.checkTransformationsValid(this.selectedTransformations[index][transformationIndex].isError);
    this.checkcurrentTableTransformationValid(index);
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
    this.checkTransformationsValid(false);
    this.checkcurrentTableTransformationValid(index)
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
    this.checkTransformationsValid(false);
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

  setTransformations(isInvidualTableRun:boolean, index:any, isSkip:boolean){
    let transformationList : any[] = []
    this.draggedTables.forEach((table:any,index:any)=>{
      let object = {
        database : this.schema,
        table : table.tables,
        transform : [] as any[]
      }
      if(this.selectedTransformations[index]){
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
      }
      transformationList.push(object);
    });
    let addTables = !isInvidualTableRun ? this.nonTransformedTables.filter(table => table.selected).map(table => table.tables) : [];
    if(isSkip){
      addTables = [];
    }
    let object = {
      id : this.hierarchyId,
      transformation_list: isInvidualTableRun ? [transformationList[index]] : transformationList,
      ...(isInvidualTableRun && { preview: isInvidualTableRun, limit:  this.showingRows }),
      ...(!isInvidualTableRun && addTables.length > 0 && { add_tables: addTables })
    }
    console.log('payload : ',object);
    this.workbechService.setTransformations(object).subscribe({
      next: (response: any) => {
        console.log(response);
        if(isInvidualTableRun){
          this.isTablePreview = true;
          this.tableHeader = response?.data?.columns;
          this.tableData = response?.data?.rows;
          this.tableName = response?.data?.table_name;
          this.totalRows = response?.data?.total_rows;
          this.showingRows = response?.data?.rows.length;
        } else{
          this.isTablePreview = false;
          let encodedId = btoa(response.parent_id.toString());
          this.router.navigate(['/analytify/database-connection/tables/' + encodedId]);
        }
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

  checkTransformationsValid(isError: boolean) {
    if (this.draggedTables.length === 0 || isError) {
      this.isApplyDisable = true;
      return;
    }

    for (const key of Object.keys(this.selectedTransformations)) {
      for (const transformation of this.selectedTransformations[key]) {
        if (!transformation.key) {
          this.isApplyDisable = true;
          return;
        }
        if (transformation.key && ['replace_values', 'alter_datatypes'].includes(transformation.key) && (!transformation.dropdown || !transformation.input)) {
          this.isApplyDisable = true;
          return;
        }
        if (transformation.key &&!['deduplicate', 'replace_values', 'alter_datatypes'].includes(transformation.key) && !transformation.dropdown) {
          this.isApplyDisable = true;
          return;
        }
      }
    }
    this.isApplyDisable = false;
  }
  checkcurrentTableTransformationValid(index:any){
    if (!this.selectedTransformations[index] || this.selectedTransformations[index].length === 0) {
      this.runButtonDisabled[index] = true;
      return;
    }
  
    this.runButtonDisabled[index] = this.selectedTransformations[index].some((transformation:any) => transformation.isError);
  }
  openTablesSelection(modal: any) {
    const draggedTableNames = new Set(this.draggedTables.map(dragged => dragged.tables));
    this.nonTransformedTables = this.tables.filter(table => !draggedTableNames.has(table.tables)).map(table => ({ ...table, selected: false }));
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
    });
  }
  toggleSelectAll() {
    this.nonTransformedTables.forEach(table => {
      table.selected = this.isAllSelected;
    });
  }
  checkIfAllSelected() {
    this.isAllSelected = this.nonTransformedTables.every(table => table.selected);
  }
}
