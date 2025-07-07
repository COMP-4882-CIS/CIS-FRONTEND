import {PointFeatureType} from "./point-feature-type.enum";

export interface PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  type: PointFeatureType;
}
