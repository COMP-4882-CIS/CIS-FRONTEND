import {Component, Input} from '@angular/core';
import {switchMap, tap} from "rxjs/operators";
import {ChartData} from "chart.js";
import {TitleCasePipe} from "@angular/common";
import {ChartDataHelper} from "../../helpers";
import {resettable} from "../../lib/resettable.rxjs";
import {DistrictFeature, LayerFeature, TractFeature, ZipcodeFeature} from "../../backend/types/geo/features/layer";
import {PointFeatureType} from "../../backend/types/geo/features/point/point-feature-type.enum";
import {Observable, ReplaySubject, Subject, Subscription} from "rxjs";
import {BreakdownStat} from "../../backend/types/stat/breakdown-stat.type";
import {PointFeature} from "../../backend/types/geo/features/point";
import {BreakdownStatResponse} from "../../backend/responses/stat";
import {LayerFeatureType} from "../../backend/types/geo/features/layer/layer-feature-type.enum";
import {MapSidebarMode} from "./map-sidebar-mode.enum";
import {StatService} from "../../backend/services";
import {GeoEvent} from "../../backend/types/geo";


@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrls: ['./map-sidebar.component.scss'],
})
export class MapSidebarComponent {

  @Input()
  set data(newValue: GeoEvent | null) {
    this._overallChartData.reset();
    this._genderChartData.reset();
    this._povertyChartData.reset();

    if (!!newValue) {
      this.reloadData();
      this.currentData.next(newValue);
    }
  }

  @Input()
  sidebarDataMode: MapSidebarMode = MapSidebarMode.SINGLE_ZIPCODE_BREAKDOWN;

  overallChartData: Observable<ChartData>;
  povertyChartData: Observable<ChartData>;
  genderChartData: Observable<ChartData>;

  didError = false;
  currentData: Subject<GeoEvent> = new Subject<GeoEvent>();
  populationData: Subject<BreakdownStatResponse | null> = new Subject<BreakdownStatResponse | null>();


  private _overallChartData = resettable(() => new ReplaySubject<ChartData>(1));
  private _povertyChartData = resettable(() => new ReplaySubject<ChartData>(1));
  private _genderChartData = resettable(() => new ReplaySubject<ChartData>(1));

  private populationSub?: Subscription;
  private titleCasePipe: TitleCasePipe = new TitleCasePipe();

  constructor(private statService: StatService) {
    this.overallChartData = this._overallChartData.observable;
    this.povertyChartData = this._povertyChartData.observable;
    this.genderChartData = this._genderChartData.observable;
  }


  getTitle(event: GeoEvent): string {
    if (Object.values(LayerFeatureType).includes(event.type as LayerFeatureType)) {
      return (event.data as LayerFeature).id;
    }

    return (event.data as PointFeature).displayName;
  }

  getDistrict(event: GeoEvent): DistrictFeature | undefined {
    if (event.type === LayerFeatureType.ZIP_CODE) {
      return (event.data as ZipcodeFeature).district;
    } else if (event.type === LayerFeatureType.TRACT) {
      return (event.data as TractFeature).district;
    }

    return undefined;
  }

  getSubtitle(data: GeoEvent) {
    if (Object.values(LayerFeatureType).includes(data.type as LayerFeatureType)) {
      switch ((data.type as LayerFeatureType)) {
        case LayerFeatureType.DISTRICT:
          return 'District';
        case LayerFeatureType.TRACT:
          return 'Census Tract';
        case LayerFeatureType.ZIP_CODE:
          return 'ZIP Code';
      }
    }

    return this.titleCasePipe.transform(data.type.toString().replace('_', ' '));
  }

  getPointFeatureData(event: GeoEvent): PointFeature {
    return (event.data as PointFeature);
  }

  getStat(response: BreakdownStatResponse): BreakdownStat | null {
    if (response.stats.length > 0) {
      return response.stats[0];
    }

    return null;
  }

  get isMulti(): boolean {
    return this.sidebarDataMode.toString().includes('multi');
  }

  get isFeaturePoint(): boolean {
    return this.sidebarDataMode === MapSidebarMode.FEATURE_POINT_SUMMARY;
  }

  private reloadData() {
    this.didError = false;
    this.populationData.next(null);

    if (!!this.populationSub) {
      this.populationSub.unsubscribe();
    }

    this.populationSub = this.currentData.pipe(
      switchMap(event => {
        switch (event.type) {
          case LayerFeatureType.ZIP_CODE:
            const zipcodeFeature: ZipcodeFeature = event.data as ZipcodeFeature;
            this.sidebarDataMode = MapSidebarMode.SINGLE_ZIPCODE_BREAKDOWN;

            return this.statService.getZipCodeBreakdown(zipcodeFeature.id);
          case LayerFeatureType.TRACT:
            const tractFeature: TractFeature = event.data as TractFeature;
            this.sidebarDataMode = MapSidebarMode.SINGLE_TRACT_BREAKDOWN;

            return this.statService.getTractBreakdown(tractFeature.id);
          case LayerFeatureType.DISTRICT:
          case PointFeatureType.PARK:
          case PointFeatureType.COMMUNITY_CENTER:
          default:
            const data: PointFeature = event.data as PointFeature;
            this.sidebarDataMode = MapSidebarMode.FEATURE_POINT_SUMMARY;

            return this.statService.getZipCodeBreakdown(data.zipCode);
        }
      }),
      tap(response => {
        const genderChartData = ChartDataHelper.getGenderChartData(response);

        if (!!genderChartData) {
          this._genderChartData.subject.next(genderChartData);
        } else {
          this.didError = true;
        }
      }),
      tap(response => {
        const povertyChartData = ChartDataHelper.getPovertyChartData(response);

        if (!!povertyChartData) {
          this._povertyChartData.subject.next(povertyChartData);
        } else {
          this.didError = true;
        }
      }),
      tap(response => {
        const overallChartData = ChartDataHelper.getOverallChartData(response);

        if (!!overallChartData) {
          this._overallChartData.subject.next(overallChartData);
        } else {
          this.didError = true;
        }
      }),
    ).subscribe(this.populationData);
  }
}
