import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GeoJSONObject} from "../types/geo/geo-json.type";

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

  getParksFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/parks.geojson');
  }
}
