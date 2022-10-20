import {PointFeature} from "../point-feature.type";
import {PointFeatureType} from "../point-feature-type.enum";

export class CrimesFeature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  type: PointFeatureType = PointFeatureType.CRIMES;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['Category'];
    this.streetAddress = rawJSON['Block Address'];
    this.zipCode = rawJSON['zipcode'];
  }

}
