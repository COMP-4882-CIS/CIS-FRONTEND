import {LayerFeatureType} from "../geo/features/layer/layer-feature-type.enum";
import {Geometry} from "geojson";

export interface Landmark {
  zipCode: string;
  displayName: string;
  type: LayerFeatureType;
  geometry: Geometry;
}
