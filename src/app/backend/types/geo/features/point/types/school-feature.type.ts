import {PointFeature} from "../point-feature.type";
import {PointFeatureType} from "../point-feature-type.enum";

export class SchoolFeature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  type: PointFeatureType = PointFeatureType.SCHOOL;
  properties: {[key: string]: any};
  principal: string;
  category: string;
  schoolID: number;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['name'];
    this.streetAddress = rawJSON['address'];
    this.zipCode = rawJSON['schoolzip'];
    this.principal = rawJSON['principal'];
    this.category = rawJSON['school_cat'];
    this.schoolID = Number(rawJSON['schl_id']) || -1;

    delete rawJSON['name'];
    delete rawJSON['address'];
    delete rawJSON['schoolzip'];
    delete rawJSON['principal'];
    delete rawJSON['category'];
    delete rawJSON['schl_id'];

    this.properties = rawJSON;
  }

}
