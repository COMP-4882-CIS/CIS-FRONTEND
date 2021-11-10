import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-pie-chart-overview',
  templateUrl: './pie-chart-overview.component.html',
  styleUrls: ['./pie-chart-overview.component.scss']
})
export class PieChartOverviewComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { 
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
 };

 public pieChartLabels = [['Females'], ['Males'], ['Penguins']];
 public pieChartType: ChartType = 'pie';
 public pieChartLegend = true;
 public pieChartPlugins = [];
 public pieChartData: ChartDataset[] = [
  { data: [25, 45, 89]}
  ];

  
}

