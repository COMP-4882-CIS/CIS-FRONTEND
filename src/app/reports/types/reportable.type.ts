import {BreakdownStat} from "../../backend/types/stat/breakdown-stat.type";
import {LandmarkSummaryResponse} from "../../backend/responses/landmark/landmark-summary.response";
import {ChartData} from "chart.js";

export interface Reportable {
  stat: BreakdownStat;
  landmarks?: LandmarkSummaryResponse;
  povertyChartData?: ChartData;
  genderChartData?: ChartData;
  overallChartData?: ChartData;
}
