import {PointFeature} from "../point-feature.type";
import {PointFeatureType} from "../point-feature-type.enum";

export class SearchFeature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  CovidCC: string;
  type: PointFeatureType = PointFeatureType.SEARCH;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['name'];
    this.streetAddress = rawJSON['address'];
    this.zipCode = rawJSON['zipcode'];
    this.CovidCC = rawJSON['CovidCC'];
  }

}
