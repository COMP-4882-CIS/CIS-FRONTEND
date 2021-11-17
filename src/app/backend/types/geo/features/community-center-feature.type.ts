import {PointFeature} from "./point-feature.type";
import {PointFeatureType} from "./feature-type.enum";

export class CommunityCenterFeature implements PointFeature {
  displayName: string;
  websiteURL: string;
  zipCode: string;
  streetAddress: string;
  phoneNumber: string;
  type: PointFeatureType = PointFeatureType.COMMUNITY_CENTER;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['community_'];
    this.streetAddress = rawJSON['street'];
    this.zipCode = rawJSON['zip'];
    this.phoneNumber = rawJSON['phone'];
    this.websiteURL = rawJSON['website'];
  }
}
