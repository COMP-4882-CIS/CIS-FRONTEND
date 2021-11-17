import {PointFeature} from "./point-feature.type";
import {PointFeatureType} from "./feature-type.enum";

export class ParkFeature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  type: PointFeatureType = PointFeatureType.PARK;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['park_nam_1'];
    this.streetAddress = rawJSON['location'];
    this.zipCode = rawJSON['zipcode'];
  }

}
