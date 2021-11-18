import {Component, Input, OnInit} from '@angular/core';
import {GeoEvent} from "../../backend/types/geo/geo-event.type";
import {Observable, ReplaySubject, Subject, Subscription} from "rxjs";
import {BreakdownStatResponse} from "../../backend/responses/stat/breakdown-stat.response";
import {StatService} from "../../backend/services/stat.service";
import {switchMap, tap} from "rxjs/operators";
import {BreakdownStat} from "../../backend/types/stat/breakdown-stat.type";
import {ChartData} from "chart.js";
import {PointFeature} from "../../backend/types/geo/features/point-feature.type";
import {MapSidebarMode} from "./map-sidebar-mode.enum";
import {TitleCasePipe} from "@angular/common";
import {ChartDataHelper} from "../../helpers/chart-data.helper";
import {resettable} from "../../lib/resettable.rxjs";

@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrls: ['./map-sidebar.component.scss'],
})
export class MapSidebarComponent implements OnInit {

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

  ngOnInit(): void {
  }

  getSubtitle(data: GeoEvent) {
    if (['zip', 'tract'].includes(data.type)) {
      return data.type === 'zip' ? 'ZIP Code' : 'Census Tract';
    }

    return this.titleCasePipe.transform(data.type.toString().replace('_', ' '));
  }

  getFormattedStat(response: BreakdownStatResponse, key: string): any {
    const stat = this.getStat(response);

    if (!!stat) {
      return (stat as {[key: string]: any})[key];
    }

    return 0;
  }

  getPointFeatureData(event: GeoEvent): PointFeature {
    return (event.data as PointFeature);
  }

  getStat(response: BreakdownStatResponse): BreakdownStat|null {
    if (response.stats.length > 0) {
      return response.stats[0];
    }

    return null;
  }

  getPovertyTotal(response: BreakdownStatResponse): number | null {
    const stat = this.getStat(response);

    if (!!stat) {
      return stat.populationInPovertyUnder6 + stat.populationInPoverty6To11 + stat.populationInPoverty12To17;
    }

    return null;
  }


  getFeaturePointTitle(event: GeoEvent) {
    const data: PointFeature = event.data as PointFeature;

    return data.displayName;
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
      switchMap(ev => {
        if (['zip', 'tract'].includes(ev.type)) {
          const data: string = ev.data as string;

          if (ev.type === 'zip') {
            this.sidebarDataMode = MapSidebarMode.SINGLE_ZIPCODE_BREAKDOWN;
            return this.statService.getZipCodeBreakdown(data);
          }

          this.sidebarDataMode = MapSidebarMode.SINGLE_TRACT_BREAKDOWN;

          return this.statService.getTractBreakdown(data);
        }

        const data: PointFeature = ev.data as PointFeature;

        this.sidebarDataMode = MapSidebarMode.FEATURE_POINT_SUMMARY;

        return this.statService.getZipCodeBreakdown(data.zipCode);
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
