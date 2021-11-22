import {BreakdownStatResponse} from "../backend/responses/stat";
import {ChartData} from "chart.js";
import {BreakdownStat} from "../backend/types/stat/breakdown-stat.type";
import {ColorsHelper} from "./colors.helper";
import {SchoolSummaryResponse} from "../backend/responses/landmark/school-summary.response";

export class ChartDataHelper {

  static getSchoolGenderChartData(response: SchoolSummaryResponse): ChartData | null {
      return {
        labels: response.gendersEnrolled,
        datasets: [
          {
            backgroundColor: Object.keys(response.genderEnrollmentBreakdown).map(name => ColorsHelper.getIdentifiableHexColor(name)),
            data: Object.values(response.genderEnrollmentBreakdown)
          }
        ]
      }
  }

  static getSchoolGradeChartData(response: SchoolSummaryResponse): ChartData | null {
    return {
      labels: response.gradesTaught,
      datasets: [
        {
          backgroundColor: Object.keys(response.gradeEnrollmentBreakdown).map(name =>  ColorsHelper.getIdentifiableHexColor(name)),
          data: Object.values(response.gradeEnrollmentBreakdown)
        }
      ]
    }
  }

  static getOverallChartData(response: BreakdownStatResponse): ChartData | null {
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

  static mergeOverallChartData(destination: ChartData, addition: ChartData): ChartData {
    const destinationData = destination.datasets[0].data as number[]
    const additionData = addition.datasets[0].data as number[]

    return {
      labels: ['Over 18', 'Under 18'],
      datasets: [
        {
          label: 'Population Breakdown',
          data: [
            (destinationData[0] || 0) + (additionData[0] || 0),
            (destinationData[1] || 0) + (additionData[1] || 0),
          ]
        }
      ]
    }
  }

  static getGenderChartData(response: BreakdownStatResponse): ChartData | null {
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

  static mergeGenderChartData(destination: ChartData, addition: ChartData): ChartData {
    const destinationData = destination.datasets[0].data as number[]
    const additionData = addition.datasets[0].data as number[]

    return {
      labels: ['Female', 'Male'],
      datasets: [
        {
          label: 'Population Breakdown',
          data: [
            (destinationData[0] || 0) + (additionData[0] || 0),
            (destinationData[1] || 0) + (additionData[1] || 0),
          ]
        }
      ]
    }
  }

  static getPovertyChartData(response: BreakdownStatResponse): ChartData | null {
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

  static mergePovertyChartData(destination: ChartData, addition: ChartData): ChartData {
    const destinationData = destination.datasets[0].data as number[]
    const additionData = addition.datasets[0].data as number[]

    return {
      labels: [
        'Under age 6',
        'Ages 6 - 11',
        'Ages 12 - 17',
      ],
      datasets: [
        {
          label: 'Population Breakdown',
          data: [
            (destinationData[0] || 0) + (additionData[0] || 0),
            (destinationData[1] || 0) + (additionData[1] || 0),
            (destinationData[2] || 0) + (additionData[2] || 0),
          ]
        }
      ]
    }
  }

  private static getStat(response: BreakdownStatResponse): BreakdownStat | null {
    if (response.stats.length > 0) {
      return response.stats[0];
    }

    return null;
  }
}
