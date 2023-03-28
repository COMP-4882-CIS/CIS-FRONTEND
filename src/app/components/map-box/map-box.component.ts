import {Component, ViewChild} from '@angular/core';
import {GeoEvent} from "../../backend/types/geo";
import {Observable, of, ReplaySubject, Subject, Subscription} from "rxjs";
import {catchError, map, switchMap} from "rxjs/operators";
import {LayerFeature, TractFeature, ZipcodeFeature} from "../../backend/types/geo/features/layer";
import {LayerFeatureType} from "../../backend/types/geo/features/layer/layer-feature-type.enum";
import {MapSidebarMode} from "../map-sidebar/map-sidebar-mode.enum";
import {PointFeatureType} from "../../backend/types/geo/features/point/point-feature-type.enum";
import {PointFeature, SchoolFeature} from "../../backend/types/geo/features/point";
import {ChartDataHelper} from "../../helpers";
import {LandmarkService, StatService} from "../../backend/services";
import {BreakdownStatResponse} from "../../backend/responses/stat";
import {MapSidebarData} from "../map-sidebar/map-sidebar-data.type";
import {resettable} from "../../lib/resettable.rxjs";
import {MapSidebarComponent} from "../map-sidebar/map-sidebar.component";
import {SchoolSummaryResponse} from "../../backend/responses/landmark/school-summary.response";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent {

  @ViewChild(MapSidebarComponent) mapSidebar!: MapSidebarComponent;

  appTitle: string;
  appVersion: string;
  helpURL: string;

  drawerOpen: boolean = false;
  didErrorFetching: boolean = false;

  currentData: Observable<MapSidebarData>;
  fetchedStat: Subject<BreakdownStatResponse | null> = new Subject<BreakdownStatResponse | null>();

  private _currentData = resettable(() => new ReplaySubject<MapSidebarData>(1));
  private statSubscription?: Subscription;

  constructor(private statService: StatService, private landmarkService: LandmarkService) {
    this.currentData = this._currentData.observable;
    this.appTitle = environment.appTitle;
    this.appVersion = environment.appVersion;
    this.helpURL = environment.helpURL;
  }

  popupOpened(event: GeoEvent | null) {
    if (!!event) {
      this.drawerOpen = true;
      this.mapSidebar.data = null;
      this._currentData.reset();

      if (!!this.mapSidebar) {
        this.mapSidebar.data = null;
      }

      this.eventUpdated(event);
    } else {
      this.drawerOpen = false;
    }
  }

  private getBreakdown(event: GeoEvent): Observable<BreakdownStatResponse> {
    switch (event.type) {
      case LayerFeatureType.ZIP_CODE:
        const zipcodeFeature: ZipcodeFeature = event.data as ZipcodeFeature;

        return this.statService.getZipCodeBreakdown(zipcodeFeature.id);
      case LayerFeatureType.TRACT:
        const tractFeature: TractFeature = event.data as TractFeature;

        return this.statService.getTractBreakdown(tractFeature.id);
      case LayerFeatureType.DISTRICT:
      case PointFeatureType.PARK:
      case PointFeatureType.COMMUNITY_CENTER:
      case PointFeatureType.CCC:
      case PointFeatureType.CCF:
      case PointFeatureType.CA:
      case PointFeatureType.CBR:
      case PointFeatureType.CD:
      case PointFeatureType.CT:
      case PointFeatureType.CO:
      case PointFeatureType.CW:
      case PointFeatureType.LEAD0:
      case PointFeatureType.LEAD1:
      case PointFeatureType.LEAD2:
      case PointFeatureType.LEAD3:
      case PointFeatureType.LEAD4:
      case PointFeatureType.LEAD5:
      case PointFeatureType.LEAD6:
        
      default:
        const data: PointFeature = event.data as PointFeature;

        return this.statService.getZipCodeBreakdown(data.zipCode);
    }
  }

  private getSchoolSummaryData(event: GeoEvent) {
    const schoolID = (event.data as SchoolFeature).schoolID;

    return this.landmarkService.getSchoolSummary(schoolID);
  }

  private getGenderChartData(response: BreakdownStatResponse) {
    const genderChartData = ChartDataHelper.getAgeChartData(response);

    if (!!genderChartData) {
      return genderChartData;
    }
    this.didErrorFetching = true;
    return null;
  }

  private getPovertyChartData(response: BreakdownStatResponse) {
    const povertyChartData = ChartDataHelper.getPovertyChartData(response);

    if (!!povertyChartData) {
      return povertyChartData;
    }
    this.didErrorFetching = true;

    return null;
  }

  private getSchoolGradeChartData(response: SchoolSummaryResponse) {
    const gradeChartData = ChartDataHelper.getSchoolGradeChartData(response);

    if (!!gradeChartData) {
      return gradeChartData;
    }

    this.didErrorFetching = true;

    return null;
  }

  private getSchoolGenderChartData(response: SchoolSummaryResponse) {
    const genderChartData = ChartDataHelper.getSchoolGenderChartData(response);

    if (!!genderChartData) {
      return genderChartData;
    }

    this.didErrorFetching = true;

    return null;
  }

  private getOverallChartData(response: BreakdownStatResponse) {
    const overallChartData = ChartDataHelper.getAgeChartData(response);

    if (!!overallChartData) {
      return overallChartData;
    }

    this.didErrorFetching = true;

    return null;
  }

  private getLandmarkData(event: GeoEvent) {
    return this.landmarkService.getLandmarksSummary((event.data as LayerFeature).id);
  }

  private getStat(response: BreakdownStatResponse) {
    if (!!response && !!response.stats && response.stats.length > 0) {
      return response.stats[0];
    }

    this.didErrorFetching = true;

    return null;
  }

  private handlePointFeature(event: GeoEvent) {
    let data: MapSidebarData;

    const eventType: PointFeatureType = event.type as PointFeatureType;

    return this.getBreakdown(event).pipe(
      switchMap(response => {
        const stat = this.getStat(response);
        const overallChartData = this.getOverallChartData(response);
        const pointFeatureData = event.data as PointFeature;

        if (!!stat && !!overallChartData) {
          data = {
            mode: MapSidebarMode.FEATURE_POINT_SUMMARY,
            overallChartData,
            stat,
            pointFeatureData
          };
        }

        if (eventType === PointFeatureType.SCHOOL) {
          return this.getSchoolSummaryData(event).pipe(
            catchError(() => of(null))
          )
        }

        return of(null);
      }),
      map(schoolSummaryData => {
        if (!!data && !!schoolSummaryData) {
          data.schoolSummaryData = schoolSummaryData;

          const schoolGradeChartData =  this.getSchoolGradeChartData(schoolSummaryData);
          const schoolGenderChartData =  this.getSchoolGenderChartData(schoolSummaryData);

          if (!!schoolGradeChartData) {
            data.schoolGradeChartData = schoolGradeChartData;
          }

          if (!!schoolGenderChartData) {
            data.schoolGenderChartData = schoolGenderChartData;
          }

          return data;
        }

        return data;
      })
    ).subscribe(data => {
      if (!!data) {
        this._currentData.subject.next(data);
      }
    });
  }

  private handleLayerFeature(event: GeoEvent) {
    let data: MapSidebarData;

    const eventType: LayerFeatureType = event.type as LayerFeatureType;
    const mode: MapSidebarMode = MapBoxComponent.sidebarModeFromLayerType(eventType);

    return this.getBreakdown(event).pipe(
      switchMap(response => {
        const stat = this.getStat(response);
        const povertyChartData = this.getPovertyChartData(response);
        const genderChartData = this.getGenderChartData(response);
        const layerFeatureData = event.data as LayerFeature;

        if (!!stat && !!povertyChartData && !!genderChartData) {
          data = {
            mode,
            povertyChartData,
            genderChartData,
            stat,
            layerFeatureData
          };

          return this.getLandmarkData(event);
        }

        return of(null);
      }),
      map(landmarkResponse => {
        if (!!data && !!landmarkResponse) {
          data.landmarks = landmarkResponse;

          return data;
        }

        return null;
      }),
    ).subscribe(data => {
      if (!!data) {
        this._currentData.subject.next(data);
      }
    });
  }

  private eventUpdated(event: GeoEvent | null) {
    this.didErrorFetching = false;
    this.fetchedStat.next(null);

    if (!!this.statSubscription) {
      this.statSubscription.unsubscribe();
    }

    if (!!event) {
      const isPointFeature = Object.values(PointFeatureType).includes(event.type as PointFeatureType);

      if (isPointFeature) {
        this.statSubscription = this.handlePointFeature(event);
      } else {
        this.statSubscription = this.handleLayerFeature(event);
      }
    }
  }

  private static sidebarModeFromLayerType(type: LayerFeatureType) {
    switch (type) {
      case LayerFeatureType.DISTRICT:
        return MapSidebarMode.FEATURE_POINT_SUMMARY;
      case LayerFeatureType.TRACT:
        return MapSidebarMode.SINGLE_TRACT_BREAKDOWN;
      case LayerFeatureType.ZIP_CODE:
        return MapSidebarMode.SINGLE_ZIPCODE_BREAKDOWN;
    }
  }
}
