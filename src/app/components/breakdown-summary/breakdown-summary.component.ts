import {Component, Input} from '@angular/core';
import {BreakdownStatResponse} from "../../backend/responses/stat";
import {BreakdownStat} from "../../backend/types/stat/breakdown-stat.type";
import {DistrictFeature} from "../../backend/types/geo/features/layer";

@Component({
  selector: 'app-breakdown-summary',
  templateUrl: './breakdown-summary.component.html',
  styleUrls: ['./breakdown-summary.component.scss']
})
export class BreakdownSummaryComponent {

  @Input()
  set populationStats(newValue: BreakdownStatResponse | null) {
    if (!!newValue) {
      this._populationStats = newValue;
      this.processStats();
    }
  }

  @Input()
  title!: string;

  @Input()
  district?: DistrictFeature;

  underEighteenTotal: number = 0;
  underEighteenMaleTotal: number = 0;
  underEighteenFemaleTotal: number = 0;
  overEighteenTotal: number = 0;

  private _populationStats!: BreakdownStatResponse;

  private processStats() {
    const statData = this._populationStats;

    if (!!statData && statData.stats.length > 0) {
      const stat = statData.stats[0] as BreakdownStat;

      this.underEighteenTotal = stat.populationUnder18;
      this.underEighteenMaleTotal = stat.populationUnder18Male;
      this.underEighteenFemaleTotal = stat.populationUnder18Female;
      this.overEighteenTotal = stat.totalPopulation - stat.populationUnder18;
    }
  }

  get hasDistrictWebsiteURL(): boolean {
    return !!this.district && !!this.district.websiteURL;
  }
}
