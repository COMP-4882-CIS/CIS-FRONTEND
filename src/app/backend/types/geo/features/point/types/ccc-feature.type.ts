import {PointFeature} from "../point-feature.type";
import {PointFeatureType} from "../point-feature-type.enum";

export class CCCFeature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  phoneNumber: string;
  minAge: string;
  maxAge: string;
  capacity: string;
  regAgency: string;
  regStatus: string;
  type: PointFeatureType = PointFeatureType.CCC;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['Agency'];
    this.streetAddress = rawJSON['Address'];
    this.zipCode = rawJSON['Zip'];
    this.phoneNumber=rawJSON['Phone'];
    this.minAge=rawJSON['MinAge'];
    this.maxAge=rawJSON['MaxAge'];
    this.capacity=rawJSON['Capacity'];
    this.regAgency=rawJSON['RegAgency'];
    this.regStatus=rawJSON['RegStatus'];
  }

}
