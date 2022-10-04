import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GeoJSONObject} from "../types/geo";

@Injectable({
  providedIn: 'root'
})
export class GeoTractService {

  constructor(private http: HttpClient) { }

  getCensusTractFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/census-tracts.geojson');
  }

  getZipCodeFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/zipcodes.geojson');
  }

  getDistrictFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/districts.geojson');
  }

  getParksFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/parks.geojson');
  }

  getLibraryFeatures(){
    return this.http.get<GeoJSONObject>('assets/data/libraries.geojson');
  }

  getCentersFeatures(){
    return this.http.get<GeoJSONObject>('assets/data/centers.geojson');
  }

  getSchoolsFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/schools.geojson');
  }

  getChildCareFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/childcare.geojson');
  }
}
