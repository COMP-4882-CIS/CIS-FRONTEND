import {Component, Input} from '@angular/core';
import {BreakdownStat} from "../../backend/types/stat/breakdown-stat.type";
import {DistrictFeature} from "../../backend/types/geo/features/layer";
import {LandmarkSummaryResponse} from "../../backend/responses/landmark/landmark-summary.response";

@Component({
  selector: 'app-breakdown-summary',
  templateUrl: './breakdown-summary.component.html',
  styleUrls: ['./breakdown-summary.component.scss']
})
export class BreakdownSummaryComponent {

  @Input()
  set populationStats(newValue: BreakdownStat | null) {
    if (!!newValue) {
      this._populationStats = newValue;
      this.processStats();
    }
  }

  @Input()
  set landmarksSummary(newValue: LandmarkSummaryResponse | undefined) {
    if (!!newValue) {
      console.log('AAA', newValue);
      this._landmarksSummary = newValue;
      this.processLandmarks();
    }
  }

  @Input()
  title!: string;

  @Input()
  district?: DistrictFeature;


  totalParks: number = 0;
  totalLibraries: number = 0;
  totalCommunityCenters: number = 0;

  underEighteenTotal: number = 0;
  underEighteenMaleTotal: number = 0;
  underEighteenFemaleTotal: number = 0;
  overEighteenTotal: number = 0;

  showLandmarksSummary = false;

  private _populationStats!: BreakdownStat;
  private _landmarksSummary?: LandmarkSummaryResponse;

  private processStats() {
    const stat = this._populationStats;

    if (!!stat) {
      this.underEighteenTotal = stat.populationUnder18;
      this.underEighteenMaleTotal = stat.populationUnder18Male;
      this.underEighteenFemaleTotal = stat.populationUnder18Female;
      this.overEighteenTotal = stat.totalPopulation - stat.populationUnder18;
    }
  }

  private processLandmarks() {
    const landmarksSummary = this._landmarksSummary;

    if (!!landmarksSummary) {
      this.showLandmarksSummary = true;

      this.totalParks = landmarksSummary.totalParks;
      this.totalLibraries = landmarksSummary.totalLibraries;
      this.totalCommunityCenters = landmarksSummary.totalCommunityCenters;
    } else {
      this.showLandmarksSummary = false;
    }
  }

  get hasDistrictWebsiteURL(): boolean {
    return !!this.district && !!this.district.websiteURL;
  }
}
