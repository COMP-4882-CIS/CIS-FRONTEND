import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {SchoolSummaryResponse} from "../responses/landmark/school-summary.response";
import {SchoolExportRequest, TractExportRequest, ZipExportRequest} from "../requests/export";
import {SchoolFeature} from "../types/geo/features/point";
import {Burly} from "kb-burly";
import {environment} from "../../../environments/environment";
import {saveAs} from 'file-saver';
import {TractBreakdownStat, ZipCodeBreakdownStat} from "../types/stat/breakdown-stat.type";
import {LandmarkSummaryResponse} from "../responses/landmark/landmark-summary.response";

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private http: HttpClient) {
  }

  exportTractData(stat: TractBreakdownStat, landmarkSummary: LandmarkSummaryResponse, district: string) {
    const requestBody: TractExportRequest = {
      tract: `${stat.censusTract}`,
      district,
      totalPopulation: stat.totalPopulation,
      ageUnder5: stat.ageUnder5,
      age5To9: stat.age5To9,
      age10To14: stat.age10To14,
      age15To19: stat.age15To19,
      populationInPovertyUnder6: stat.populationInPovertyUnder6,
      populationInPoverty6To11: stat.populationInPoverty6To11,
      populationInPoverty12To17: stat.populationInPoverty12To17,
      parkCount: landmarkSummary.totalParks,
      libraryCount: landmarkSummary.totalLibraries,
      CCCCount: landmarkSummary.totalCCC,
      CCFCount: landmarkSummary.totalCCF,
      CrimesCount: landmarkSummary.totalCRIMES,
      communityCenterCount: landmarkSummary.totalCommunityCenters

    }

    const url = Burly(environment.apiURL)
    .addSegment('/export')
    .addSegment('/tract')
    .get;

    return this.doExport(url, requestBody);
  }

  exportZIPData(stat: ZipCodeBreakdownStat, landmarkSummary: LandmarkSummaryResponse) {
    const requestBody : ZipExportRequest = {
      zipCode: `${stat.zipCode}`,
      totalPopulation: stat.totalPopulation,
      ageUnder5: stat.ageUnder5,
      age5To9: stat.age5To9,
      age10To14: stat.age10To14,
      age15To19: stat.age15To19,
      populationInPovertyUnder6: stat.populationInPovertyUnder6,
      populationInPoverty6To11: stat.populationInPoverty6To11,
      populationInPoverty12To17: stat.populationInPoverty12To17,
      parkCount: landmarkSummary.totalParks,
      libraryCount: landmarkSummary.totalLibraries,
      CCCCount: landmarkSummary.totalCCC,
      CCFCount: landmarkSummary.totalCCF,
      CrimesCount: landmarkSummary.totalCRIMES,
      communityCenterCount: landmarkSummary.totalCommunityCenters
    }

    const url = Burly(environment.apiURL)
    .addSegment('/export')
    .addSegment('/zip')
    .get;

    return this.doExport(url, requestBody);
  }

  exportSchoolData(summaryResponse: SchoolSummaryResponse, feature: SchoolFeature) {
    let maleStudents = 0;
    let femaleStudents = 0;

    Object.keys(summaryResponse.genderEnrollmentBreakdown).forEach(genderKey => {
      const genderCount: number = summaryResponse.genderEnrollmentBreakdown[genderKey];

      if (genderKey === 'Male') {
        maleStudents = genderCount
      } else if (genderKey === 'Female') {
        femaleStudents = genderCount;
      }
    })

    const requestBody: SchoolExportRequest = {
      schoolName: summaryResponse.schoolName,
      schoolType: feature.category,
      schoolPrincipal: feature.principal,
      zipCode: feature.zipCode,
      totalStudents: summaryResponse.totalEnrolled,
      totalMaleStudents: maleStudents,
      totalFemaleStudents: femaleStudents,
      gradesTaught: ExportService.getGradeRange(summaryResponse),
      studentGradeBreakdown: summaryResponse.gradeEnrollmentBreakdown
    }

    const url = Burly(environment.apiURL)
      .addSegment('/export')
      .addSegment('/school')
      .get;

    return this.doExport(url, requestBody);
  }

  private doExport(url: string, requestBody: any) {
    this.http.post< HttpResponse<any>>(url, requestBody,  {
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    }).subscribe((response) => {
      const contentDispositionHeader = response.headers.get('Content-Disposition');
      let fileName = 'unknown.xlsx';

      if (!!contentDispositionHeader) {
        fileName = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '');
      }

      return saveAs(response.body, fileName);
    })
  }

  private static getGradeRange(summaryResponse: SchoolSummaryResponse) {
    const gradesTaught = summaryResponse.gradesTaught;

    return `${this.stripGrade(gradesTaught.first())} - ${this.stripGrade(gradesTaught.last())}`;
  }

  private static stripGrade(grade: string): string {
    return grade.replace(' Grade', '');
  }
}
