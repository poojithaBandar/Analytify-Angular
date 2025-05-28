import { Component } from '@angular/core';
import { NgbDropdown, NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import Drawflow from 'drawflow';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { WorkbenchService } from '../workbench.service';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EtlLoggerViewComponent } from '../etl-logger-view/etl-logger-view.component';
import { DataFlowSearchFilterPipe } from '../../../shared/pipes/data-flow-search-filter.pipe';
import { ResizableTopDirective } from '../../../shared/directives/resizable-top.directive';

@Component({
  selector: 'app-etl-job-flow',
  standalone: true,
  imports: [NgbModule, CommonModule, NgSelectModule, FormsModule, EtlLoggerViewComponent, DataFlowSearchFilterPipe, ResizableTopDirective],
  templateUrl: './etl-job-flow.component.html',
  styleUrl: './etl-job-flow.component.scss'
})
export class EtlJobFlowComponent {
  drawflow: any;
  nodeToAdd: string = '';
  isOpen: boolean = true;
  active = 1;
  isNodeSelected: boolean = false;
  selectedNode: any;
  modal: any;
  dataFlowOptions: any[] = [];
  selectedDataFlow: any = null;
  dataObjectOptions: [] = [];
  posX: any;
  posY: any;
  tableTabId: number = 1;
  tableTypeTabId: number = 1;
  nodeTypeCounts: { [key: string]: number } = {};
  etlName: string = '';
  dataFlowId!: string;
  nodeName: string = '';
  isRunEnable: boolean = false;
  objectType: string = 'select';
  dataFlowStatus: any[] = [];
  runId: string = '';
  nodeLogs: any[] = [];
  pollingInterval: any;
  currentNodeColumns: any[] = [];
  logs: any = '';
  isLogShow: boolean = false;
  selectedGroupAttrs: any[] = [];
  groupAttributesList: any[] = [];
  allChecked: boolean = false;
  isSourceClicked: boolean = false;
  isRefrshEnable: boolean = false;
  dataFlowRunStatus: string = '';
  expression: string = '';
  selectedField: any = {};
  groupedColumns: any = {};
  selectedGroup: any = '';
  selectedColumn: any = {};
  selectedIndex: number = -1;
  isJoinerCondition: boolean = false;
  isCanvasSelected: boolean = false;
  canvasData: any = { parameters: [], sqlParameters: [] };
  isParameter: boolean = false;
  isSQLParameter: boolean = false;
  isHaving: boolean = false;
  isWhere: boolean = false;
  isFilter: boolean = false;
  sourceSearchTerm: string = '';
  groupSearchTerm: string = '';
  attributeSearchTerm: string = '';
  parameterSearchTerm: string = '';
  expEditorSearchTerm: string = '';
  attrSelectionSearchTerm: string = '';
  selectedSourceAttributeIndex: number | null = null;
  selectedGroupAttributeIndex: number | null = null;
  selectedAttributeIndex: number | null = null;
  isCollapsed = false;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  returnTypes: string[] = ['varchar', 'char', 'byteint', 'bigint', 'smallint', 'integer', 'numeric', 'boolean', 'date', 'time with time zone',
    'interval', 'time', 'timestamp', 'decimal', 'real', 'double', 'float', 'nvarchar', 'nchar', 'array[string]', 'array[int]', 'param', 'string', 'datetime'
  ];
  dataTypes: string[] = [
    // Numeric types
    'smallint', 'integer', 'bigint', 'decimal', 'numeric', 'real', 'double precision', 'serial', 'bigserial', 'money',

    // Character types
    'char', 'character', 'varchar', 'character varying', 'text',
  
    // Boolean
    'boolean',
  
    // Date/Time types
    'date', 'time', 'time without time zone', 'time with time zone', 'timestamp', 'timestamp without time zone', 'timestamp with time zone', 'interval',
  
    // UUID
    'uuid',
  
    // Binary data
    'bytea',
  
    // Network types
    'cidr', 'inet', 'macaddr', 'macaddr8',
  
    // JSON types
    'json', 'jsonb',
  
    // Arrays
    'array',
  
    // Range types
    'int4range', 'int8range', 'numrange', 'tsrange', 'tstzrange', 'daterange',
  
    // Geometric types
    'point', 'line', 'lseg', 'box', 'path', 'polygon', 'circle',
  
    // XML
    'xml',
  
    // Full Text Search
    'tsvector', 'tsquery',
  
    // Bit string types
    'bit', 'bit varying',
  
    // Object identifiers
    'oid', 'regproc', 'regprocedure', 'regoper', 'regoperator', 'regclass', 'regtype', 'regrole', 'regnamespace',
  
    // Other
    'name', 'enum', 'composite', 'pg_lsn', 'txid_snapshot', 'unknown'
  ];

