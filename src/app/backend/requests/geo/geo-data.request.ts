import { Layer } from "leaflet";
import {LayerFeature} from "../../types/geo/features/layer";

export interface GeoDataRequest {
  layer: Layer;
  feature: LayerFeature;
}
