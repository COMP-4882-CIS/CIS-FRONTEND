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

  getSickFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/fire.geojson');
  }

  getLEAD0Features() {
    return this.http.get<GeoJSONObject>('assets/data/lead_data0.geojson');
  }
  getLEAD1Features() {
    return this.http.get<GeoJSONObject>('assets/data/lead_data1.geojson');
  }
  getLEAD2Features() {
    return this.http.get<GeoJSONObject>('assets/data/lead_data2.geojson');
  }
  getLEAD3Features() {
    return this.http.get<GeoJSONObject>('assets/data/lead_data3.geojson');
  }
  getLEAD4Features() {
    return this.http.get<GeoJSONObject>('assets/data/lead_data4.geojson');
  }
  getLEAD5Features() {
    return this.http.get<GeoJSONObject>('assets/data/lead_data5.geojson');
  }
  getLEAD6Features() {
    return this.http.get<GeoJSONObject>('assets/data/lead_data6.geojson');
  }


  getSearchFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/search.geojson');
  }

  getHealthFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/Hospitals.geojson');
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

  getCCFFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/cs_family.geojson');
  }

  getCCCFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/cs_center.geojson');
  }

  getCAFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/cr_assault.geojson');
  }

  getCBRFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/cr_burgrob.geojson');
  }

  getCDFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/cr_drug.geojson');
  }

  getCTFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/cr_theft.geojson');
  }

  getCOFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/cr_trafficother.geojson');
  }

  getCWFeatures() {
    return this.http.get<GeoJSONObject>('assets/data/cr_weapon.geojson');
  }
}
