import { Component, OnInit } from '@angular/core';
import {ChartDataset, ChartOptions, ChartType} from "chart.js";

@Component({
  selector: 'app-breakdown-chart',
  templateUrl: './breakdown-chart.component.html',
  styleUrls: ['./breakdown-chart.component.scss']
})
export class BreakdownChartComponent implements OnInit {

  chartLabels = [['Females'], ['Males']];
  chartType: ChartType = 'pie';
  showChartLegend = true;

  chartOptions: ChartOptions = {
    responsive: true,
  };

  pieChartData: ChartDataset[] = [
    { data: [25, 45, 89]}
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
