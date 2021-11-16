import {PointFeature} from "./point-feature.type";

export class CommunityCenterFeature implements PointFeature {
  displayName: string;
  websiteURL: string;
  zipCode: string;
  streetAddress: string;
  phoneNumber: string;

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
