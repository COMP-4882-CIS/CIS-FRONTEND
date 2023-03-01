import {Component, Input} from '@angular/core';
import {
  CommunityCenterFeature,
  LibraryFeature,
  CCCFeature,
  CCFFeature,
  PointFeature,
  SchoolFeature,
  CAFeature,
  CBRFeature,
  CDFeature,
  COFeature,
  CTFeature,
  CWFeature,
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
    return (this.pointFeature instanceof LibraryFeature || this.pointFeature instanceof CommunityCenterFeature || this.pointFeature instanceof CCCFeature) &&
      !!(this.pointFeature as LibraryFeature).phoneNumber;
  }

  get hasWebsiteURL(): boolean {
    return this.pointFeature instanceof CommunityCenterFeature &&
      !!(this.pointFeature as CommunityCenterFeature).websiteURL;
  }

  get hasMinAge(): boolean {
    return this.pointFeature instanceof CCCFeature || this.pointFeature instanceof CCFFeature &&
      !!(this.pointFeature as CCCFeature).minAge;
  }

  get hasMaxAge(): boolean {
    return this.pointFeature instanceof CCCFeature || this.pointFeature instanceof CCFFeature &&
      !!(this.pointFeature as CCCFeature).maxAge;
  }

  get hasCapacity(): boolean {
    return this.pointFeature instanceof CCCFeature || this.pointFeature instanceof CCFFeature &&
      !!(this.pointFeature as CCCFeature).capacity;
  }

  get hasRegStatus(): boolean {
    return this.pointFeature instanceof CCCFeature || this.pointFeature instanceof CCFFeature &&
      !!(this.pointFeature as CCCFeature).regStatus;
  }

  get hasRegAgency(): boolean {
    return this.pointFeature instanceof CCCFeature || this.pointFeature instanceof CCFFeature &&
      !!(this.pointFeature as CCCFeature).regAgency;
  }

  get hasDate(): boolean {
    return this.pointFeature instanceof CAFeature || this.pointFeature instanceof CBRFeature || 
    this.pointFeature instanceof CDFeature || this.pointFeature instanceof COFeature || 
    this.pointFeature instanceof CTFeature || this.pointFeature instanceof CWFeature && 
    !!(this.pointFeature as CAFeature).date;
  }

  

  getValue(key: string): any {
    return (this.pointFeature as {[key: string]: any})[key];
  }
}
