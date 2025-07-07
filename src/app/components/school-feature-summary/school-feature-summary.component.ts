import {Component, Input} from '@angular/core';
import {SchoolSummaryResponse} from "../../backend/responses/landmark/school-summary.response";
import {PointFeature, SchoolFeature} from "../../backend/types/geo/features/point";
import {ExportService} from "../../backend/services/export.service";
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-school-feature-summary',
  templateUrl: './school-feature-summary.component.html',
  styleUrls: ['./school-feature-summary.component.scss']
})
export class SchoolFeatureSummaryComponent {

  @Input()
  schoolSummary?: SchoolSummaryResponse;

  @Input()
  set schoolFeature(newValue: PointFeature) {
    if (!!newValue && newValue instanceof SchoolFeature) {
      this._schoolFeature = newValue;
    }
  }


  private _schoolFeature?: SchoolFeature;

  constructor(private exportService: ExportService) { }

  exportSchoolData() {
    if (!!this._schoolFeature && !!this.schoolSummary) {
      this.exportService.exportSchoolData(this.schoolSummary, this._schoolFeature);
    }
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

  get femaleEnrollment(): number {
    if (!!this.schoolSummary) {
      return this.schoolSummary.genderEnrollmentBreakdown['Female'] as number;
    }

    return -1;
  }

  get maleEnrollment(): number {
    if (!!this.schoolSummary) {
      return this.schoolSummary.genderEnrollmentBreakdown['Male'] as number;
    }

    return -1;
  }

  private static stripGrade(grade: string): string {
    return grade.replace(' Grade', '');
  }

  get hasgrad_cohort(): boolean {
    return this.schoolSummary instanceof SchoolFeature || this.schoolSummary instanceof SchoolFeature &&
      !!(this.schoolSummary as SchoolFeature).grad_cohort;
  }
}
