import {PointFeature} from "../point-feature.type";
import {PointFeatureType} from "../point-feature-type.enum";

export class COVIDCASEFeature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  date: string;
  type: PointFeatureType = PointFeatureType.COVIDCASE;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['Covid-19, < 18yrs , Cumulative Case Count, 2020-2022'];
    this.streetAddress = rawJSON['Zip'];
    this.zipCode = rawJSON['Zip'];
    this.date = rawJSON['Covid-19, < 18yrs, Cumulative Case Rate per 100 persons, 2020-2022'];
  }

}