import {LayerFeatureType} from "../geo/features/layer/layer-feature-type.enum";

export interface Landmark {
  zipCode: string;
  displayName: string;
  type: LayerFeatureType;
  geometry: any;
}
