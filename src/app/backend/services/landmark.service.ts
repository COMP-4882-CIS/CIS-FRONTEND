import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LandmarkSummaryResponse} from "../responses/landmark/landmark-summary.response";
import {Burly} from "kb-burly";
import {environment} from "../../../environments/environment";
import {SchoolSummaryResponse} from "../responses/landmark/school-summary.response";

@Injectable({
  providedIn: 'root'
})
export class LandmarkService {

  constructor(private http: HttpClient) {
  }

  getLandmarksSummary(zipCode: string): Observable<LandmarkSummaryResponse> {
    const url = Burly(environment.apiURL)
      .addSegment('/landmarks')
      .addSegment('/summary')
      .addQuery('zipCode', zipCode)
      .get;

    return this.http.get<LandmarkSummaryResponse>(url)
  }

  getSchoolSummary(schoolID: number): Observable<SchoolSummaryResponse> {
    const url = Burly(environment.apiURL)
      .addSegment('/schools')
      .addSegment('/breakdown')
      .addQuery('schoolID', schoolID)
      .get;

    return this.http.get<SchoolSummaryResponse>(url)
  }
}
