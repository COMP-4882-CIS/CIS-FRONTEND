import {Component, Input} from '@angular/core';
import {BreakdownStat, TractBreakdownStat, ZipCodeBreakdownStat} from "../../backend/types/stat/breakdown-stat.type";
import {DistrictFeature} from "../../backend/types/geo/features/layer";
import {LandmarkSummaryResponse} from "../../backend/responses/landmark/landmark-summary.response";
import {ExportService} from "../../backend/services/export.service";

@Component({
  selector: 'app-breakdown-summary',
  templateUrl: './breakdown-summary.component.html',
  styleUrls: ['./breakdown-summary.component.scss']
})
export class BreakdownSummaryComponent {

  @Input()
  set populationStats(newValue: BreakdownStat | null) {
    if (!!newValue) {
      this._populationStats = newValue;
      this.processStats();
    }
  }

  @Input()
  set landmarksSummary(newValue: LandmarkSummaryResponse | undefined) {
    if (!!newValue) {
      this._landmarksSummary = newValue;
      this.processLandmarks();
    }
  }

  @Input()
  title!: string;

  @Input()
  district?: DistrictFeature;


  totalParks: number = 0;
  totalLibraries: number = 0;
  totalCommunityCenters: number = 0;
  totalChildCare: number = 0;

  ageUnder5: number = 0;
  age5To9: number = 0;
  age10To14: number = 0;
  age15To19: number = 0;
  totalPopulation: number = 0;

  showLandmarksSummary = false;

  private _populationStats!: BreakdownStat;
  private _landmarksSummary?: LandmarkSummaryResponse;

  constructor(private exportService: ExportService) {
  }

  exportData(){
    if((this._populationStats as TractBreakdownStat).censusTract){
      this.exportTractBreakdown();
    } else{
      this.exportZIPBreakdown();
    }
  }

  exportTractBreakdown() {
    this.exportService.exportTractData(this._populationStats as TractBreakdownStat, this._landmarksSummary as LandmarkSummaryResponse, this.district?.id as string);

  }

  exportZIPBreakdown(){
    if(!!this._populationStats && this._landmarksSummary){
      this.exportService.exportZIPData(this._populationStats as ZipCodeBreakdownStat, this._landmarksSummary);
    }
    
  }

  private processStats() {
    const stat = this._populationStats;

    if (!!stat) {
      this.ageUnder5 = stat.ageUnder5;
      this.age5To9 = stat.age5To9;
      this.age10To14 = stat.age10To14;
      this.age15To19 = stat.age15To19;
      this.totalPopulation = stat.totalPopulation;
    }
  }

  private processLandmarks() {
    const landmarksSummary = this._landmarksSummary;

    if (!!landmarksSummary) {
      this.showLandmarksSummary = true;

      this.totalParks = landmarksSummary.totalParks;
      this.totalLibraries = landmarksSummary.totalLibraries;
      this.totalCommunityCenters = landmarksSummary.totalCommunityCenters;
      this.totalChildCare = landmarksSummary.totalChildCare;
    } else {
      this.showLandmarksSummary = false;
    }
  }

  get hasDistrictWebsiteURL(): boolean {
    return !!this.district && !!this.district.websiteURL;
  }
}
