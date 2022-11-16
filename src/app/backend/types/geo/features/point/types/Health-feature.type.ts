import {PointFeature} from "../point-feature.type";
import {PointFeatureType} from "../point-feature-type.enum";

export class HealthFeature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  emergency: string;
  type: PointFeatureType = PointFeatureType.HC;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['hospital'];
    this.streetAddress = rawJSON['street_address'];
    this.zipCode = rawJSON['zip_code'];
    this.emergency = rawJSON['_24_hour_emergency_department'];
  }

}
