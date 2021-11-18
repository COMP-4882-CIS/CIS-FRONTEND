import {Component, Input} from '@angular/core';
import {TitleCasePipe} from "@angular/common";
import {DistrictFeature, TractFeature, ZipcodeFeature} from "../../backend/types/geo/features/layer";
import {Subject} from "rxjs";
import {PointFeature} from "../../backend/types/geo/features/point";
import {MapSidebarMode} from "./map-sidebar-mode.enum";
import {MapSidebarData} from "./map-sidebar-data.type";


@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrls: ['./map-sidebar.component.scss'],
})
export class MapSidebarComponent {

  @Input()
  didError = false;

  @Input()
  sidebarDataMode: MapSidebarMode = MapSidebarMode.SINGLE_ZIPCODE_BREAKDOWN;

  @Input()
  set data(newValue: MapSidebarData | null | undefined) {
    if (!!newValue) {
      this.currentData.next(newValue);
    }
  }

  currentData: Subject<MapSidebarData> = new Subject<MapSidebarData>();

  private titleCasePipe: TitleCasePipe = new TitleCasePipe();

  constructor() {
  }


  getTitle(data: MapSidebarData): string {
    switch (this.sidebarDataMode) {
      case MapSidebarMode.FEATURE_POINT_SUMMARY:
        return data.pointFeatureData!.displayName;
      case MapSidebarMode.SINGLE_ZIPCODE_BREAKDOWN:
      case MapSidebarMode.SINGLE_TRACT_BREAKDOWN:
        return data.layerFeatureData!.id;
      default:
        return data.title || 'No title';
    }
  }

  getDistrict(data: MapSidebarData): DistrictFeature | undefined {
    switch (this.sidebarDataMode) {
      case MapSidebarMode.SINGLE_TRACT_BREAKDOWN:
        return (data.layerFeatureData! as TractFeature).district;
      case MapSidebarMode.SINGLE_ZIPCODE_BREAKDOWN:
        return (data.layerFeatureData! as ZipcodeFeature).district;
      default:
        return undefined;
    }
  }

  getSubtitle(data: MapSidebarData) {
    switch (this.sidebarDataMode) {
      case MapSidebarMode.SINGLE_ZIPCODE_BREAKDOWN:
        return 'ZIP Code';
      case MapSidebarMode.SINGLE_TRACT_BREAKDOWN:
        return 'Census Tract';
      case MapSidebarMode.MULTI_TRACT_BREAKDOWN:
        return 'Census Tracts';
      case MapSidebarMode.MULTI_ZIPCODE_BREAKDOWN:
        return 'ZIP Codes';
      case MapSidebarMode.FEATURE_POINT_SUMMARY:
        const pointFeatureType = data.pointFeatureData!.type.toString();
        return this.titleCasePipe.transform(pointFeatureType.replace('_', ' '));
    }

    return '';
  }

  getPointFeatureData(data: MapSidebarData): PointFeature {
    return (data.pointFeatureData as PointFeature);
  }

  get isMulti(): boolean {
    return this.sidebarDataMode.toString().includes('multi');
  }

  get isFeaturePoint(): boolean {
    return this.sidebarDataMode === MapSidebarMode.FEATURE_POINT_SUMMARY;
  }

  showGenderChart(data: MapSidebarData) {
    if (!!data.genderChartData) {
      return data.stat.populationUnder18 > 0
    }

    return false;
  }

  showPovertyChart(data: MapSidebarData) {
    return (
      data.stat.populationInPovertyUnder6 > 0 ||
      data.stat.populationInPoverty6To11 > 0 ||
      data.stat.populationInPoverty12To17 > 0
    )
  }

}
