import {Component, Input, OnInit} from '@angular/core';
import {SchoolSummaryResponse} from "../../backend/responses/landmark/school-summary.response";
import {PointFeature, SchoolFeature} from "../../backend/types/geo/features/point";

@Component({
  selector: 'app-school-feature-summary',
  templateUrl: './school-feature-summary.component.html',
  styleUrls: ['./school-feature-summary.component.scss']
})
export class SchoolFeatureSummaryComponent implements OnInit {

  @Input()
  schoolSummary?: SchoolSummaryResponse;

  @Input()
  set schoolFeature(newValue: PointFeature) {
    if (!!newValue && newValue instanceof SchoolFeature) {
      this._schoolFeature = newValue;
    }
  }


  private _schoolFeature?: SchoolFeature;

  constructor() { }

  ngOnInit(): void {
  }

  get schoolFeatureData(): SchoolFeature | null {
    if (!!this._schoolFeature) {
      return  this._schoolFeature;
    }

    return null;
  }

  get gradeRange(): string | null {
    if (!!this.schoolSummary) {
      const gradesTaught = this.schoolSummary.gradesTaught;

      return `${SchoolFeatureSummaryComponent.stripGrade(gradesTaught.first())} - ${SchoolFeatureSummaryComponent.stripGrade(gradesTaught.last())}`;
    }

    return null;
  }

  private static stripGrade(grade: string): string {
    return grade.replace(' Grade', '');
  }
}
