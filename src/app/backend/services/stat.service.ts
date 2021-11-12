import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, Observable} from "rxjs";
import {TractBreakdownStatResponse, ZipCodeBreakdownStatResponse} from "../responses/stat/breakdown-stat.response";
import {Burly} from "kb-burly";
import {environment} from "../../../environments/environment";
import {GeoDataRequest} from "../requests/geo/geo-data.request";
import {GeoLayer} from "../types/geo/geo-layer.type";
import {map} from "rxjs/operators";

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
    const tractRequests = requests.filter(r => r.type === 'tract');
    const zipRequests = requests.filter(r => r.type === 'zip');

    return forkJoin([this.requestZipGeoStats(zipRequests), this.requestTractGeoStats(tractRequests)]);
  }

  requestTractGeoStats(requests: GeoDataRequest[]) {
    const tracts = requests.map(r => r.id).join(',');

    return this.getTractBreakdown(tracts).pipe(
      map(response => {
        requests.forEach(r => {
          const feature = (r.layer as unknown as GeoLayer).feature;
          const tract = feature.properties!.tract;
          const stat = response.stats.find(s => s.censusTract === Number(tract));

          if (!!stat) {
            feature.properties = {...feature.properties, ...stat};
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
    const zipCodes = requests.map(r => r.id).join(',');

    return this.getZipCodeBreakdown(zipCodes).pipe(
      map(response => {
        requests.forEach(r => {
          const feature = (r.layer as unknown as GeoLayer).feature;
          const zipCode = feature.properties!.name;
          const stat = response.stats.find(s => s.zipCode === Number(zipCode));

          if (!!stat) {
            feature.properties = {...feature.properties, ...stat};
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
