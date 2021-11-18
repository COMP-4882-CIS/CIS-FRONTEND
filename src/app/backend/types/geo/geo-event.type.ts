import {PointFeatureType} from "./features/feature-type.enum";
import {PointFeature} from "./features/point-feature.type";

export interface GeoEvent {
  type: 'tract' | 'zip' | PointFeatureType;
  data: string | PointFeature;
}
