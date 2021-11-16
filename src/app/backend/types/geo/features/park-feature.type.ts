import {PointFeature} from "./point-feature.type";

export class ParkFeature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['park_nam_1'];
    this.streetAddress = rawJSON['location'];
    this.zipCode = rawJSON['zipcode'];
  }

}
