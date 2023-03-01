import {PointFeature} from "../point-feature.type";
import {PointFeatureType} from "../point-feature-type.enum";

export class LEAD5Feature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  age: string;
  lead: string;
  type: PointFeatureType = PointFeatureType.LEAD5;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['zip_code'];
    this.streetAddress = rawJSON['zip_code'];
    this.zipCode = rawJSON['zip_code'];
    this.age = rawJSON['age']
    this.lead=rawJSON['lead']

  }
}