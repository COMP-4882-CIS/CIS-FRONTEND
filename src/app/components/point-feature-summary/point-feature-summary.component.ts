import {Component, Input} from '@angular/core';
import {
  CommunityCenterFeature,
  LibraryFeature,
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
    return (this.pointFeature instanceof LibraryFeature || this.pointFeature instanceof CommunityCenterFeature) &&
      !!(this.pointFeature as LibraryFeature).phoneNumber;
  }

  get hasWebsiteURL(): boolean {
    return this.pointFeature instanceof CommunityCenterFeature &&
      !!(this.pointFeature as CommunityCenterFeature).websiteURL;
  }

  getValue(key: string): any {
    return (this.pointFeature as {[key: string]: any})[key];
  }
}
