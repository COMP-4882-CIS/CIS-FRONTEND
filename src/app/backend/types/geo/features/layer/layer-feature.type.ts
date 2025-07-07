import {LayerFeatureType} from "./layer-feature-type.enum";

export interface LayerFeature {
  id: string;
  type: LayerFeatureType;
  properties: {[key: string]: any};
}
