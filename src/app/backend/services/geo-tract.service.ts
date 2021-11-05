import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Burly} from "kb-burly";
import {Observable, Subject} from "rxjs";

import {GeoJSONObject} from "../types/geo/geo-json.type";
import {concatMap, expand, map, reduce, takeWhile, tap} from "rxjs/operators";
import {GeoFeaturesResponse} from "../responses/geo/geo-features.response";

const TEST_URL = 'http://localhost:3000/';
@Injectable({
  providedIn: 'root'
})
export class GeoTractService {

  tractFeatureAvailable: Subject<GeoJSONObject> = new Subject<GeoJSONObject>();

  constructor(private http: HttpClient) { }

  recursivelyGetTractFeatures(): Observable<{ features: GeoJSONObject, done: boolean }> {
    return this.getTractFeatures()
      .pipe(
        expand(res => this.getTractFeatures(res.currentPage + 1)),
        takeWhile(res => res.pagesRemaining > 0, true),
        map(res => ({features: res.data, done: (res.pagesRemaining === 0)})),
      )
  }

  recursivelyGetZipCodeFeatures(): Observable<{ features: GeoJSONObject, done: boolean }> {
    return this.getZipCodeFeatures()
      .pipe(
        expand(res => this.getZipCodeFeatures(res.currentPage + 1)),
        takeWhile(res => res.pagesRemaining > 0, true),
        map(res => ({features: res.data, done: (res.pagesRemaining === 0)})),
      )
  }


  getTractFeatures(pageNumber = 0, pageSize = 50): Observable<GeoFeaturesResponse> {
    const url = Burly(TEST_URL)
      .addSegment('/mem-datahub')
      .addSegment('/page')
      .addSegment('/tractGeometry')
      .addQuery('pageNumber', pageNumber)
      .addQuery('pageSize', pageSize)
      .get;

    return this.http.get<GeoFeaturesResponse>(url);
  }

  getZipCodeFeatures(pageNumber = 0, pageSize = 50): Observable<GeoFeaturesResponse> {
    const url = Burly(TEST_URL)
      .addSegment('/mem-datahub')
      .addSegment('/page')
      .addSegment('/zipGeometry')
      .addQuery('pageNumber', pageNumber)
      .addQuery('pageSize', pageSize)
      .get;

    return this.http.get<GeoFeaturesResponse>(url);
  }

}
