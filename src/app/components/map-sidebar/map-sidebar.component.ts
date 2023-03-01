import {Component, Input,  ViewEncapsulation} from '@angular/core';
import {TitleCasePipe} from "@angular/common";
import {DistrictFeature, TractFeature, ZipcodeFeature} from "../../backend/types/geo/features/layer";
import {Subject} from "rxjs";
import {PointFeature} from "../../backend/types/geo/features/point";
import {MapSidebarMode} from "./map-sidebar-mode.enum";
import {MapSidebarData} from "./map-sidebar-data.type";
import {filter} from "rxjs/operators";
import {BreakdownStat} from "../../backend/types/stat/breakdown-stat.type";
import {PointFeatureType} from "../../backend/types/geo/features/point/point-feature-type.enum";
import {SchoolSummaryResponse} from "../../backend/responses/landmark/school-summary.response";
import {MatButtonToggleChange} from "@angular/material/button-toggle";
import {MapBoxComponent} from "../map-box/map-box.component";
import {ChartData} from "chart.js";

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
      this.currentData$.next(newValue);
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }

  schoolChartData: ChartData = {datasets: []};
  showSchoolGradeChart = true;
  isLoading = true;
  currentData$: Subject<MapSidebarData> = new Subject<MapSidebarData>();

  private titleCasePipe: TitleCasePipe = new TitleCasePipe();

  constructor(private mapBoxComponent: MapBoxComponent) {
    this.currentData$.pipe(
      filter(data => !!data)
    ).subscribe(data => {
      if (!!data && !!data.mode) {
        this.sidebarDataMode = data?.mode;
        this._updateSchoolChartMode('grade', data!);
      }
    });
  }

  close() {
    this.mapBoxComponent.popupOpened(null);
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

  selectedTab = 0;
  changeTab(tabIndex: number) {
    this.selectedTab = tabIndex;
  }

  // code below is for health data, very ugly but oh well...
  string1: string | undefined;

  get38002CC(data: MapSidebarData): string | undefined{
    if(data.layerFeatureData!.id == '38002'){
      return '2787';
    }
    else if (data.layerFeatureData!.id == '38053'){
      return '1184';
    }
    else if (data.layerFeatureData!.id == '38016'){
      return '2681';
    }
    else if (data.layerFeatureData!.id == '38017'){
      return '3173';
    }
    else if (data.layerFeatureData!.id == '38018' || data.layerFeatureData!.id == '38028'){
      return '2241';
    }
    else if (data.layerFeatureData!.id == '38103' || data.layerFeatureData!.id == '38104' || data.layerFeatureData!.id == '38105'){
      return '1250';
    }
    else if (data.layerFeatureData!.id == '38106' || data.layerFeatureData!.id == '38126'){
      return '1760';
    }
    else if (data.layerFeatureData!.id == '38107' || data.layerFeatureData!.id == '38108'){
      return '1855';
    }
    else if (data.layerFeatureData!.id == '38109'){
      return '2751';
    }
    else if (data.layerFeatureData!.id == '38111'){
      return '1909';
    }
    else if (data.layerFeatureData!.id == '38112' || data.layerFeatureData!.id == '38122'){
      return '2417';
    }
    else if (data.layerFeatureData!.id == '38114'){
      return '1333';
    }
    else if (data.layerFeatureData!.id == '38115'){
      return '2748';
    }
    else if (data.layerFeatureData!.id == '38116'){
      return '2614';
    }
    else if (data.layerFeatureData!.id == '38117'){
      return '1420';
    }
    else if (data.layerFeatureData!.id == '38118'){
      return '2914';
    }
    else if (data.layerFeatureData!.id == '38119'||data.layerFeatureData!.id == '38120'){
      return '2111';
    }
    else if (data.layerFeatureData!.id == '38125'){
      return '2898';
    }
    else if (data.layerFeatureData!.id == '38127'){
      return '2737';
    }
    else if (data.layerFeatureData!.id == '38128'){
      return '3076';
    }
    else if (data.layerFeatureData!.id == '38133'){
      return '1460';
    }
    else if (data.layerFeatureData!.id == '38134'){
      return '2215';
    }
    else if (data.layerFeatureData!.id == '38135'){
      return '1660';
    }
    else if (data.layerFeatureData!.id == '38138' || data.layerFeatureData!.id == '38139'){
      return '2569';
    }
    else if (data.layerFeatureData!.id == '38141'){
      return '1755';
    }
    else{
      return this.string1;
    }
  }

  get38002CCP(data: MapSidebarData): string | undefined{
    if(data.layerFeatureData!.id == '38002'){
      return '23.6%';
    }
    else if (data.layerFeatureData!.id == '38053'){
      return '20.6%';
    }
    else if (data.layerFeatureData!.id == '38016'){
      return '25.6%';
    }
    else if (data.layerFeatureData!.id == '38017'){
      return '21.9%';
    }
    else if (data.layerFeatureData!.id == '38018' || data.layerFeatureData!.id == '38028'){
      return '21.1%';
    }
    else if (data.layerFeatureData!.id == '38103' || data.layerFeatureData!.id == '38104' || data.layerFeatureData!.id == '38105'){
      return '28.3%';
    }
    else if (data.layerFeatureData!.id == '38106' || data.layerFeatureData!.id == '38126'){
      return '23.7%';
    }
    else if (data.layerFeatureData!.id == '38107' || data.layerFeatureData!.id == '38108'){
      return '22.1%';
    }
    else if (data.layerFeatureData!.id == '38109'){
      return '27.5%';
    }
    else if (data.layerFeatureData!.id == '38111'){
      return '21.9%';
    }
    else if (data.layerFeatureData!.id == '38112' || data.layerFeatureData!.id == '38122'){
      return '23.5%';
    }
    else if (data.layerFeatureData!.id == '38114'){
      return '25.2%';
    }
    else if (data.layerFeatureData!.id == '38115'){
      return '25.7%';
    }
    else if (data.layerFeatureData!.id == '38116'){
      return '23.3%';
    }
    else if (data.layerFeatureData!.id == '38117'){
      return '24.6%';
    }
    else if (data.layerFeatureData!.id == '38118'){
      return '20.6%';
    }
    else if (data.layerFeatureData!.id == '38119'||data.layerFeatureData!.id == '38120'){
      return '24.7%';
    }
    else if (data.layerFeatureData!.id == '38125'){
      return '30.4%';
    }
    else if (data.layerFeatureData!.id == '38127'){
      return '17.9%';
    }
    else if (data.layerFeatureData!.id == '38128'){
      return '22%';
    }
    else if (data.layerFeatureData!.id == '38133'){
      return '23.5%';
    }
    else if (data.layerFeatureData!.id == '38134'){
      return '20.1%';
    }
    else if (data.layerFeatureData!.id == '38135'){
      return '28.1%';
    }
    else if (data.layerFeatureData!.id == '38138' || data.layerFeatureData!.id == '38139'){
      return '25.6%';
    }
    else if (data.layerFeatureData!.id == '38141'){
      return '27%';
    }
    else{
      return this.string1;
    }
  }
  get38002CV(data: MapSidebarData): string | undefined{
    if(data.layerFeatureData!.id == '38002'){
      return '4188';
    }
    else if (data.layerFeatureData!.id == '38053'){
      return '1265';
    }
    else if (data.layerFeatureData!.id == '38016'){
      return '3569';
    }
    else if (data.layerFeatureData!.id == '38017'){
      return '6215';
    }
    else if (data.layerFeatureData!.id == '38018' || data.layerFeatureData!.id == '38028'){
      return '3181';
    }
    else if (data.layerFeatureData!.id == '38103' || data.layerFeatureData!.id == '38104' || data.layerFeatureData!.id == '38105'){
      return '2165';
    }
    else if (data.layerFeatureData!.id == '38106' || data.layerFeatureData!.id == '38126'){
      return '1272';
    }
    else if (data.layerFeatureData!.id == '38107' || data.layerFeatureData!.id == '38108'){
      return '2100';
    }
    else if (data.layerFeatureData!.id == '38109'){
      return '2201';
    }
    else if (data.layerFeatureData!.id == '38111'){
      return '2325';
    }
    else if (data.layerFeatureData!.id == '38112' || data.layerFeatureData!.id == '38122'){
      return '3174';
    }
    else if (data.layerFeatureData!.id == '38114'){
      return '1073';
    }
    else if (data.layerFeatureData!.id == '38115'){
      return '2347';
    }
    else if (data.layerFeatureData!.id == '38116'){
      return '2048';
    }
    else if (data.layerFeatureData!.id == '38117'){
      return '2474';
    }
    else if (data.layerFeatureData!.id == '38118'){
      return '2212';
    }
    else if (data.layerFeatureData!.id == '38119'||data.layerFeatureData!.id == '38120'){
      return '3354';
    }
    else if (data.layerFeatureData!.id == '38125'){
      return '3268';
    }
    else if (data.layerFeatureData!.id == '38127'){
      return '2310';
    }
    else if (data.layerFeatureData!.id == '38128'){
      return '3116';
    }
    else if (data.layerFeatureData!.id == '38133'){
      return '1889';
    }
    else if (data.layerFeatureData!.id == '38134'){
      return '2758';
    }
    else if (data.layerFeatureData!.id == '38135'){
      return '2477';
    }
    else if (data.layerFeatureData!.id == '38138' || data.layerFeatureData!.id == '38139'){
      return '4958';
    }
    else if (data.layerFeatureData!.id == '38141'){
      return '1695';
    }
    else{
      return this.string1;
    }
  }
  get38002CVP(data: MapSidebarData): string | undefined{
    if(data.layerFeatureData!.id == '38002'){
      return '35.5%';
    }
    else if (data.layerFeatureData!.id == '38053'){
      return '22.1%';
    }
    else if (data.layerFeatureData!.id == '38016'){
      return '34%';
    }
    else if (data.layerFeatureData!.id == '38017'){
      return '42.9%';
    }
    else if (data.layerFeatureData!.id == '38018' || data.layerFeatureData!.id == '38028'){
      return '29.9%';
    }
    else if (data.layerFeatureData!.id == '38103' || data.layerFeatureData!.id == '38104' || data.layerFeatureData!.id == '38105'){
      return '49%';
    }
    else if (data.layerFeatureData!.id == '38106' || data.layerFeatureData!.id == '38126'){
      return '17.1%';
    }
    else if (data.layerFeatureData!.id == '38107' || data.layerFeatureData!.id == '38108'){
      return '25%';
    }
    else if (data.layerFeatureData!.id == '38109'){
      return '22%';
    }
    else if (data.layerFeatureData!.id == '38111'){
      return '26.7%';
    }
    else if (data.layerFeatureData!.id == '38112' || data.layerFeatureData!.id == '38122'){
      return '30.8%';
    }
    else if (data.layerFeatureData!.id == '38114'){
      return '20.3%';
    }
    else if (data.layerFeatureData!.id == '38115'){
      return '22%';
    }
    else if (data.layerFeatureData!.id == '38116'){
      return '18.2%';
    }
    else if (data.layerFeatureData!.id == '38117'){
      return '42.9%';
    }
    else if (data.layerFeatureData!.id == '38118'){
      return '15.7%';
    }
    else if (data.layerFeatureData!.id == '38119'||data.layerFeatureData!.id == '38120'){
      return '39.3%';
    }
    else if (data.layerFeatureData!.id == '38125'){
      return '34.3%';
    }
    else if (data.layerFeatureData!.id == '38127'){
      return '15.1%';
    }
    else if (data.layerFeatureData!.id == '38128'){
      return '22.3%';
    }
    else if (data.layerFeatureData!.id == '38133'){
      return '30.4%';
    }
    else if (data.layerFeatureData!.id == '38134'){
      return '25%';
    }
    else if (data.layerFeatureData!.id == '38135'){
      return '42%';
    }
    else if (data.layerFeatureData!.id == '38138' || data.layerFeatureData!.id == '38139'){
      return '49.3%';
    }
    else if (data.layerFeatureData!.id == '38141'){
      return '26.1%';
    }
    else{
      return this.string1;
    }
  }
  getAvgPb(data: MapSidebarData): string | undefined{
    if(data.layerFeatureData!.id == '38002'){
      return 'NA';
    }
    else if (data.layerFeatureData!.id == '38053'){
      return '~10.1';
    }
    else if (data.layerFeatureData!.id == '38016'){
      return '~8.9';
    }
    else if (data.layerFeatureData!.id == '38017'){
      return '~9.0';
    }
    else if (data.layerFeatureData!.id == '38018'){
      return '~8.7';
    }
    else if (data.layerFeatureData!.id == '38028'){
      return '~12.7';
    }
    else if (data.layerFeatureData!.id == '38103'){
      return '~8.7';
    }
    else if (data.layerFeatureData!.id == '38104'){
      return '~11.1';
    }
    else if (data.layerFeatureData!.id == '38105'){
      return '~9.0';
    }
    else if (data.layerFeatureData!.id == '38106'){
      return '~8.4';
    }
    else if (data.layerFeatureData!.id == '38126'){
      return '~8.2';
    }
    else if (data.layerFeatureData!.id == '38107'){
      return '~6.6';
    }
    else if (data.layerFeatureData!.id == '38108'){
      return '~8.3';
    }
    else if (data.layerFeatureData!.id == '38109'){
      return '~9.4';
    }
    else if (data.layerFeatureData!.id == '38111'){
      return '~8.0';
    }
    else if (data.layerFeatureData!.id == '38112'){
      return '~8.3';
    }
    else if (data.layerFeatureData!.id == '38122'){
      return '~8.9';
    }
    else if (data.layerFeatureData!.id == '38114'){
      return '~8.7';
    }
    else if (data.layerFeatureData!.id == '38115'){
      return '~8.5';
    }
    else if (data.layerFeatureData!.id == '38116'){
      return '~10.6';
    }
    else if (data.layerFeatureData!.id == '38117'){
      return '~8.6';
    }
    else if (data.layerFeatureData!.id == '38118'){
      return '~7.3';
    }
    else if (data.layerFeatureData!.id == '38119'){
      return '~8.4';
    }
    else if (data.layerFeatureData!.id == '38120'){
      return '~5.0';
    }
    else if (data.layerFeatureData!.id == '38125'){
      return '~6.7';
    }
    else if (data.layerFeatureData!.id == '38127'){
      return '~7.8';
    }
    else if (data.layerFeatureData!.id == '38128'){
      return '~9.6';
    }
    else if (data.layerFeatureData!.id == '38133'){
      return '~7.8';
    }
    else if (data.layerFeatureData!.id == '38134'){
      return '~6.8';
    }
    else if (data.layerFeatureData!.id == '38135'){
      return '~5.7';
    }
    else if (data.layerFeatureData!.id == '38138'){
      return '~8.7';
    }
    else if (data.layerFeatureData!.id == '38139'){
      return '~11.0';
    }
    else if (data.layerFeatureData!.id == '38141'){
      return '~20.0';
    }
    else{
      return this.string1;
    }
  }
  //end of health code

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

  getSchoolSummaryData(data: MapSidebarData): SchoolSummaryResponse {
    return (data.schoolSummaryData as SchoolSummaryResponse);
  }

  get isMulti(): boolean {
    return this.sidebarDataMode.toString().includes('multi');
  }

  get isFeaturePoint(): boolean {
    return this.sidebarDataMode === MapSidebarMode.FEATURE_POINT_SUMMARY;
  }

  isSchool(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.SCHOOL;
  }

  isCA(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.CA ;
  }

  isCBR(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.CBR ;
  }

  isCD(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.CD ;
  }

  isCO(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.CO ;
  }

  isCT(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.CT ;
  }

  isCW(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.CW ;
  }

  isCCC(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.CCC ;
  }

  isCCF(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.CCF ;
  }
  isLEAD0(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.LEAD0 ;
  }
  isLEAD1(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.LEAD1 ;
  }
  isLEAD2(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.LEAD2 ;
  }
  isLEAD3(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.LEAD3 ;
  }
  isLEAD4(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.LEAD4 ;
  }
  isLEAD5(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.LEAD5 ;
  }
  isLEAD6(data: MapSidebarData) {
    return data.pointFeatureData!.type === PointFeatureType.LEAD6 ;
  }

  showGenderChart(data: MapSidebarData) {
    if (!!data.genderChartData) {
      return data.stat.totalPopulation > 0
    }

    return false;
  }

  showSchoolChart(data: MapSidebarData) {
    return !!data.schoolSummaryData;
  }

  showPovertyChart(data: MapSidebarData) {
    return (
      data.stat.populationInPovertyUnder6 > 0 ||
      data.stat.populationInPoverty6To11 > 0 ||
      data.stat.populationInPoverty12To17 > 0
    )
  }

  showLeadChart(data: MapSidebarData) {
    return (
      data.stat.populationInPovertyUnder6 > 0 ||
      data.stat.populationInPoverty6To11 > 0 ||
      data.stat.populationInPoverty12To17 > 0
    )
  }

  getStat(data: MapSidebarData): BreakdownStat {
    return data.stat
  }

  updateSchoolChartMode(event: MatButtonToggleChange, data: MapSidebarData) {
    this._updateSchoolChartMode(event.value, data);
  }

  private _updateSchoolChartMode(mode: string, data: MapSidebarData) {
    this.schoolChartData = ((mode === 'grade') ? data.schoolGradeChartData : data.schoolGenderChartData) || {datasets: []};
  }
}
