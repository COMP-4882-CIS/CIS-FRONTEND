import {PointFeatureType} from "./features/point/point-feature-type.enum";
import {PointFeature} from "./features/point";
import {LayerFeatureType} from "./features/layer/layer-feature-type.enum";
import {LayerFeature} from "./features/layer";

export interface GeoEvent {
  type: PointFeatureType|LayerFeatureType;
  data: PointFeature|LayerFeature;
}
