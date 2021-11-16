import {PointFeature} from "./point-feature.type";

export class LibraryFeature implements PointFeature {
  displayName: string;
  streetAddress: string;
  zipCode: string;
  phoneNumber: string;

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
