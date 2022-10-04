import {Component, Input} from '@angular/core';
import {
  CommunityCenterFeature,
  LibraryFeature,
  ChildCareFeature,
  PointFeature,
  SchoolFeature
} from "../../backend/types/geo/features/point";

@Component({
  selector: 'app-point-feature-summary',
  templateUrl: './point-feature-summary.component.html',
  styleUrls: ['./point-feature-summary.component.scss']
})
export class PointFeatureSummaryComponent {

  @Input()
  pointFeature!: PointFeature;

  @Input()
  typeTitle!: string;

  get hasTelephoneNumber(): boolean {
    return (this.pointFeature instanceof LibraryFeature || this.pointFeature instanceof CommunityCenterFeature || this.pointFeature instanceof ChildCareFeature) &&
      !!(this.pointFeature as LibraryFeature).phoneNumber;
  }

  get hasWebsiteURL(): boolean {
    return this.pointFeature instanceof CommunityCenterFeature &&
      !!(this.pointFeature as CommunityCenterFeature).websiteURL;
  }

  get hasMinAge(): boolean {
    return this.pointFeature instanceof ChildCareFeature &&
      !!(this.pointFeature as ChildCareFeature).minAge;
  }

  get hasMaxAge(): boolean {
    return this.pointFeature instanceof ChildCareFeature &&
      !!(this.pointFeature as ChildCareFeature).maxAge;
  }

  get hasCapacity(): boolean {
    return this.pointFeature instanceof ChildCareFeature &&
      !!(this.pointFeature as ChildCareFeature).capacity;
  }

  get hasRegStatus(): boolean {
    return this.pointFeature instanceof ChildCareFeature &&
      !!(this.pointFeature as ChildCareFeature).regStatus;
  }

  get hasRegAgency(): boolean {
    return this.pointFeature instanceof ChildCareFeature &&
      !!(this.pointFeature as ChildCareFeature).regAgency;
  }

  getValue(key: string): any {
    return (this.pointFeature as {[key: string]: any})[key];
  }
}
