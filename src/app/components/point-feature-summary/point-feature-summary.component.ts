import {Component, Input} from '@angular/core';
import {PointFeature} from "../../backend/types/geo/features/point/point-feature.type";
import {LibraryFeature} from "../../backend/types/geo/features/point/types/library-feature.type";
import {CommunityCenterFeature} from "../../backend/types/geo/features/point/types/community-center-feature.type";
import {SchoolFeature} from "../../backend/types/geo/features/point";

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

  getSchoolFeature(): SchoolFeature {
    return this.pointFeature as SchoolFeature;
  }

  getValue(key: string): any {
    return (this.pointFeature as {[key: string]: any})[key];
  }
}
