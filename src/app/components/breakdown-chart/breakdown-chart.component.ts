import {Component, Input} from '@angular/core';
import {ChartData, ChartOptions, ChartType} from "chart.js";

@Component({
  selector: 'app-breakdown-chart',
  templateUrl: './breakdown-chart.component.html',
  styleUrls: ['./breakdown-chart.component.scss'],
})
export class BreakdownChartComponent {

  chartType: ChartType = 'pie';
  showChartLegend = true;

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
  };

  @Input()
  set chartData(newValue: ChartData | null | undefined) {
    if (!!newValue) {
      this._chartData = JSON.parse(JSON.stringify(newValue));
    }
  }

  get chartData(): ChartData {
    return this._chartData;
  }

  private _chartData: ChartData = {datasets: []};
}
