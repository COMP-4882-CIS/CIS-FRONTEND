import {Component, Input} from '@angular/core';
import {
  PointFeature,
  COVIDVACCFeature,
  COVIDCASEFeature,
} from "../../backend/types/geo/features/point";

@Component({
  selector: 'app-covid-breakdown-summary',
  templateUrl: './covid-breakdown-summary.component.html',
  styleUrls: ['./covid-breakdown-summary.component.scss']
})
export class CovidBreakdownSummaryComponent {

  @Input()
  pointFeature!: PointFeature;

  @Input()
  typeTitle!: string;

  get hasCovid(): boolean {
    return this.pointFeature instanceof COVIDVACCFeature || this.pointFeature instanceof COVIDCASEFeature || 
    !!(this.pointFeature as COVIDVACCFeature).date;
  }

  getValue(key: string): any {
    return (this.pointFeature as {[key: string]: any})[key];
  }
}