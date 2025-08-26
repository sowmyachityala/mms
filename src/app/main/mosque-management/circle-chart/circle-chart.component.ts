import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-chart',
  templateUrl: './circle-chart.component.html',
  styleUrl: './circle-chart.component.scss'
})
export class CircleChartComponent {
  @Input() percentage?: string;

    constructor() { }

    ngOnInit() {
    }

    get formattedDashArray() {
      return this.percentage + ', 100';
    }
}
