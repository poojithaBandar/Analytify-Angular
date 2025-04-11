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
  originalTableData = [{tables : '', columns : []}];
  draggedTables: any[] = [];
  selectedTransformations: any = {};
  serverId : any;
  hierarchyId : any;
  schema : any;
  databaseName : any;
  transformationTypes = [
    { key: 'deduplicate', label: 'Remove duplicates', needColumn: false },
    { key: 'replace_values', label: 'Handle null values', needColumn: true, dropdown:'', input:'' },
    { key: 'special_char_remove', label: 'Remove special characters', needColumn: true, dropdown:'' },
    { key: 'alter_datatypes', label: 'Change data types', needColumn: true, dropdown:'', input:'' },
    { key: 'upper', label: 'Upper case', needColumn: true, dropdown:'' },
    { key: 'lower', label: 'Lower case', needColumn: true, dropdown:'' },
    { key: 'title', label: 'Title case', needColumn: true, dropdown:'' }
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
  isAddTheseTablesDisable : boolean = true;
  transformationsPreview : any[] = [];
  primaryHierarchyId : any;
  querySetIdFromDatasource : any;
  isCrossDbSelect : boolean = false;
  isCustomSql : boolean = false;

  constructor(private workbechService: WorkbenchService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal) {
    localStorage.setItem('QuerySetId', '0');
    localStorage.setItem('customQuerySetId', '0');
    if (this.router.url.startsWith('/analytify/databaseConnection/dataTransformation')) {
      if (route.snapshot.params['id']) {
        this.serverId = +atob(route.snapshot.params['id']);
        console.log(this.serverId);
      }
    } else if(this.router.url.startsWith('/analytify/transformationList/dataTransformation')){
      if (route.snapshot.params['id']) {
        this.hierarchyId = +atob(route.snapshot.params['id']);
        console.log(this.hierarchyId);
      }
    } else if(this.router.url.startsWith('/analytify/crossDatabase')){
      if(this.router.url.startsWith('/analytify/crossDatabase/customSql/dataTransformation')){
        this.isCustomSql = true;
      } else if(this.router.url.startsWith('/analytify/crossDatabase/dataTransformation')){
        this.isCustomSql = false;
      }
      if (route.snapshot.params['id1']) {
        this.serverId = +atob(route.snapshot.params['id1']);
        console.log(this.serverId);
      }
      if (route.snapshot.params['id2']) {
        this.primaryHierarchyId = +atob(route.snapshot.params['id2']);
        console.log(this.primaryHierarchyId);
      }
      if (route.snapshot.params['id3']) {
        this.querySetIdFromDatasource = +atob(route.snapshot.params['id3']);
        console.log(this.querySetIdFromDatasource);
      }
      this.isCrossDbSelect = true;
    }
  }

  ngOnInit() {
    if(this.hierarchyId){
      this.getTransformationsEditPreview();
    } else if(this.serverId){
      this.getTablesForDataTransformation();
    }
  }

  addNewTransform(index: number){
    if (!this.selectedTransformations[index]) {
      this.selectedTransformations[index] = [{}]; // Initialize if not set
    } else {
      this.selectedTransformations[index].push({input : '',dropdown:'',keys:[],key:'', label:'',isError:true});
    }
    this.transformationTypes.forEach((trans:any)=>{
      trans.dropdown = '';
      trans.input = '';
    })
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
  
  editTransformationPreview(index: number, transformationIndex: number, typeIndex:number){
    const key = this.selectedTransformations[index][transformationIndex].key;
    const dropdown = this.selectedTransformations[index][transformationIndex].dropdown;
    const input = this.selectedTransformations[index][transformationIndex].input;

    // const tTypeIndex = this.transformationTypes.findIndex(trans => trans.key === key);
    if(key === this.transformationTypes[typeIndex].key){
      if(this.transformationTypes[typeIndex]?.dropdown === '' || this.transformationTypes[typeIndex]?.dropdown !== ''){
        this.transformationTypes[typeIndex].dropdown = dropdown;
      }
      if(this.transformationTypes[typeIndex]?.input === '' || this.transformationTypes[typeIndex]?.input !== ''){
        this.transformationTypes[typeIndex].input = input;
      }
    } else{
      if(this.transformationTypes[typeIndex]?.dropdown){
        this.transformationTypes[typeIndex].dropdown = '';
      }
      if(this.transformationTypes[typeIndex]?.input){
        this.transformationTypes[typeIndex].input = '';
      }
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
      this.selectedTransformations[index][transformationIndex] = {input : '',dropdown:'',keys:[],key:'', label:'',isError:true}
    }
    if(isInput){
      this.selectedTransformations[index][transformationIndex].input = event.target.value;
    } else if(isDropdown){
      this.selectedTransformations[index][transformationIndex].dropdown = event.target.value;
      this.transformationTypes.forEach((trans:any)=>{
        if(trans.key !== transformationKey){
          trans.dropdown = '';
          trans.input = '';
        }
      });
    } if(transformationKey){
      this.selectedTransformations[index][transformationIndex].key = transformationKey;

      const transformation = this.transformationTypes.find(t => t.key === transformationKey);
      this.selectedTransformations[index][transformationIndex].label = transformation ? transformation.label : '';
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

  setTransformationsEditPreview() {
    this.transformationsPreview.forEach((transformation: any, index: any) => {
      let table = this.tables.find(table => transformation.table === table.tables);
      this.draggedTables.push(table);
      transformation.transform.forEach((t: any, tIndex: any) => {
        if (!this.selectedTransformations[index]) {
          this.selectedTransformations[index] = [];
        }
        if (!this.selectedTransformations[index][tIndex]) {
          this.selectedTransformations[index][tIndex] = { input: '', dropdown: '', keys: [], key: '', label: '', isError: false }
        }
        this.selectedTransformations[index][tIndex].key = t.type;
        if (['case_change'].includes(t.type)) {
          this.selectedTransformations[index][tIndex].dropdown = t.keys[0];
          this.selectedTransformations[index][tIndex].key = t.keys[1];
          t.type = t.keys[1];
        } else if (t.type === 'replace_values') {
          this.selectedTransformations[index][tIndex].dropdown = t.keys[0];
          this.selectedTransformations[index][tIndex].input = t.keys[2];
        } else if (t.type === 'alter_datatypes') {
          this.selectedTransformations[index][tIndex].dropdown = t.keys[0];
          this.selectedTransformations[index][tIndex].input = t.keys[1];
        } else if (t.type === 'special_char_remove') {
          this.selectedTransformations[index][tIndex].dropdown = t.keys[0];
        }
        const transformation = this.transformationTypes.find(trans => trans.key === t.type);
        this.selectedTransformations[index][tIndex].label = transformation ? transformation.label : '';
      });
    });
    console.log(this.selectedTransformations);
    this.checkTransformationsValid(false);
  }

  getTablesForDataTransformation(){
    this.workbechService.getTablesForDataTransformation(this.serverId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.tables = response.tables;
        this.originalTableData = response.tables;
        this.schema = response.schema;
        this.databaseName = response.databas_name;
        
        if(this.hierarchyId && this.transformationsPreview.length >0){
          this.setTransformationsEditPreview();
        } else if(!this.hierarchyId && response.hierarchy_id){
          this.hierarchyId = response.hierarchy_id;
          this.getTransformationsEditPreview();
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

  setTransformations(isInvidualTableRun:boolean, index:any, isSkip:boolean){
    console.log(this.selectedTransformations);
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
    let isEdit = this.hierarchyId ? true : false;
    let object = {
      id : this.serverId,
      transformation_list: isInvidualTableRun ? [transformationList[index]] : transformationList,
      ...(isInvidualTableRun && { preview: isInvidualTableRun, limit:  this.showingRows }),
      ...(!isInvidualTableRun && addTables.length > 0 && { add_tables: addTables }),
      ...(isEdit && { hierarchy_id: this.hierarchyId }),
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
          if (this.isCrossDbSelect) {
            this.connectCrossDbs(response.parent_id);
          } else {
            this.router.navigate(['/analytify/database-connection/tables/' + encodedId]);
          }
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
    this.nonTransformedTables = this.originalTableData.filter(table => !draggedTableNames.has(table.tables)).map(table => ({ ...table, selected: false }));
    if(this.nonTransformedTables.length > 0){
      this.modalService.open(modal, {
        centered: true,
        windowClass: 'animate__animated animate__zoomIn',
      });
    } else{
      this.setTransformations(false, '', true);
    }
  }
  toggleSelectAll() {
    this.nonTransformedTables.forEach(table => {
      table.selected = this.isAllSelected;
    });
    this.isAddTheseTablesDisable = !this.isAllSelected;
  }
  checkIfAllSelected() { 
    this.isAllSelected = this.nonTransformedTables.every(table => table.selected);
    this.isAddTheseTablesDisable = !this.nonTransformedTables.some(table => table.selected);
  }
  getFilteredTables(){
    this.tables = this.originalTableData;
    if(this.searchText){
      this.tables = this.tables.filter(table =>
        table?.tables?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }
  getTransformationsEditPreview(){
    this.workbechService.getTransformationsPreview(this.hierarchyId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.transformationsPreview = response.data[0].transformations;
        this.hierarchyId = response.hierarchy_id;
        if(this.serverId && this.tables.length > 0){
          this.setTransformationsEditPreview();
        } else if(!this.serverId){
          this.serverId = response.data[0].datasource_id;
          this.getTablesForDataTransformation();
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
  connectCrossDbs(secondaryHierarchyId : any) {
    const obj = {
      hierarchy_ids: [this.primaryHierarchyId, secondaryHierarchyId]
    }
    this.workbechService.crossDbConnection(obj).subscribe({
      next: (data) => {
        console.log(data);
        const encodedId = btoa(data[0].cross_db_id.toString());
        if(this.isCustomSql){
          if(this.querySetIdFromDatasource){
            const encodeQrysetId = btoa(this.querySetIdFromDatasource.toString())
            this.router.navigate(['/analytify/database-connection/savedQuery/'+encodedId+'/'+encodeQrysetId]);
            }
            else{
              this.router.navigate(['/analytify/database-connection/savedQuery/'+encodedId]);
            }
        } else{
          if (this.querySetIdFromDatasource) {
            const encodeQrysetId = btoa(this.querySetIdFromDatasource.toString())
            this.router.navigate(['/analytify/database-connection/tables/' + encodedId + '/' + encodeQrysetId]);
          }
          else {
            this.router.navigate(['/analytify/database-connection/tables/' + encodedId]);
          }
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
    })
  }
}
