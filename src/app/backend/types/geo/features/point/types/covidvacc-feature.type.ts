import {PointFeature} from "../point-feature.type";
import {PointFeatureType} from "../point-feature-type.enum";

export class COVIDVACCFeature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  date: string;
  type: PointFeatureType = PointFeatureType.COVIDVACC;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['Covid-19 Vaccination, Number of Children < 18yrs with at least one dose, as of 11\/10\/2022'];
    this.streetAddress = rawJSON['Zip'];
    this.zipCode = rawJSON['Zip'];
    this.date = rawJSON['Covid-19 Vaccination, Percent of Children < 18yrs with at least one dose (%), as of 11\/10\/2022'];
  }

}