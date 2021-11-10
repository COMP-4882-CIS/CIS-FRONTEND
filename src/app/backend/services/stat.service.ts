import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TractBreakdownStatResponse, ZipCodeBreakdownStatResponse} from "../responses/stat/breakdown-stat.response";
import {Burly} from "kb-burly";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StatService {

  constructor(private http: HttpClient) {
  }

  getZipCodeBreakdown(zipCode: number | string): Observable<ZipCodeBreakdownStatResponse> {
    const url = Burly(environment.apiURL)
      .addSegment('/census')
      .addSegment('/breakdown')
      .addQuery('zipCode', zipCode)
      .get;

    return this.http.get<ZipCodeBreakdownStatResponse>(url);
  }

  getTractBreakdown(tract: number | string): Observable<TractBreakdownStatResponse> {
    const url = Burly(environment.apiURL)
      .addSegment('/census')
      .addSegment('/breakdown')
      .addQuery('tract', tract)
      .get;

    return this.http.get<TractBreakdownStatResponse>(url);
  }
}
