import {Component, Input} from '@angular/core';

import { LandmarkSummaryResponse } from 'src/app/backend/responses/landmark/landmark-summary.response';


@Component({
  selector: 'app-lead-breakdown-summary',
  templateUrl: './lead-breakdown-summary.component.html',
  styleUrls: ['./lead-breakdown-summary.component.scss']
})
export class LeadBreakdownSummaryComponent {

    @Input()
    set landmarksSummary(newValue: LandmarkSummaryResponse | undefined) {
      if (!!newValue) {
        this._landmarksSummary = newValue;
        this.processLandmarks();
      }
    }

  @Input()
  title!: string;

  LEAD0Count: number = 0;
  LEAD1Count: number = 0;
  LEAD2Count: number = 0;
  LEAD3Count: number = 0;
  LEAD4Count: number = 0;
  LEAD5Count: number = 0;
  LEAD6Count: number = 0;
  

  private _landmarksSummary!: LandmarkSummaryResponse;

  private processLandmarks() {
    const landmarksSummary = this._landmarksSummary;

    if (!!landmarksSummary) {
        this.LEAD0Count= landmarksSummary.totalLEAD0;
        this.LEAD1Count = landmarksSummary.totalLEAD1;
        this.LEAD2Count = landmarksSummary.totalLEAD2;
        this.LEAD3Count = landmarksSummary.totalLEAD3;
        this.LEAD4Count = landmarksSummary.totalLEAD4;
        this.LEAD4Count = landmarksSummary.totalLEAD5;
        this.LEAD6Count = landmarksSummary.totalLEAD6;
      
        this.chartData=[
          {
          data:[10.82],
          label: 'Age 0'
          },
          {
            data:[8.984447301],
            label: 'Age 1'
            },
          {
            data:[9.410978836],
            label: 'Age 2'
            },
          {
            data:[9.514285714],
            label: 'Age 3'
            },
          {
            data:[10.02290909],
            label: 'Age 4'
            },
          {
            data:[8.838947368],
            label: 'Age 5'
            },
            {
              data:[8.969354839],
              label: 'Age 6'
              },
      
        ];
        this.chartLabels = [
          'Average lead levels by Age'
        ];
        
    }

  }
  chartData=[
    {
    data:[this.LEAD0Count],
    label: 'Age 0'
    },

  ];
  chartLabels = [
    'Lead'
  ];


}

