import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ChartDataset, ChartOptions, ChartType} from "chart.js";

@Component({
  selector: 'app-breakdown-chart',
  templateUrl: './breakdown-chart.component.html',
  styleUrls: ['./breakdown-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreakdownChartComponent implements OnInit {


  chartType: ChartType = 'pie';
  showChartLegend = true;

  chartOptions: ChartOptions = {
    responsive: true,
  };

  @Input()
  set chartData(newValue: ChartDataset[]) {
    if (!!newValue && this._chartData !== newValue) {
      this._chartData = [...newValue];
    }
  }

  get chartData(): ChartDataset[] {
    return this._chartData;
  }

  @Input()
  set chartLabels(newValue: string[][]) {
    if (!!newValue && this._chartLabels !== newValue) {
      this._chartLabels = [...newValue];
    }
  }

  get chartLabels(): string[][] {
    return this._chartLabels;
  }

  private _chartData: ChartDataset[] = [];
  private _chartLabels: string[][] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
