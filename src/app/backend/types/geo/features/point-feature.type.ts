import {PointFeatureType} from "./feature-type.enum";

export interface PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  type: PointFeatureType;
}
