import { Component } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  loading: boolean = false;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderService.loading$.subscribe((isLoading: boolean) => {
      // console.log('LoaderComponent: loading status changed to', isLoading); // Debug log
      this.loading = isLoading;
      if (isLoading) {
        this.startChartAnimation();
      } else {
        this.stopChartAnimation();
      }
    });
  }


  currentChartIndex = 0;
  chartIcons = ['bar', 'line', 'pie', 'doughnut'];
  chartInterval?: any;

  startChartAnimation() {
    this.currentChartIndex = 0;
    this.chartInterval = setInterval(() => {
      this.currentChartIndex = (this.currentChartIndex + 1) % this.chartIcons.length;
    }, 1200); // Change every 800ms
  }
  
  stopChartAnimation() {
    if (this.chartInterval) {
      clearInterval(this.chartInterval);
      this.chartInterval = undefined;
    }
}
}

