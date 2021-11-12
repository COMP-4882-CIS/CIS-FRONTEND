import { Layer } from "leaflet";

export interface GeoDataRequest {
  type: 'tract' | 'zip';
  layer: Layer;
  id: string
}
