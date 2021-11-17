import {BreakdownStatResponse} from "../backend/responses/stat/breakdown-stat.response";
import {ChartData} from "chart.js";
import {BreakdownStat} from "../backend/types/stat/breakdown-stat.type";

export class ChartDataHelper {

  static getOverallChartData(response: BreakdownStatResponse): ChartData|null {
    const stat = this.getStat(response);
    if (!!stat) {
      return {
        labels: ['Over 18', 'Under 18'],
        datasets: [
          {
            label: 'Population Breakdown',
            data: [
              stat.totalPopulation - stat.populationUnder18,
              stat.populationUnder18,
            ]
          }
        ]
      }
    }

    return null;
  }

  static getGenderChartData(response: BreakdownStatResponse): ChartData|null {
    const stat = this.getStat(response);

    if (!!stat) {
      return {
        labels: ['Female', 'Male'],
        datasets: [
          {
            label: 'Population Breakdown',
            data: [
              stat.populationUnder18Female,
              stat.populationUnder18Male
            ]
          }
        ]
      }
    }

    return null;
  }

  static getPovertyChartData(response: BreakdownStatResponse): ChartData|null {
    const stat = this.getStat(response);

    if (!!stat) {
      return {
        labels: [
          'Under age 6',
          'Ages 6 - 11',
          'Ages 12 - 17',
        ],
        datasets: [
          {
            data: [
              stat.populationInPovertyUnder6,
              stat.populationInPoverty6To11,
              stat.populationInPoverty12To17
            ]
          }
        ]
      }
    }

    return null;
  }

  private static getStat(response: BreakdownStatResponse): BreakdownStat|null {
    if (response.stats.length > 0) {
      return response.stats[0];
    }

    return null;
  }
}
