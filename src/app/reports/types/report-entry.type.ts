import {BreakdownStat} from "../../backend/types/stat/breakdown-stat.type";
import {LandmarkSummaryResponse} from "../../backend/responses/landmark/landmark-summary.response";
import {ChartData} from "chart.js";
import {Reportable} from "./reportable.type";

export class ReportEntry implements Reportable {
  id: string;
  stat: BreakdownStat;
  landmarks?: LandmarkSummaryResponse;
  povertyChartData?: ChartData;
  genderChartData?: ChartData;
  overallChartData?: ChartData;

  constructor(id: string, stat: BreakdownStat) {
    this.id = id;
    this.stat = stat;
  }

  get hasLandmarks(): boolean {
    return !!this.landmarks;
  }

  get hasPovertyChartData(): boolean {
    return !!this.povertyChartData && this.povertyChartData.datasets.length > 0;
  }

  get hasGenderChartData(): boolean {
    return !!this.genderChartData && this.genderChartData.datasets.length > 0;
  }

  get hasOverallChartData(): boolean {
    return !!this.overallChartData && this.overallChartData.datasets.length > 0;
  }
}
