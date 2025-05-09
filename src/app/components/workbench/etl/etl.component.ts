import { Component } from '@angular/core';
import { NgbDropdown, NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import Drawflow from 'drawflow';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { WorkbenchService } from '../workbench.service';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { expression } from 'mathjs';
import { EtlGraphService } from '../etl-graph.service';

@Component({
  selector: 'app-etl',
  standalone: true,
  imports: [NgbModule, CommonModule, NgSelectModule, FormsModule],
  templateUrl: './etl.component.html',
  styleUrl: './etl.component.scss'
})
export class ETLComponent {
  drawflow: any;
  nodeToAdd: string = '';
  isOpen: boolean = true;
  active = 1;
  isNodeSelected: boolean = false;
  selectedNode: any;
  modal: any;
  connectionOptions: any[] = [];
  selectedConnection: any = null;
  dataObjectOptions: [] = [];
  selectedDataObject: any = null;
  posX: any;
  posY: any;
  tableTabId: number = 1;
  tableTypeTabId: number = 1;
  nodeTypeCounts: { [key: string]: number } = {};
  etlName: string = '';
  nodeName: string = '';
  isRunEnable : boolean = false;
  objectType : string = 'select';
  dataFlowStatus : any[] = [];
  runId: string = '';
  nodeLogs: any[] = [];
  pollingInterval: any;
  currentNodeColumns : any[] = [];
  logs : any = '';
  isLogShow : boolean = false;

  constructor(private modalService: NgbModal, private toasterService: ToastrService, private workbechService: WorkbenchService, private loaderService: LoaderService, private etlGraphService: EtlGraphService) {
  }

  ngOnInit() {
    this.loaderService.hide();
    this.intializeDrawflow();
  }
  intializeDrawflow() {
    setTimeout(() => {
      const container = document.getElementById('drawflow')!;
      this.drawflow = new Drawflow(container);
      this.drawflow.reroute = true;
      this.drawflow.start();

      this.drawflow.on('connectionCreated', (connection: any) => {
        this.getConnectionData(connection);
        // if(this.drawflow.getNodeFromId(connection.input_id).data.type === 'Rollup'){
        //   const sourceNodeColumns = this.drawflow.getNodeFromId(connection.output_id).data.nodeData.dataObject;
        //   this.selectedNode.data.nodeData.groupAttributes = sourceNodeColumns
        // }
        this.getDropdownColumnsData(this.drawflow.getNodeFromId(connection.input_id));
      });
      this.drawflow.on('connectionSelected', (connection: any) => {
        // this.getConnectionData(connection);
      });

      this.drawflow.on('connectionRemoved', (connection: any) => {
        const { output_id, input_id } = connection;

        const sourceNode = this.drawflow.getNodeFromId(output_id);
        const targetNode = this.drawflow.getNodeFromId(input_id);

        if (targetNode.data.type === 'Joiner') {
          const nodeNamesDropdown = targetNode.data.nodeData.properties.nodeNamesDropdown;
          const sourceNodeName = sourceNode.data.nodeData.general.name;
      
          const index = nodeNamesDropdown.indexOf(sourceNodeName);
          if (index !== -1) {
            nodeNamesDropdown.splice(index, 1);
            this.drawflow.updateNodeDataFromId(targetNode.id, targetNode.data);
          }
        }
      });

      this.drawflow.on('nodeSelected', (nodeId: number) => {
        const nodeEl = document.querySelector(`[id="node-${nodeId}"]`);
        this.tableTabId = 1;
        if (nodeEl) {
          nodeEl.addEventListener('click', () => {
            const node = this.drawflow.getNodeFromId(nodeId);
            this.getSelectedNodeData(node);
          });
        }
      });

      const allNodes = this.drawflow.drawflow.drawflow[this.drawflow.module].data;
      Object.entries(allNodes).forEach(([id, node]) => {
        console.log('Node ID:', id, 'Node Data:', node);
      });
    }, 100);
  }

  getConnectionData(connection: any) {
    const { output_id, input_id } = connection;

    const sourceNode = this.drawflow.getNodeFromId(output_id);
    const targetNode = this.drawflow.getNodeFromId(input_id);

    if(targetNode.data.type === 'Joiner'){
      targetNode.data.nodeData.properties.nodeNamesDropdown.push(sourceNode.data.nodeData.general.name);
      if(targetNode.data.nodeData.properties.nodeNamesDropdown.length > 1){
        targetNode.data.nodeData.properties.joinList.push({joinType: '', secondaryObject: null, joinCondition: ''});
      }
      this.drawflow.updateNodeDataFromId(targetNode.id, targetNode.data);
    }

    console.log('Output Node ID:', output_id);
    console.log('Input Node ID:', input_id);
    console.log('Source Node:', sourceNode);
    console.log('Target Node:', targetNode);
  }


  onDragStart(event: DragEvent, nodeType: string, modal: any) {
    this.nodeToAdd = nodeType;
    this.modal = modal;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const canvas = document.getElementById('drawflow')!;
    const rect = canvas.getBoundingClientRect();
    this.posX = event.clientX - rect.left;
    this.posY = event.clientY - rect.top;

    if (['source_data_object', 'target_data_object'].includes(this.nodeToAdd)) {
      this.modalService.open(this.modal, {
        centered: true,
        windowClass: 'animate__animated animate__zoomIn',
      });
      this.getConnections();
    } else {
      this.addNode(this.nodeToAdd, this.posX, this.posY);
    }
  }

  addNode(name: string, posX: number, posY: number) {
    let data = { 
      type: '', 
      nodeData: { 
        general: { name: '' }, 
        connection: {}, dataObject: {}, 
        properties: { truncate: false, create: false, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes: [], 
        groupAttributes: [] 
      } 
    };
    let iconPath = '';
    let altText = '';
    let baseName = name;
    let inputNodeCount = 1;
    let outputNodeCount = 1;

    if (baseName === 'source_data_object') {
      if (this.selectedConnection?.server_type === 'POSTGRESQL') {
        iconPath = './assets/images/etl/PostgreSQL-etl.svg';
        altText = 'PostgreSQL';
      }
      data.type = name;
      data.nodeData = { 
        connection: this.selectedConnection, 
        dataObject: this.selectedDataObject, 
        general: { name: 'SRC_' + this.selectedDataObject?.tables }, 
        properties: { truncate: false, create: false, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes:[], 
        groupAttributes:[] 
      };
      inputNodeCount = 0;
      outputNodeCount = 1;
    }
    else if (baseName === 'target_data_object') {
      if (this.selectedConnection?.server_type === 'POSTGRESQL') {
        iconPath = './assets/images/etl/PostgreSQL-etl.svg';
        altText = 'PostgreSQL';
      }
      data.type = name;
      data.nodeData = { 
        connection: this.selectedConnection, 
        dataObject: this.selectedDataObject, 
        general: { name: 'TGT_' + (this.objectType === 'select' ? this.selectedDataObject?.tables : this.selectedDataObject) }, 
        properties: { truncate: false, create: this.objectType === 'select' ? false : true, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes:[], 
        groupAttributes:[] 
      };
      inputNodeCount = 1;
      outputNodeCount = 0;
    }
    else if (baseName === 'Expression') {
      iconPath = './assets/images/etl/expression-etl.svg';
      altText = 'Expression';
      data.type = baseName;
      this.nodeTypeCounts[baseName] = (this.nodeTypeCounts[baseName] || 0) + 1;
      data.nodeData = { 
        connection: {}, 
        dataObject: {}, 
        general: { name: `expression_${this.nodeTypeCounts[baseName]}` }, 
        properties: { truncate: false, create: false, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes:[], 
        groupAttributes:[] 
      }
    }
    else if (baseName === 'Joiner') {
      iconPath = './assets/images/etl/mjoiner-etl.svg';
      altText = 'Joiner';
      data.type = baseName;
      this.nodeTypeCounts[baseName] = (this.nodeTypeCounts[baseName] || 0) + 1;
      data.nodeData = { 
        connection: {}, 
        dataObject: {}, 
        general: { name: `joiner_${this.nodeTypeCounts[baseName]}` }, 
        properties: { truncate: false, create: false, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes:[], 
        groupAttributes:[] 
      }
    }
    else if (baseName === 'Rollup') {
      iconPath = './assets/images/etl/rollup-etl.svg';
      altText = 'Rollup';
      data.type = baseName;
      this.nodeTypeCounts[baseName] = (this.nodeTypeCounts[baseName] || 0) + 1;
      data.nodeData = { 
        connection: {}, 
        dataObject: {}, 
        general: { name: `rollup_${this.nodeTypeCounts[baseName]}` }, 
        properties: { truncate: false, create: false, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes:[], 
        groupAttributes:[] 
      }
    }
    else if (baseName === 'Filter') {
      iconPath = './assets/images/etl/filter-etl.svg';
      altText = 'Filter';
      data.type = baseName;
      this.nodeTypeCounts[baseName] = (this.nodeTypeCounts[baseName] || 0) + 1;
      data.nodeData = { 
        connection: {}, 
        dataObject: {}, 
        general: { name: `filter_${this.nodeTypeCounts[baseName]}` }, 
        properties: { truncate: false, create: false, havingClause: '', filterCondition: '', whereClause: '', nodeNamesDropdown: [], primaryObject: null, joinList: [] }, 
        attributes:[], 
        groupAttributes:[] 
      }
    }

    let displayName = data.nodeData.general.name;
    if (displayName.length > 8) {
      displayName = displayName.substring(0, 8) + '..';
    }
    var html = document.createElement('div');
    html.innerHTML = `
      <img src="${iconPath}" class="node-icon" alt="${altText}" />
      <div class="node-label" title="${data.nodeData.general.name}">${displayName}</div>
      <div class="node-status" style="display: none;"></div>`;

    this.drawflow.registerNode(name, html);
    this.drawflow.addNode(name, inputNodeCount, outputNodeCount, posX, posY, name, data, name, true);

    this.selectedConnection = null;
    this.selectedDataObject = null;
    this.objectType = 'select';
    const allNodes = this.drawflow.drawflow.drawflow[this.drawflow.module].data;
    Object.entries(allNodes).forEach(([id, node]) => {
      console.log('Node ID:', id, 'Node Data:', node);
    });
  }

  updateNode(type: any) {
    let data = {};
    let nodeId = this.selectedNode.id;
    if (type === 'general') {
      const general = { name:  this.nodeName}
      nodeId = this.selectedNode.id;

      data = {
        ...this.selectedNode.data,
        nodeData: {
          ...this.selectedNode.data.nodeData,
          general: general
        }
      };

      let displayName = this.nodeName;
      if (displayName.length > 8) {
        displayName = displayName.substring(0, 8) + '..';
      }
      this.selectedNode.data.nodeData.general.name = this.nodeName;
      const nodeElement = document.querySelector(`#node-${nodeId}`);
      if (nodeElement) {
        const labelElement = nodeElement.querySelector('.node-label') as HTMLElement;
        if (labelElement) {
          labelElement.innerText = displayName;
          labelElement.setAttribute('title', this.nodeName);
        }
      }
    } else if (type === 'properties') {
      nodeId = this.selectedNode.id;

      data = {
        ...this.selectedNode.data
      };
    } else if (type === 'attribute') {
      nodeId = this.selectedNode.id;

      data = {
        ...this.selectedNode.data
      };
    } else if (type === 'groupAttribute'){
      nodeId = this.selectedNode.id;

      data = {
        ...this.selectedNode.data
      };
    } else{
      nodeId = this.selectedNode.id;

      data = {
        ...this.selectedNode.data
      };
    }
    this.drawflow.updateNodeDataFromId(nodeId, data);
    const allNodes = this.drawflow.drawflow.drawflow[this.drawflow.module].data;
    Object.entries(allNodes).forEach(([id, node]) => {
      // if(nodeId)
      this.getDropdownColumnsData(node);
    });
    console.log(allNodes);
  }

  getSelectedNodeData(node: any) {
    this.isNodeSelected = true;
    this.selectedNode = node;
    this.nodeName = this.selectedNode.data.nodeData.general.name;
    console.log(this.selectedNode);
    // this.getDataFlowLogs(this.nodeName);
  }

  getConnections() {
    // let object = {};
    this.workbechService.getConnectionsForEtl().subscribe({
      next: (data) => {
        console.log(data);
        this.connectionOptions = data.server_data;
      },
      error: (error: any) => {
        console.log(error);
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
      }
    });
  }
  getDataObjects() {
    let server_id = this.selectedConnection?.server_id
    const object = {
      hierarchy_ids: [server_id]
    }
    if (server_id) {
      this.workbechService.getTablesForDataTransformation(this.selectedConnection.server_id).subscribe({
        next: (data) => {
          console.log(data);
          this.dataObjectOptions = data?.tables;
        },
        error: (error) => {
          console.log(error);
          this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        }
      });
    }
  }
  saveEtlDataFlow() {
    const exportedData = this.drawflow.export();
    const nodes = exportedData.drawflow.Home.data;
    console.log(exportedData);
    console.log(nodes);

    const tasks: any[] = [];
    const flows: string[][] = [];

    const result: number[][] = [];
    const queue: number[] = [];

    // Step 1: Add all nodes with empty inputs (sources) to queue
    for (const key in nodes) {
      const node = nodes[key];
      if (!node.inputs || Object.keys(node.inputs).length === 0) {
        queue.push(Number(key)); // Use key directly here
      }
    }

    const visited = new Set<string>();

    // Step 2: Process the queue
    while (queue.length > 0) {
      const current = queue.shift();
      if (current === undefined) continue; // type guard

      const node = nodes[current];
      if (!node || !node.outputs) continue;

      for (const outputKey in node.outputs) {
        const connections = node.outputs[outputKey]?.connections || [];
        for (const conn of connections) {
          const to = Number(conn.node);
          const key = `${current}-${to}`;
          if (!visited.has(key)) {
            visited.add(key);
            result.push([current, to]);
            flows.push([this.drawflow.getNodeFromId(current).data.nodeData.general.name, this.drawflow.getNodeFromId(to).data.nodeData.general.name]);
            queue.push(to);
          }
        }
      }
    }

    result.forEach((connection, index) => {
      const [prevNode, currentNode] = connection;

      const task = this.generateTasks(prevNode, nodes);
      if (!tasks.some((t: any) => t.id === task.id)) {
        tasks.push(task);
      }
    });

    result.forEach((connection, index) => {
      const [prevNode, currentNode] = connection;

      const task = this.generateTasks(currentNode, nodes);
      if (!tasks.some((t: any) => t.id === task.id)) {
        tasks.push(task);
      }
    });

    console.log(result);
    console.log(flows);
    console.log(tasks);

    const etlFlow = {
      dag_id: this.etlName,
      tasks: tasks,
      flow: flows
    };

    console.log(etlFlow);

    const object = {
      ETL_flow : etlFlow
    }

    this.workbechService.saveEtl(object).subscribe({
      next: (data: any) => {
        console.log(data);
        this.isRunEnable = true;
      },
      error: (error: any) => {
        this.isRunEnable = false;
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    });
  }
  runDataFlow() {
    this.workbechService.runEtl(this.etlName).subscribe({
      next: (data: any) => {
        console.log(data);
        this.runId = data.run_id;
        // this.startPollingDataFlowStatus(data.run_id);
        Object.entries(this.drawflow.drawflow.drawflow[this.drawflow.module].data).forEach(([id, node]) => {
          const nodeElement = document.querySelector(`#node-${id}`);
          if (nodeElement) {
            const statusDiv = nodeElement.querySelector('.node-status') as HTMLElement;
            if (statusDiv) {
              statusDiv.textContent = '';
              statusDiv.style.display = 'none';
              statusDiv.className = 'node-status'; // remove any previous status class
            }
          }
        });
        this.isLogShow = true;
        this.getDataFlowStatus(data.run_id);
      },
      error: (error: any) => {
        this.isLogShow = false;
        if (error?.error?.message?.detail?.includes('not found')) {
          this.toasterService.info('Please Run After 5 seconds.', 'info', { positionClass: 'toast-top-right' });
        } else {
          this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        }
        console.log(error);
      }
    });
  }
  getDataFlowStatus(runId : any){
    let object = {
      dag_id: this.etlName,
      run_id: runId
    }
    this.workbechService.getDataFlowStatus(object).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataFlowStatus = data.tasks;
        // if (data.status === 'success' || data.status === 'failed') {
        //   clearInterval(this.pollingInterval);
        // }

        Object.entries(this.drawflow.drawflow.drawflow[this.drawflow.module].data).forEach(([id, node]) => {
          const node1 = this.drawflow.getNodeFromId(id);
          const nodeName = node1.data.nodeData.general.name;

          // Find matching task status from dataFlowStatus
          const matchedTask = this.dataFlowStatus.find(task => task.task === nodeName);

          if (matchedTask) {
            let status = matchedTask.state;
            if (node1) {
              const nodeElement = document.querySelector(`#node-${id}`);
              if (nodeElement) {
                const statusDiv = nodeElement.querySelector('.node-status')  as HTMLElement;
                if (statusDiv && status) {
                  statusDiv.textContent = status.charAt(0).toUpperCase() + status.slice(1);
                  statusDiv.style.display = 'block';
                  statusDiv.className = `node-status node-status-${status}`;
                }
              }
            }
          }
        });
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    });
  }
  getDataFlowLogs(taskId:any){
    let object = {
      dag_id: this.etlName,
      run_id: this.runId,
      task_id: taskId
    }
    this.workbechService.getDataFlowLogs(object).subscribe({
      next: (data: any) => {
        console.log(data);
        this.logs = data.content;
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    });
  }
  generateTasks(nodeId: any, nodes: any) {
    // Build task for currentNode
    const task: any = {
      type: nodes[nodeId].data.type,
      id: nodes[nodeId].data.nodeData.general.name,
    };

    if (nodes[nodeId].data.type === 'source_data_object') {
      task.format = 'database',
        task.hierarchy_id = nodes[nodeId].data.nodeData.connection.hierarchy_id,
        task.path = '',
        task.source_table_name = nodes[nodeId].data.nodeData.dataObject.tables;
    } else {
      if (nodes[nodeId].data.type === 'target_data_object') {
        task.format = 'database',
        task.hierarchy_id = nodes[nodeId].data.nodeData.connection.hierarchy_id,
        task.path = '',
        task.target_table_name = nodes[nodeId].data.nodeData.properties.create ? nodes[nodeId].data.nodeData.dataObject : nodes[nodeId].data.nodeData.dataObject.Tables;
        task.truncate = nodes[nodeId].data.nodeData.properties.truncate;
        task.create = nodes[nodeId].data.nodeData.properties.create;
      } else if(nodes[nodeId].data.type === 'Rollup'){
        let grp : any[] = [];
        nodes[nodeId].data.nodeData.groupAttributes.forEach((atrr:any)=>{
          const array = [atrr.aliasName, atrr.selectedColumn.group+'.'+atrr.selectedColumn.label];
          grp.push(array);
        });
        task.group_attributes = grp;
        task.having_clause = nodes[nodeId].data.nodeData.properties.havingClause;
      } else if(nodes[nodeId].data.type === 'Filter'){
        task.filter_conditions = nodes[nodeId].data.nodeData.properties.filterCondition;
      } else if(nodes[nodeId].data.type === 'Joiner'){
        task.primary_table = nodes[nodeId].data.nodeData.properties.primaryObject;
        let joins : any[] = [];
        nodes[nodeId].data.nodeData.properties.joinList.forEach((join:any)=>{
          const array = [join.joinType, join.secondaryObject, join.joinCondition];
          joins.push(array);
        });
        task.joining_list = joins;
        task.where_clause = nodes[nodeId].data.nodeData.properties.whereClause;
      } else if(nodes[nodeId].data.type === 'Expression'){
        let exps : any[] = [];
        nodes[nodeId].data.nodeData.attributes.forEach((atrr:any)=>{
          const array = [atrr.attributeName, atrr.dataType, atrr.expression];
          exps.push(array);
        });
        task.expressions_list = exps;
      }

      const inputConnections = nodes[nodeId].inputs?.input_1?.connections || [];
      if (inputConnections.length > 0) {
        const prevTaskIds = inputConnections.map((conn: any) => nodes[conn.node].data.nodeData.general.name);
        if(nodes[nodeId].data.type === 'Joiner'){
          task.previous_task_id = prevTaskIds;
        } else{
          task.previous_task_id = prevTaskIds[0];
        }
      }
    }

    return task;
  }
  addNewAttribute(){
    let attribute = {attributeName: '', dataType: '', expression: ''}
    this.selectedNode.data.nodeData.attributes.push(attribute);
  }
  deleteAttribute(index:number){
    this.selectedNode.data.nodeData.attributes.splice(index, 1);
    this.updateNode('attribute');
  }
  addNewGroupAttribute(){
    let attribute = {aliasName: '', selectColumnDropdown: this.selectedNode.data.nodeData.dataObject, selectedColumn: null, dataType: '',}
    this.selectedNode.data.nodeData.groupAttributes.push(attribute);
  }
  deleteGroupAttribute(index:number){
    this.selectedNode.data.nodeData.groupAttributes.splice(index, 1);
    this.updateNode('groupattribute');
  }

  startPollingDataFlowStatus(runId: any) {
    // Clear any existing polling
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  
    this.pollingInterval = setInterval(() => {
      this.getDataFlowStatus(runId);
    }, 2000); // Poll every 3 seconds
  }

  getDropdownColumnsData(node:any){
    const tree = this.etlGraphService.buildUpstreamTree(this.drawflow, node.id);
    console.log('nested upstream tree:', tree);

    const list = this.etlGraphService.flattenUpstream(tree);
    console.log('flattened topo list:', list);
    
    let childrenList = list.slice(1); // Exclude the selected node at index 0

    const inputIds: number[] = [];

    Object.values(node.inputs).forEach((input:any) => {
      input.connections.forEach((connection:any) => {
        inputIds.push(connection.node);
      });
    });

    childrenList = inputIds;

    const childDataObjects: any[] = [];
    const childAttributes: any[] = [];
    let childGrpAttributes: any = {};
    const nodeNames: any[] = [];
    const nodeTypes: any[] = [];


    childrenList.forEach(childId => {
      const childNode = this.drawflow.getNodeFromId(childId);
      if (childNode?.data?.nodeData) {
        childDataObjects.push(childNode.data.nodeData.dataObject);
        childAttributes.push(childNode.data.nodeData.attributes);
        if(childNode.data.type === 'Rollup'){
          childGrpAttributes = {[childNode.data.nodeData.general.name]: childNode.data.nodeData.groupAttributes};
        }
        nodeNames.push(childNode.data.nodeData.general.name);
        nodeTypes.push(childNode.data.type);
      }
    });

    console.log('Children DataObjects:', childDataObjects);
    console.log('Children Attributes:', childAttributes);

    this.currentNodeColumns = [];

    for (let i = 0; i < childDataObjects.length; i++) {
      const nodeName = nodeNames[i];
      const nodeType = nodeTypes[i];
      const columns = childDataObjects[i]?.columns || [];
      const attributes = childAttributes[i] || [];

      let items = [];

      if(nodeType === 'source_data_object'){
        for (const col of columns) {
          items.push({
            label: col.col,
            value: col.col,
            dataType: col.dtype,
            group: nodeName
          });
        }
      } 
      else if(!['Rollup', 'Expression'].includes(nodeType)){
        let dataObjects = JSON.parse(JSON.stringify(childDataObjects[i]));
        dataObjects.forEach((object:any)=>{
          object.group = nodeName;
        });
        items = dataObjects;
      }
       if(nodeType === 'Rollup'){
        const attr = childGrpAttributes[nodeName] || [];
        if(attr.length > 0){
          for (const atr of attr) {
            items.push({
              label: atr.aliasName,
              value: atr.aliasName,
              column: atr.selectedColumn,
              group: nodeName
            });
          }
        }
      }

      for (const attr of attributes) {
        items.push({
          label: attr.attributeName,
          value: attr.attributeName,
          dataType: attr.dataType,
          group: nodeName
        });
      }

      this.currentNodeColumns.push(...items);
    }

    console.log('Children columns:', this.currentNodeColumns);
    if(!['source_data_object', 'target_data_object'].includes(node.data.type)){
      node.data.nodeData.dataObject = this.currentNodeColumns;
      this.drawflow.updateNodeDataFromId(node.id, node.data);
    }

    const allNodes = this.drawflow.drawflow.drawflow[this.drawflow.module].data;
      Object.entries(allNodes).forEach(([id, node]) => {
        console.log('Node ID:', id, 'Node Data:', node);
    });
  }
}
