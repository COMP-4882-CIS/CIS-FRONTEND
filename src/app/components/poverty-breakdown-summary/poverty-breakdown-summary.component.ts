import {Component, Input} from '@angular/core';
import {BreakdownStatResponse} from "../../backend/responses/stat/breakdown-stat.response";
import {BreakdownStat} from "../../backend/types/stat/breakdown-stat.type";

@Component({
  selector: 'app-poverty-breakdown-summary',
  templateUrl: './poverty-breakdown-summary.component.html',
  styleUrls: ['./poverty-breakdown-summary.component.scss']
})
export class PovertyBreakdownSummaryComponent {

  @Input()
  set populationStats(newValue: BreakdownStatResponse | null) {
    if (!!newValue) {
      this._populationStats = newValue;
      this.processStats();
    }
  }

  @Input()
  title!: string;

  underSixTotal: number = 0;
  sixToElevenTotal: number = 0;
  twelveToSeventeenTotal: number = 0;
  total: number = 0;

  private _populationStats!: BreakdownStatResponse;

  private processStats() {
    const statData = this._populationStats;

    if (!!statData && statData.stats.length > 0) {
      const stat = statData.stats[0] as BreakdownStat;

      this.underSixTotal = stat.populationInPovertyUnder6;
      this.sixToElevenTotal = stat.populationInPoverty6To11;
      this.twelveToSeventeenTotal = stat.populationInPoverty12To17;
      this.total = stat.populationInPovertyUnder6 + stat.populationInPoverty6To11 + stat.populationInPoverty12To17;
    }
  }
}
