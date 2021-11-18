import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, Observable} from "rxjs";
import {Burly} from "kb-burly";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {LayerFeatureType} from "../types/geo/features/layer/layer-feature-type.enum";
import {TractBreakdownStatResponse, ZipCodeBreakdownStatResponse} from "../responses/stat";
import {GeoDataRequest} from "../requests/geo";
import {GeoLayer} from "../types/geo";
import {TractFeature, ZipcodeFeature} from "../types/geo/features/layer";

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

  requestMapGeoStats(requests: GeoDataRequest[]) {
    const tractRequests = requests.filter(r => r.feature.type === LayerFeatureType.TRACT);
    const zipRequests = requests.filter(r => r.feature.type === LayerFeatureType.ZIP_CODE);

    return forkJoin([this.requestZipGeoStats(zipRequests), this.requestTractGeoStats(tractRequests)]);
  }

  requestTractGeoStats(requests: GeoDataRequest[]) {
    const tracts = requests.map(r => r.feature.id).join(',');

    return this.getTractBreakdown(tracts).pipe(
      map(response => {
        requests.forEach(r => {
          const feature = (r.layer as unknown as GeoLayer).feature;
          const tractFeature: TractFeature = feature.properties as TractFeature;
          const stat = response.stats.find(s => s.censusTract === Number(tractFeature.id));

          if (!!stat) {
            tractFeature.update(stat);
          }
        });

        return {
          layers: requests.map(r => r.layer),
          max: response.stats[0].populationUnder18
        };
      })
    )
  }

  requestZipGeoStats(requests: GeoDataRequest[]) {
    const zipCodes = requests.map(r => r.feature.id).join(',');

    return this.getZipCodeBreakdown(zipCodes).pipe(
      map(response => {
        requests.forEach(r => {
          const feature = (r.layer as unknown as GeoLayer).feature;
          const zipcodeFeature: ZipcodeFeature = feature.properties as ZipcodeFeature;
          const zipCode = zipcodeFeature.id;
          const stat = response.stats.find(s => s.zipCode === Number(zipCode));

          if (!!stat) {
            zipcodeFeature.update(stat);
          }
        });

        return {
          layers: requests.map(r => r.layer),
          max: response.stats[0].populationUnder18
        };
      })
    )
  }
}
