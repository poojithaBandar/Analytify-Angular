import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-etl-logger-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './etl-logger-view.component.html',
  styleUrl: './etl-logger-view.component.scss'
})
export class EtlLoggerViewComponent {
  @Input() logs: any[] = [];

  isGroupStart(entry: any): boolean {
    return entry.event?.startsWith('::group::');
  }

  isGroupEnd(entry: any): boolean {
    return entry.event?.startsWith('::endgroup::');
  }

  isStandardLog(entry: any): boolean {
    return !this.isGroupStart(entry) && !this.isGroupEnd(entry);
  }

  formatLevel(level: string): string {
    return level?.toUpperCase() || 'INFO';
  }

  formatTimestamp(ts: string): string {
    return ts ? `[${ts}]` : '';
  }

  stringify(value: any): string {
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
}
