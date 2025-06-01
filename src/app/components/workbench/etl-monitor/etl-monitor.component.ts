import { Component, ElementRef, NgModule, Renderer2, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts';

interface Run {
  runAfter: string;
  state: string;
  runType: string;
  startDate: string;
  endDate: string;
  duration: string;
}

interface EventRecord {
  when: string;
  runId: string;
  taskId: string;
  mapIndex: string;
  event: string;
  user: string;
}

@Component({
  selector: 'app-etl-monitor',
  standalone: true,
   providers: [
    
      {
        provide: NGX_ECHARTS_CONFIG,
        useFactory: () => ({ echarts: echarts }),
      },
    ],
  imports: [NgbNavModule, CommonModule, NgbModule, FormsModule, NgxEchartsModule],
  templateUrl: './etl-monitor.component.html',
  styleUrl: './etl-monitor.component.scss'
})
export class EtlMonitorComponent {
   activeTabId = 1;

   // ─── Top “Last 24 hours” dropdown & date‐range display ───────────────────────
      selectedRangeLabel = 'Last 24 hours';
      dateRangeDisplay = '2025-05-28, 09:56:52 - 2025-05-29, 09:56:52';

      // ─── ECharts bar‑chart options ────────────────────────────────────────────────
      chartOptions:EChartsOption = {
        title: {
          text: 'Last 2 Dag Runs',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        grid: {
          top: 60,
          left: 40,
          right: 20,
          bottom: 50
        },
        xAxis: {
          type: 'category',
          data: ['2025-05-27, 11:48:44', '2025-05-27, 12:02:43'],
          name: 'Run After',
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          name: 'Duration (seconds)',
          nameLocation: 'middle',
          nameGap: 33,
          nameTextStyle: {
            align: 'center',
            verticalAlign: 'middle'
          },
          min: 0
        },
        series: [
          {
            type: 'bar',
            data: [
              { name: '2025-05-27, 11:48:44', value: 0.98, itemStyle: { color: 'red' } },
              { name: '2025-05-27, 12:02:43', value: 54.69, itemStyle: { color: 'green' } }
            ],
            barWidth: '40%',
            label: { show: false }
          }
        ]
      };

      option:EChartsOption = {
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        type: 'category',
        data: ['2025-05-27, 11:48:44', '2025-05-27, 12:02:43', '2025-05-29, 03:48:44', '2025-05-30, 22:02:43'],
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          show: false
        },
      },
      yAxis: {
        type: 'value',
        name: 'Seconds',
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: {
          align: 'center',
          verticalAlign: 'middle'
        },
        min: 0,
        splitLine: {
          show: false
        },
      },
      series: [
        {
          type: 'bar',
          barWidth: '30%',
          data: [
            { name: '2025-05-27, 11:48:44', value: 0.98, itemStyle: { color: 'red' } },
            { name: '2025-05-27, 12:02:43', value: 54.69, itemStyle: { color: 'green' } },
            { name: '2025-05-29, 03:48:44', value: 0.98, itemStyle: { color: 'red' } },
            { name: '2025-05-30, 22:02:43', value: 54.69, itemStyle: { color: 'green' } }
          ]
        }
      ],
    };

    runs: Run[] = [
        {
          runAfter: 'Pipeline A',
          state: 'Completed',
          runType: 'Automatic',
          startDate: '2023-08-01 08:15',
          endDate:   '2023-08-01 10:15',
          duration:  '2h 0m'
        },
        {
          runAfter: 'Pipeline B',
          state: 'Failed',
          runType: 'Manual',
          startDate: '2023-08-02 14:00',
          endDate:   '2023-08-02 14:45',
          duration:  '45m'
        },
      ];

      // sample data in your component.ts
    tasks = [
      {
        name: 'extract_data_task',
        operator: 'PythonOperator',
        triggerRule: 'all_success',
        lastRun: '2025-05-27, 11:48:44',
        status: 'success',
        miniChartData: [20, 40, 15, 60, 30]
      },
      {
        name: 'transform_records',
        operator: 'BashOperator',
        triggerRule: 'one_failed',
        lastRun: '2025-05-27, 12:02:43',
        status: 'failed',
        miniChartData: [5, 10, 0, 8, 3]
      },
      {
        name: 'load_to_warehouse',
        operator: 'PythonOperator',
        triggerRule: 'all_done',
        lastRun: '2025-05-27, 12:30:10',
        status: 'running',
        miniChartData: [50, 60, 70, 80, 90]
      }
    ];

  tasksRunStatuses = [
    {
      name: 'SRC_fact_level',
      statuses: ['success', 'success', 'success', 'success'] // each entry is one run
    },
    {
      name: 'TGT_fact_level_1_test',
      statuses: ['failed', 'success', 'failed', 'success']
    },
    {
      name: 'send_email_task',
      statuses: ['failed', 'running', 'failed', 'running']
    }
  ];

     events: EventRecord[] = [
        {
          when: '2025-05-29T09:00:00Z',
          runId: 'run_001',
          taskId: 'task_a',
          mapIndex: '0',
          event: 'TASK_STARTED',
          user: 'alice',
        },
        {
          when: '2025-05-29T09:05:00Z',
          runId: 'run_002',
          taskId: 'task_b',
          mapIndex: '1',
          event: 'TASK_FAILED',
          user: 'bob',
        },
        {
          when: '2025-05-29T09:10:00Z',
          runId: 'run_003',
          taskId: 'task_c',
          mapIndex: '0',
          event: 'TASK_SUCCESS',
          user: 'carol',
        },
        // …more sample rows…
      ];

    sortColumnEvent: keyof EventRecord = 'when';
    sortColumnRun: keyof Run = 'runAfter';
    sortDirection: 'asc'|'desc' = 'asc';

    sort(column: keyof EventRecord | keyof Run, type:'event' | 'run') {
      if ( (type === 'event' && this.sortColumnEvent === column) || (type === 'run' && this.sortColumnRun === column)) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        if(type === 'event'){
          this.sortColumnEvent = column as keyof EventRecord;
        } else if(type == 'run'){
          this.sortColumnRun = column as keyof Run;
        }
        this.sortDirection = 'asc';
      }
      if (type === 'event') {
        this.events = this.sortedEvents;
      } else if (type == 'run') {
        this.runs = this.sortedRuns;
      }
    }

     get sortedEvents(): EventRecord[] {
      // if no data yet, guard
      if (!this.events) {
        return [];
      }

      return [...this.events].sort((a, b) => {
        const col = this.sortColumnEvent;

        // special‐case date sorting on the ISO‐string 'when'
        if (col === 'when') {
          const tA = Date.parse(a.when);
          const tB = Date.parse(b.when);
          return this.sortDirection === 'asc' ? tA - tB : tB - tA;
        }

        // special‐case numeric sort on the string‑encoded 'mapIndex'
        if (col === 'mapIndex') {
          const nA = Number(a.mapIndex);
          const nB = Number(b.mapIndex);
          return this.sortDirection === 'asc' ? nA - nB : nB - nA;
        }

        // fallback: string‐compare all other fields
        const sA = String(a[col] ?? '').toLowerCase();
        const sB = String(b[col] ?? '').toLowerCase();
        if (sA < sB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (sA > sB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    get sortedRuns(): Run[] {
      if (!this.runs) {
        return [];
      }

      return [...this.runs].sort((a, b) => {
        const col = this.sortColumnRun;

        // special‑case ISO‑string dates for proper chronological sort
        if (col === 'startDate' || col === 'endDate') {
          const tA = Date.parse(a[col]);
          const tB = Date.parse(b[col]);
          return this.sortDirection === 'asc' ? tA - tB : tB - tA;
        }

        // special‑case duration strings like "2h 0m" or "45m"
        if (col === 'duration') {
          // parse hours/minutes into total minutes
          const toMinutes = (d: string) => {
            const match = d.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
            if (!match) return 0;
            const hrs = parseInt(match[1] ?? '0', 10);
            const mins = parseInt(match[2] ?? '0', 10);
            return hrs * 60 + mins;
          };
          const mA = toMinutes(a.duration);
          const mB = toMinutes(b.duration);
          return this.sortDirection === 'asc' ? mA - mB : mB - mA;
        }

        // fallback: string‑compare all other fields (runAfter, state, runType)
        const sA = String(a[col] ?? '').toLowerCase();
        const sB = String(b[col] ?? '').toLowerCase();
        if (sA < sB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (sA > sB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }



     @ViewChild('resizeContainer', { static: true })
  resizeContainer!: ElementRef<HTMLDivElement>;

  @ViewChild('sidebar', { static: true })
  sidebar!: ElementRef<HTMLDivElement>;

  @ViewChild('divider', { static: true })
  divider!: ElementRef<HTMLDivElement>;

  @ViewChild('main', { static: true })
  mainPane!: ElementRef<HTMLDivElement>;


  private startX = 0;
  private startWidth = 0;
  private unlistenMouseMove!: () => void;
  private unlistenMouseUp!: () => void;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // wire up the mousedown on the divider
    this.renderer.listen(
      this.divider.nativeElement,
      'mousedown',
      this.onMouseDown.bind(this)
    );
  }

  private onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this.startX = e.clientX;
    this.startWidth = this.sidebar.nativeElement.getBoundingClientRect().width;

    // listen to document mousemove/up
    this.unlistenMouseMove = this.renderer.listen(
      'document',
      'mousemove',
      this.onMouseMove.bind(this)
    );
    this.unlistenMouseUp = this.renderer.listen(
      'document',
      'mouseup',
      this.onMouseUp.bind(this)
    );

    // prevent text selection while dragging
    this.renderer.setStyle(document.body, 'user-select', 'none');

  }

  private onMouseMove(e: MouseEvent): void {
    const dx = e.clientX - this.startX;
    let newWidth = this.startWidth + dx;
    const containerRect =
      this.resizeContainer.nativeElement.getBoundingClientRect();
    const minWidth = 200; // px
    const maxWidth = containerRect.width * 0.5; // 50%

    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;

    // apply flex‐basis override on sidebar
    this.renderer.setStyle(
      this.sidebar.nativeElement,
      'flex',
      `0 0 ${newWidth}px`
    );
    // ensure main pane flex‐grows
    this.renderer.setStyle(this.mainPane.nativeElement, 'flex', '1 1 auto');

  }

  private onMouseUp(): void {
    // teardown listeners
    this.unlistenMouseMove();
    this.unlistenMouseUp();
    // restore user-select
    this.renderer.setStyle(document.body, 'user-select', '');
  }
}
