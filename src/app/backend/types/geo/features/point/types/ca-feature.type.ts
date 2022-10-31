import {PointFeature} from "../point-feature.type";
import {PointFeatureType} from "../point-feature-type.enum";

export class CAFeature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  date: string;
  type: PointFeatureType = PointFeatureType.CA;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['Category'];
    this.streetAddress = rawJSON['Block Address'];
    this.zipCode = rawJSON['zipcode'];
    this.date = rawJSON['Offense Date'];
  }

}