  constructor(private modalService: NgbModal, private toasterService: ToastrService, private workbechService: WorkbenchService,
    private loaderService: LoaderService, private router: Router, private route: ActivatedRoute) {

    if (this.router.url.startsWith('/analytify/etlList/etl')) {
      if (route.snapshot.params['id1']) {
        const id = +atob(route.snapshot.params['id1']);
        this.dataFlowId = id.toString();
      }
    }
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
      this.drawflow.zoom = 0.8;
      this.drawflow.zoom_refresh();
      this.drawflow.drawflow.drawflow[this.drawflow.module].canvasData = this.canvasData;

      if (this.dataFlowId) {
        this.getDataFlow();
      }

      const canvasElement = container.querySelector('.drawflow') as HTMLElement;

      canvasElement?.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        // Ignore clicks on nodes, ports, and connections
        const isOnNode = target.closest('.drawflow-node');
        const isOnInput = target.closest('.input');
        const isOnOutput = target.closest('.output');
        const isOnConnection = target.closest('svg.connection, .main-path');

        if (!isOnNode && !isOnInput && !isOnOutput && !isOnConnection) {
          console.log('Canvas clicked at:', event.clientX, event.clientY);
          this.isNodeSelected = true;
          this.isCanvasSelected = true;
          this.tableTabId = 8;
        }
      });

      this.drawflow.on('connectionCreated', (connection: any) => {

        const module = this.drawflow.module;
        const data = this.drawflow.drawflow.drawflow[module].data;

        const { input_id, input_class } = connection;
        const inputNode = data[input_id];
        const inputPort = inputNode.inputs[input_class];
        const nodeType = inputNode.data.type;
        if (nodeType !== 'Joiner' && inputPort.connections.length > 1) {
          const lastConnection = inputPort.connections[inputPort.connections.length - 1];

          this.drawflow.removeSingleConnection(lastConnection.node, input_id, lastConnection.input, input_class);

          console.log('Connection limit exceeded for this node type!');
        } else {
          this.getConnectionData(connection);
        }

      });
      this.drawflow.on('connectionSelected', (connection: any) => {
      });

      this.drawflow.on('connectionRemoved', (connection: any) => {
        const { output_id, input_id } = connection;

        const sourceNode = this.drawflow.getNodeFromId(output_id);
        const targetNode = this.drawflow.getNodeFromId(input_id);

        if (targetNode.data.type === 'Joiner') {
          const nodeNamesDropdown = targetNode.data.nodeData.properties.nodeNamesDropdown;
          const sourceNodeName = sourceNode.data.nodeData.general.name;

          const index = nodeNamesDropdown.findIndex((item: any) => item.label === sourceNodeName);
          if (index !== -1) {
            const sourceNodeValue = nodeNamesDropdown[index].value;
            nodeNamesDropdown.splice(index, 1);

            const joinList = targetNode.data.nodeData.properties.joinList;
            const joinIndex = joinList.findIndex((join: any) => join.sourceNodeId === sourceNodeValue);
            if (joinIndex !== -1) {
              joinList.splice(joinIndex, 1);
            }

            if (targetNode.data.nodeData.properties.primaryObject?.value === sourceNodeValue) {
              targetNode.data.nodeData.properties.primaryObject = null;
            }

            if (nodeNamesDropdown.length <= 1) {
              targetNode.data.nodeData.properties.joinList = [];
            }
            this.drawflow.updateNodeDataFromId(targetNode.id, targetNode.data);
          }
        }
        if (this.selectedNode.hasOwnProperty('data')) {
          const node = this.drawflow.getNodeFromId(this.selectedNode.id);
          this.getSelectedNodeData(node);
        }
      });

      this.drawflow.on('nodeSelected', (nodeId: number) => {
        const nodeEl = document.querySelector(`[id="node-${nodeId}"]`);
        this.tableTabId = 1;
        this.isCanvasSelected = false;
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

    if (targetNode.data.type === 'Joiner') {
      targetNode.data.nodeData.properties.nodeNamesDropdown.push({ label: sourceNode.data.nodeData.general.name, value: sourceNode.id });
      if (targetNode.data.nodeData.properties.nodeNamesDropdown.length > 1) {
        targetNode.data.nodeData.properties.joinList.push({ joinType: '', secondaryObject: null, joinCondition: '', sourceNodeId: sourceNode.id, joinObject: null });
      }
      this.drawflow.updateNodeDataFromId(targetNode.id, targetNode.data);
    }

    console.log('Output Node ID:', output_id);
    console.log('Input Node ID:', input_id);
    console.log('Source Node:', sourceNode);
    console.log('Target Node:', targetNode);
  }

  joinListUpdate(event: any, index: any) {
    this.selectedNode.data.nodeData.properties.joinList[index].secondaryObject = event.label;
    this.selectedNode.data.nodeData.properties.joinList[index].sourceNodeId = event.value;
    this.updateNode('properties');
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

    if (['dataFlow'].includes(this.nodeToAdd)) {
      this.modalService.open(this.modal, {
        centered: true,
        windowClass: 'animate__animated animate__zoomIn',
      });
      this.getDataFlowList();
    } else {
      this.addNode(this.nodeToAdd, this.posX, this.posY);
    }
  }

  addNode(name: string, posX: number, posY: number) {
    // bump per‑type counter
    const count = (this.nodeTypeCounts[name] = (this.nodeTypeCounts[name] || 0) + 1);

    // the common shape of nodeData.nodeData
    const defaults = {
      dataFlow: {},
      general: { name: '' },
      properties: {
        truncate: false, create: false,
        havingClause: '', filterCondition: '', whereClause: '',
        nodeNamesDropdown: [], primaryObject: null, joinList: []
      },
      attributes: [],
      groupAttributes: [],
      sourceAttributes: [],
      attributeMapper: [] as any[],
    };

    /** per‑type config for icon/alt text, port counts, initial name, etc. */
    interface NodeConfig {
      iconPath: string;
      altText: string;
      inputCount: number;
      outputCount: number;
      name: string;
      extraNodeData?: Partial<typeof defaults>;
    }

    const configs: Record<string, NodeConfig> = {
      dataFlow: {
        iconPath: this.selectedDataFlow?.type === 'POSTGRESQL'
          ? './assets/images/etl/PostgreSQL-etl.svg'
          : './assets/images/etl/PostgreSQL-etl.svg',
        altText: this.selectedDataFlow?.type === 'POSTGRESQL'
          ? 'PostgreSQL'
          : '',
        inputCount: 1,
        outputCount: 1,
        name: this.selectedDataFlow?.data_flow_name,
        extraNodeData: {
          dataFlow: this.selectedDataFlow,
        },
      },
      taskCommand: {
        iconPath: './assets/images/etl/task_command-etl.svg', altText: 'Task Command', inputCount: 1, outputCount: 1, name:
          `Task_Command_Name_${count}`
      },
      dbCommand: {
        iconPath: './assets/images/etl/db_command-etl.svg', altText: 'DB Command', inputCount: 1, outputCount: 1, name:
          `DB_Command_Name_${count}`
      },
      emailNotification: {
        iconPath: './assets/images/etl/email-etl.svg', altText: 'Email', inputCount: 1, outputCount: 1, name:
          `Email_Name_${count}`
      },
      loop: {
        iconPath: './assets/images/etl/loop_start-etl.svg', altText: 'Loop', inputCount: 1, outputCount: 1, name:
          `Loop_Name_${count}`
      },
    };

    const config = configs[name];
    if (!config) {
      return;
    }

    const buildAndAdd = (nodeType: string, nodeName: string, x: number, iconPath: string, altText: string, extraData: Partial<typeof defaults> = {} ): number => {
      const nodeData = {
        type: nodeType,
        nodeData: { ...defaults, general: { name: nodeName }, ...extraData }
      };
      let label = nodeName;
      if (label.length > 8) {
        label = label.substring(0, 8) + '..';
      }
      const container = document.createElement('div');
      container.innerHTML = `<div><img src=\"${iconPath}\" class=\"node-icon\" alt=\"${altText}\" /><div class=\"node-label\"
        title=\"${nodeName}\">${label}</div><div class=\"node-status\" style=\"display:none;\"></div></div>`;
      return this.drawflow.addNode(nodeType, config.inputCount, config.outputCount, x, posY, nodeType, nodeData, container.innerHTML);
    };

    // add the primary node
    let nodeId = buildAndAdd(name, config.name, posX, config.iconPath, config.altText, config.extraNodeData || {});

    // special ‑ for loop we also add a Loop_End node offset in X
    if (name === 'loop') {
      nodeId = buildAndAdd('loop_end', `Loop_End_Name_${count}`, posX + 300, './assets/images/etl/loop_end-etl.svg', 'Loop End');
    }

    // === unchanged post‑add housekeeping ===
    this.selectedDataFlow = null;
    const allNodes = this.drawflow.drawflow.drawflow[this.drawflow.module].data;
    Object.entries(allNodes).forEach(([id, node]) =>
      console.log('Node ID:', id, 'Node Data:', node)
    );
  }

  updateNode(type: any) {
    let data = {};
    let nodeId = '';
    if (type !== 'parameter') {
      nodeId = this.selectedNode.id;
    }
    if (type === 'general') {
      const general = { name: this.nodeName }
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
    } else if (type === 'parameter') {
      const module = this.drawflow.module || 'Home';
      this.drawflow.drawflow.drawflow[module].canvasData = this.canvasData;
    } else {
      nodeId = this.selectedNode.id;

      data = {
        ...this.selectedNode.data
      };
    }
    if (type !== 'parameter') {
      this.drawflow.updateNodeDataFromId(nodeId, data);
    }
    console.log(this.drawflow.drawflow.drawflow[this.drawflow.module]);
  }

  getSelectedNodeData(node: any) {
    this.isNodeSelected = true;
    this.selectedNode = node;
    this.nodeName = this.selectedNode.data.nodeData.general.name;
    console.log(this.selectedNode);
    this.selectedAttributeIndex = null;
    this.selectedGroupAttributeIndex = null;
    this.selectedSourceAttributeIndex = null;
    if(this.selectedNode.data.type === 'loop_end'){
      this.tableTabId = 2;
    }
    if (this.isRefrshEnable && !['success', 'failed'].includes(this.dataFlowRunStatus)) {
      this.tableTypeTabId = 2;
      this.getDataFlowLogs(this.nodeName);
    }
  }

  getDataFlowList() {
    this.workbechService.getEtlDataFlowList(1, 100, '').subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataFlowOptions = data.data;
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    });
  }
  saveOrUpdateEtlDataFlow() {
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

    const jsonString = JSON.stringify(exportedData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'etl-drawflow.json', { type: 'application/json' });

    const formData = new FormData();
    formData.append('transformation_flow', file);
    formData.append('ETL_flow', JSON.stringify(etlFlow));

    if (this.dataFlowId) {
      formData.append('id', this.dataFlowId);
      this.workbechService.updateEtl(formData).subscribe({
        next: (data: any) => {
          console.log(data);
          this.isRunEnable = true;
          this.dataFlowId = data.dataflow_id;
          this.toasterService.success(data.message, 'success', { positionClass: 'toast-top-right' });
        },
        error: (error: any) => {
          this.isRunEnable = false;
          this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
          console.log(error);
        }
      });
    } else {
      this.workbechService.saveEtl(formData).subscribe({
        next: (data: any) => {
          console.log(data);
          this.isRunEnable = true;
          this.dataFlowId = data.dataflow_id;
          this.toasterService.success(data.message, 'success', { positionClass: 'toast-top-right' });
        },
        error: (error: any) => {
          this.isRunEnable = false;
          this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
          console.log(error);
        }
      });
    }
  }
  runDataFlow() {
    this.workbechService.runEtl(this.etlName).subscribe({
      next: (data: any) => {
        console.log(data);
        this.isRefrshEnable = true;
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
        this.toasterService.success('Run Successfully', 'success', { positionClass: 'toast-top-right' });
      },
      error: (error: any) => {
        this.isRefrshEnable = false;
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
  getDataFlowStatus(runId: any) {
    let object = {
      dag_id: this.etlName,
      run_id: runId
    }
    this.workbechService.disableLoaderForNextRequest();
    this.workbechService.getDataFlowStatus(object).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataFlowStatus = data.tasks;
        this.dataFlowRunStatus = data.status;
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
                const statusDiv = nodeElement.querySelector('.node-status') as HTMLElement;
                if (statusDiv && status) {
                  statusDiv.textContent = status.charAt(0).toUpperCase() + status.slice(1);
                  statusDiv.style.display = 'block';
                  statusDiv.className = `node-status node-status-${status}`;
                }
              }
            }
          }
        });
        this.tableTypeTabId = 2;
        if (!['success', 'failed'].includes(data.status)) {
          setTimeout(() => {
            this.getDataFlowStatus(runId);
          }, 3000);
        } else {
          this.isRefrshEnable = false;
        }
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    });
  }
  getDataFlowLogs(taskId: any) {
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
      let sourceAttr: any[] = [];
      nodes[nodeId].data.nodeData.sourceAttributes.forEach((atrr: any) => {
        const array = [atrr.attributeName, atrr.dataType, atrr.selectedColumn.label, atrr.selectedColumn.dataType];
        sourceAttr.push(array);
      });
      let attr: any[] = [];
      nodes[nodeId].data.nodeData.attributes.forEach((atrr: any) => {
        const array = [atrr.attributeName, atrr.dataType, atrr.expression];
        attr.push(array);
      });
      task.format = 'database',
        task.hierarchy_id = nodes[nodeId].data.nodeData.connection.hierarchy_id,
        task.path = '',
        task.source_table_name = nodes[nodeId].data.nodeData.dataObject.tables;
      task.attributes = attr;
      task.source_attributes = sourceAttr;
    } else {
      if (nodes[nodeId].data.type === 'target_data_object') {
        if (!nodes[nodeId].data.nodeData.properties.create) {
          let attrMapper: any[] = [];
          nodes[nodeId].data.nodeData.attributeMapper.forEach((atrr: any) => {
            const array = [atrr.column, atrr.dataType, atrr.selectedColumn.label, atrr.selectedDataType];
            attrMapper.push(array);
          });
          task.attribute_mapper = attrMapper;
        }
        task.format = 'database',
          task.hierarchy_id = nodes[nodeId].data.nodeData.connection.hierarchy_id,
          task.path = '',
          task.target_table_name = nodes[nodeId].data.nodeData.properties.create ? nodes[nodeId].data.nodeData.dataObject : nodes[nodeId].data.nodeData.dataObject.tables;
        task.truncate = nodes[nodeId].data.nodeData.properties.truncate;
        task.create = nodes[nodeId].data.nodeData.properties.create;
      } else if (nodes[nodeId].data.type === 'Rollup') {
        let grp: any[] = [];
        nodes[nodeId].data.nodeData.groupAttributes.forEach((atrr: any) => {
          const array = [atrr.aliasName, '', atrr.selectedColumn.group + '.' + atrr.selectedColumn.label];
          grp.push(array);
        });
        let attr: any[] = [];
        nodes[nodeId].data.nodeData.attributes.forEach((atrr: any) => {
          const array = [atrr.attributeName, atrr.dataType, atrr.expression];
          attr.push(array);
        });
        task.group_attributes = grp;
        task.having_clause = nodes[nodeId].data.nodeData.properties.havingClause;
        task.attributes = attr;
      } else if (nodes[nodeId].data.type === 'Filter') {
        task.filter_conditions = nodes[nodeId].data.nodeData.properties.filterCondition;
      } else if (nodes[nodeId].data.type === 'Joiner') {
        task.primary_table = nodes[nodeId].data.nodeData.properties.primaryObject.label;
        let joins: any[] = [];
        nodes[nodeId].data.nodeData.properties.joinList.forEach((join: any) => {
          const array = [join.joinType, join.secondaryObject, join.joinCondition];
          joins.push(array);
        });
        let attr: any[] = [];
        nodes[nodeId].data.nodeData.attributes.forEach((atrr: any) => {
          const array = [atrr.attributeName, atrr.dataType, atrr.expression];
          attr.push(array);
        });
        task.joining_list = joins;
        task.where_clause = nodes[nodeId].data.nodeData.properties.whereClause;
        task.attributes = attr;
      } else if (nodes[nodeId].data.type === 'Expression') {
        let exps: any[] = [];
        nodes[nodeId].data.nodeData.attributes.forEach((atrr: any) => {
          const array = [atrr.attributeName, atrr.dataType, atrr.expression];
          exps.push(array);
        });
        task.expressions_list = exps;
      }

      const inputConnections = nodes[nodeId].inputs?.input_1?.connections || [];
      if (inputConnections.length > 0) {
        const prevTaskIds = inputConnections.map((conn: any) => nodes[conn.node].data.nodeData.general.name);
        if (nodes[nodeId].data.type === 'Joiner') {
          task.previous_task_id = prevTaskIds;
        } else {
          task.previous_task_id = prevTaskIds[0];
        }
      }
    }

    return task;
  }
  addNewAttribute() {
    let count = this.selectedNode.data.nodeData.attributes.length + 1;
    let attribute = { attributeName: 'ATTR_NAME_' + count, dataType: 'varchar', expression: '' }
    this.selectedNode.data.nodeData.attributes.push(attribute);
  }
  deleteAttribute(index: number) {
    this.selectedNode.data.nodeData.attributes.splice(index, 1);
    this.updateNode('attribute');
  }
  addNewGroupAttribute() {
    let attribute = { aliasName: '', selectColumnDropdown: this.selectedNode.data.nodeData.dataObject, selectedColumn: null, dataType: '', }
    this.selectedNode.data.nodeData.groupAttributes.push(attribute);
  }
  deleteGroupAttribute(index: number) {
    this.selectedNode.data.nodeData.groupAttributes.splice(index, 1);
    this.updateNode('groupattribute');
  }
  deleteSourceAttribute(index: number) {
    this.selectedNode.data.nodeData.sourceAttributes.splice(index, 1);
    this.updateNode('');
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

  openAttributesSelection(modal: any) {
    const dataObject = this.selectedNode.data.nodeData.dataObject || [];

    let flatList = [];

    if (this.selectedNode.data.type === 'Rollup') {
      const selectedGroups = this.selectedNode.data.nodeData.groupAttributes || [];
      flatList = dataObject.map((attr: any) => {
        const matched = selectedGroups.find((grp: any) => grp.selectedColumn?.value === attr.value);
        return {
          ...attr,
          isChecked: !!matched
        };
      });
    } else if (['Expression', 'Joiner'].includes(this.selectedNode.data.type)) {
      flatList = dataObject.map((attr: any) => ({
        ...attr,
        isChecked: false
      }));
    } else if (this.selectedNode.data.type === 'source_data_object') {
      const columns = dataObject.columns || [];
      flatList = columns.map((col: any) => {
        const attr = {
          label: col.col,
          value: col.col,
          dataType: col.dtype,
          group: this.selectedNode.data.nodeData.general.name,
        };

        if (this.isSourceClicked) {
          const selectedSources = this.selectedNode.data.nodeData.sourceAttributes || [];
          const matched = selectedSources.find((grp: any) => grp.selectedColumn?.value === attr.value);
          return {
            ...attr,
            isChecked: !!matched
          };
        } else {
          return {
            ...attr,
            isChecked: false
          };
        }
      });
    }

    // Group the flat list by `group`
    const grouped = flatList.reduce((acc: any[], attr: any) => {
      let groupObj = acc.find(g => g.group === attr.group);
      if (!groupObj) {
        groupObj = { group: attr.group, isChecked: false, attributes: [] };
        acc.push(groupObj);
      }
      groupObj.attributes.push({ ...attr });
      return acc;
    }, []);

    // Set group-level isChecked
    grouped.forEach((group: any) => {
      group.isChecked = group.attributes.every((attr: any) => attr.isChecked);
    });

    this.groupAttributesList = grouped;

    if (modal !== null) {
      this.modalService.open(modal, {
        centered: true,
        windowClass: 'animate__animated animate__zoomIn',
        modalDialogClass: 'modal-lg modal-dialog-scrollable'
      });
    }
  }

  toggleGroup(group: any) {
    group.attributes.forEach((attr: any) => attr.isChecked = group.isChecked);
  }

  toggleAllAttributes() {
    this.groupAttributesList.forEach(attr => {
      attr.isChecked = this.allChecked;
    });
  }

  openExpressionEdit(modal: any, attribute: any, index: any) {
    if (index !== null || index !== undefined) {
      this.selectedIndex = index;
    }
    let dataObject: any[] = [];
    if (attribute.paramName) {
      dataObject = [''].map((col: any) => ({
        label: '',
        value: '',
        dataType: '',
        group: 'Project Parameters'
      }));
    } else {
      const nodeData = JSON.parse(JSON.stringify(this.selectedNode.data.nodeData));

      if (this.selectedNode.data.type === 'source_data_object') {
        const columns = nodeData.dataObject.columns || [];
        const group = this.selectedNode.data.nodeData.general.name;

        dataObject = columns.map((col: any) => ({
          label: col.col,
          value: col.col,
          dataType: col.dtype,
          group: group
        }));
      } else {
        dataObject = nodeData.dataObject || [];
      }
    }

    this.groupedColumns = dataObject.reduce((acc: any, attr: any) => {
      if (!acc[attr.group]) {
        acc[attr.group] = [];
      }
      acc[attr.group].push(attr);
      return acc;
    }, {} as { [groupName: string]: any[] });

    const groupKeys = Object.keys(this.groupedColumns);
    this.selectedGroup = groupKeys.length > 0 ? groupKeys[0] : null;

    if (attribute.hasOwnProperty('secondaryObject')) {
      this.isJoinerCondition = true;
      this.isParameter = false;
      this.isSQLParameter = false;
      this.isHaving = false;
      this.isWhere = false;
      this.isFilter = false;
      this.selectedField = attribute.secondaryObject;
      this.selectedColumn = this.groupedColumns[this.selectedGroup][0];
      this.expression = attribute.joinCondition;
    } else if (attribute.hasOwnProperty('paramName')) {
      this.isJoinerCondition = false;
      this.isHaving = false;
      this.isWhere = false;
      this.isFilter = false;
      this.selectedField = attribute;
      this.selectedColumn = '';
      if (attribute.hasOwnProperty('sql')) {
        this.isSQLParameter = true;
        this.expression = attribute.sql;
      } else {
        this.isParameter = true;
        this.expression = attribute.default;
      }
    } else if (attribute === 'having') {
      this.isJoinerCondition = false;
      this.isParameter = false;
      this.isSQLParameter = false;
      this.isWhere = false;
      this.isFilter = false;
      this.isHaving = true;
      this.selectedField = 'Having Clause';
      this.selectedColumn = this.groupedColumns[this.selectedGroup][0];;
      this.expression = this.selectedNode.data.nodeData.properties.havingClause;
    } else if (attribute === 'where') {
      this.isJoinerCondition = false;
      this.isParameter = false;
      this.isSQLParameter = false;
      this.isHaving = false;
      this.isFilter = false;
      this.isWhere = true;
      this.selectedField = 'Where Clause';
      this.selectedColumn = this.groupedColumns[this.selectedGroup][0];;
      this.expression = this.selectedNode.data.nodeData.properties.whereClause;
    } else if (attribute === 'filter') {
      this.isJoinerCondition = false;
      this.isParameter = false;
      this.isSQLParameter = false;
      this.isHaving = false;
      this.isWhere = false;
      this.isFilter = true;
      this.selectedField = 'Filter Condition';
      this.selectedColumn = this.groupedColumns[this.selectedGroup][0];;
      this.expression = this.selectedNode.data.nodeData.properties.filterCondition;
    } else {
      this.isJoinerCondition = false;
      this.isParameter = false;
      this.isSQLParameter = false;
      this.isHaving = false;
      this.isWhere = false;
      this.isFilter = false;
      this.selectedField = attribute;
      this.selectedColumn = attribute;
      this.expression = attribute.expression;
    }
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
      modalDialogClass: 'modal-lg modal-dialog-scrollable'
    });
  }

  updateExpressionToNode() {
    if (this.isJoinerCondition) {
      this.selectedNode.data.nodeData.properties.joinList[this.selectedIndex].joinCondition = this.expression;
    } else if (this.isParameter) {
      this.canvasData.parameters[this.selectedIndex].default = this.expression;
    } else if (this.isSQLParameter) {
      this.canvasData.sqlParameters[this.selectedIndex].sql = this.expression;
    } else if (this.isHaving) {
      this.selectedNode.data.nodeData.properties.havingClause = this.expression;
    } else if (this.isWhere) {
      this.selectedNode.data.nodeData.properties.whereClause = this.expression;
    } else if (this.isFilter) {
      this.selectedNode.data.nodeData.properties.filterCondition = this.expression;
    } else {
      this.selectedNode.data.nodeData.attributes[this.selectedIndex].expression = this.expression;
    }

    if (!this.isParameter && !this.isSQLParameter) {
      this.updateNode('');
    } else {
      this.updateNode('parameter');
    }
    this.expression = '';
    this.selectedGroup = '';
    this.selectedColumn = {};
    this.selectedIndex = -1;
    this.isJoinerCondition = false;
    this.isHaving = false;
    this.isWhere = false;
    this.isFilter = false;
  }

  insertOrReplace(text: string, textarea: HTMLTextAreaElement): void {
    const { selectionStart: start, selectionEnd: end } = textarea;
    const value = this.expression || '';

    const prefix = (value && start === end && value[start - 1] !== ' ') ? ' ' : '';
    this.expression = value.slice(0, start) + prefix + text + value.slice(end);

    const newPos = start + prefix.length + text.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    });
  }

  getDataFlow() {
    this.workbechService.getEtlDataFlow(this.dataFlowId).subscribe({
      next: (data) => {
        console.log(data);
        this.etlName = data.dag_id;
        this.dataFlowId = data.id;
        const drawFlowJson = JSON.parse(data.transformation_flow);
        this.drawflow.import(drawFlowJson);
        console.log(drawFlowJson);
        this.isRunEnable = true;
        this.canvasData = drawFlowJson.drawflow.Home.canvasData ? drawFlowJson.drawflow.Home.canvasData : { parameters: [], sqlParameters: [] };
        console.log(this.canvasData);
        this.isNodeSelected = true;
        this.isCanvasSelected = true;
        this.tableTabId = 8;

        setTimeout(() => {
          const allNodes = this.drawflow.drawflow.drawflow['Home'].data;
          Object.entries(allNodes).forEach(([id, node]: [string, any]) => {
            const displayName = (node.data?.nodeData?.general?.name || '').substring(0, 8) + '..';
            const nodeElement = document.querySelector(`#node-${id}`);
            if (nodeElement) {
              const labelElement = nodeElement.querySelector('.node-label') as HTMLElement;
              if (labelElement) {
                labelElement.innerText = displayName;
                labelElement.setAttribute('title', node.data?.nodeData?.general?.name);
              }
            }
          });
        }, 100);
      },
      error: (error: any) => {
        console.log(error);
        this.isRunEnable = false;
        this.toasterService.error(error.error.message, 'error', { positionClass: 'toast-top-right' });
      }
    });
  }

  setAttributeAutoMapper() {
    const mapper = this.selectedNode.data.nodeData.attributeMapper
    if (mapper.length > 0) {
      mapper.forEach((attr: any) => {
        attr.selectedDataType = attr.dataType;
      });
      this.drawflow.updateNodeDataFromId(this.selectedNode.id, this.selectedNode.data);
    }
  }

  addNewParameter() {
    const existingIndexes = this.canvasData?.parameters
      .map((p: any) => {
        const match = p.paramName?.match(/PARAM_NAME_(\d+)/);
        return match ? +match[1] : null;
      })
      .filter((index: any) => index !== null)
      .sort((a: any, b: any) => a! - b!) as number[];

    // Find the smallest unused index
    let newIndex = 1;
    for (let i = 0; i < existingIndexes?.length; i++) {
      if (existingIndexes[i] !== i + 1) {
        newIndex = i + 1;
        break;
      }
      newIndex = existingIndexes.length + 1;
    }

    let parameter = { paramName: `PARAM_NAME_${newIndex}`, dataType: 'varchar', default: '' }
    this.canvasData?.parameters.push(parameter);
  }
  deleteParameter(index: any) {
    this.canvasData.parameters.splice(index, 1);
    this.updateNode('parameter');
  }

  addNewSQLParameter() {
    const existingIndexes = this.canvasData?.sqlParameters
      .map((p: any) => {
        const match = p.paramName?.match(/SQL_PARAM_NAME_(\d+)/);
        return match ? +match[1] : null;
      })
      .filter((index: any) => index !== null)
      .sort((a: any, b: any) => a! - b!) as number[];

    // Find the smallest unused index
    let newIndex = 1;
    for (let i = 0; i < existingIndexes?.length; i++) {
      if (existingIndexes[i] !== i + 1) {
        newIndex = i + 1;
        break;
      }
      newIndex = existingIndexes.length + 1;
    }

    let parameter = { paramName: `SQL_PARAM_NAME_${newIndex}`, dataType: 'varchar', sql: '', default: 'null' }
    this.canvasData?.sqlParameters.push(parameter);
  }
  deleteSQLParameter(index: any) {
    this.canvasData.sqlParameters.splice(index, 1);
    this.updateNode('parameter');
  }

  moveUp(type: string) {
    let isChanged: boolean = false;
    if (type === 'sourceAttributes') {
      if (this.selectedSourceAttributeIndex !== null && this.selectedSourceAttributeIndex > 0) {
        const index = this.selectedSourceAttributeIndex;
        const attrs = this.selectedNode.data.nodeData.sourceAttributes;
        [attrs[index - 1], attrs[index]] = [attrs[index], attrs[index - 1]];
        this.selectedSourceAttributeIndex--;
        isChanged = true;
      }
    } else if (type === 'groupAttributes') {
      if (this.selectedGroupAttributeIndex !== null && this.selectedGroupAttributeIndex > 0) {
        const index = this.selectedGroupAttributeIndex;
        const attrs = this.selectedNode.data.nodeData.groupAttributes;
        [attrs[index - 1], attrs[index]] = [attrs[index], attrs[index - 1]];
        this.selectedGroupAttributeIndex--;
        isChanged = true;
      }
    } else if (type === 'attributes') {
      if (this.selectedAttributeIndex !== null && this.selectedAttributeIndex > 0) {
        const index = this.selectedAttributeIndex;
        const attrs = this.selectedNode.data.nodeData.attributes;
        [attrs[index - 1], attrs[index]] = [attrs[index], attrs[index - 1]];
        this.selectedAttributeIndex--;
        isChanged = true;
      }
    }

    if (isChanged) {
      this.updateNode('');
    }
  }

  moveDown(type: string) {
    let isChanged: boolean = false;
    if (type === 'sourceAttributes') {
      if (this.selectedSourceAttributeIndex !== null && this.selectedSourceAttributeIndex < this.selectedNode.data.nodeData.sourceAttributes.length - 1) {
        const index = this.selectedSourceAttributeIndex;
        const attrs = this.selectedNode.data.nodeData.sourceAttributes;
        [attrs[index + 1], attrs[index]] = [attrs[index], attrs[index + 1]];
        this.selectedSourceAttributeIndex++;
        isChanged = true;
      }
    } else if (type === 'groupAttributes') {
      if (this.selectedGroupAttributeIndex !== null && this.selectedGroupAttributeIndex < this.selectedNode.data.nodeData.groupAttributes.length - 1) {
        const index = this.selectedGroupAttributeIndex;
        const attrs = this.selectedNode.data.nodeData.groupAttributes;
        [attrs[index + 1], attrs[index]] = [attrs[index], attrs[index + 1]];
        this.selectedGroupAttributeIndex++;
        isChanged = true;
      }
    } else if (type === 'attributes') {
      if (this.selectedAttributeIndex !== null && this.selectedAttributeIndex < this.selectedNode.data.nodeData.attributes.length - 1) {
        const index = this.selectedAttributeIndex;
        const attrs = this.selectedNode.data.nodeData.attributes;
        [attrs[index + 1], attrs[index]] = [attrs[index], attrs[index + 1]];
        this.selectedAttributeIndex++;
        isChanged = true;
      }
    }

    if (isChanged) {
      this.updateNode('');
    }
  }

  canvasZoomOut() {
    this.drawflow.zoom_out();
  }
  canvasZoomReset() {
    this.drawflow.zoom_reset()
  }
  canvasZoomIn() {
    this.drawflow.zoom_in();
  }
}
