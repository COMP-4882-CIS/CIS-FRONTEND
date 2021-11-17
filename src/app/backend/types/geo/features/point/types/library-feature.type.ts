import {PointFeature} from "../point-feature.type";
import {PointFeatureType} from "../point-feature-type.enum";

export class LibraryFeature implements PointFeature {
  displayName: string;
  streetAddress: string;
  zipCode: string;
  phoneNumber: string;
  type: PointFeatureType = PointFeatureType.LIBRARY;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['user_name'];
    this.streetAddress = rawJSON['staddr'];
    this.zipCode = rawJSON['postal'];
    this.phoneNumber = rawJSON['user_phone'];
  }
}
