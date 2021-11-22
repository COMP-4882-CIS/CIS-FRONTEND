import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ChartData, ChartOptions, ChartType, ScriptableContext} from "chart.js";
import {ChartDataHelper} from "../../helpers";


@Component({
  selector: 'app-breakdown-chart',
  templateUrl: './breakdown-chart.component.html',
  styleUrls: ['./breakdown-chart.component.scss'],
})
export class BreakdownChartComponent implements AfterViewInit {

  chartColors = ChartDataHelper.CHART_COLORS;
  colors = [
    this.chartColors.red,
    this.chartColors.blue,
    this.chartColors.purple,
    this.chartColors.red
  ];

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
    if (!!newValue && this._chartData !== newValue) {
      this._chartData = newValue;
    }
  }

  get chartData(): ChartData {
    return this._chartData;
  }

  private _chartData: ChartData = {datasets: []};
  private width: number|null = null;
  private height: number|null = null;
  private cache: Map<string, CanvasGradient> = new Map<string, CanvasGradient>();


  constructor(private changeDetector: ChangeDetectorRef) {
  }
ngAfterViewInit() {
  this.update();
}

  update() {
    window.dispatchEvent(new Event('resize'));
    this.changeDetector.detectChanges();
  }

  private createRadialGradient3(context: ScriptableContext<any>, c1: string, c2: string, c3: string) {
    const chartArea = context.chart.chartArea;
    if (!chartArea) {
      // This case happens on initial chart load
      return;
    }

    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (this.width !== chartWidth || this.height !== chartHeight) {
      this.cache.clear();
    }
    let gradient: CanvasGradient | undefined = this.cache.get(c1 + c2 + c3);

    if (!gradient) {
      // Create the gradient because this is either the first render
      // or the size of the chart has changed
      this.width = chartWidth;
      this.height = chartHeight;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const r = Math.min(
        (chartArea.right - chartArea.left) / 2,
        (chartArea.bottom - chartArea.top) / 2
      );
      const ctx = context.chart.ctx;
      gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
      gradient.addColorStop(0, c1);
      gradient.addColorStop(0.5, c2);
      gradient.addColorStop(1, c3);
      this.cache.set(c1 + c2 + c3, gradient);
    }

    return gradient;
  }
}
