import {Component, Input} from '@angular/core';
import { LandmarkSummaryResponse } from 'src/app/backend/responses/landmark/landmark-summary.response';

@Component({
  selector: 'app-crime-breakdown-summary',
  templateUrl: './crime-breakdown-summary.component.html',
  styleUrls: ['./crime-breakdown-summary.component.scss']
})
export class CrimeBreakdownSummaryComponent {

    @Input()
    set landmarksSummary(newValue: LandmarkSummaryResponse | undefined) {
      if (!!newValue) {
        this._landmarksSummary = newValue;
        this.processLandmarks();
      }
    }

  @Input()
  title!: string;

  CACount: number = 0;
  CBRCount: number = 0;
  CDCount: number = 0;
  CTCount: number = 0;
  COCount: number = 0;
  CWCount: number = 0;

  private _landmarksSummary!: LandmarkSummaryResponse;

  private processLandmarks() {
    const landmarksSummary = this._landmarksSummary;

    if (!!landmarksSummary) {
        this.CACount= landmarksSummary.totalCA;
        this.CBRCount = landmarksSummary.totalCBR;
        this.CDCount = landmarksSummary.totalCD;
        this.CTCount = landmarksSummary.totalCT;
        this.COCount = landmarksSummary.totalCO;
        this.CWCount = landmarksSummary.totalCW;
    }
  }
}
