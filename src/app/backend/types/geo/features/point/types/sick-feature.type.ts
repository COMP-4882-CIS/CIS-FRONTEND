import {PointFeature} from "../point-feature.type";
import {PointFeatureType} from "../point-feature-type.enum";

export class SickFeature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  CovidCC: string;
  type: PointFeatureType = PointFeatureType.SICK;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['zip_code'];
    this.streetAddress = rawJSON['zip_code'];
    this.zipCode = rawJSON['zip_code'];
    this.CovidCC = rawJSON['CovidCC']
  }

}