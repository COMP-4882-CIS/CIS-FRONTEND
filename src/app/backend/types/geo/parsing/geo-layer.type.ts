import {Feature} from "geojson";
import {LatLngBounds} from "leaflet";

export interface GeoLayer {
  _path: {
    id: string;
  };

  feature: Feature;

  _bounds: LatLngBounds;

  options: {
    fill: boolean
    fillColor: string
    fillOpacity: number,
    fillRule: string
    noClip: false
    opacity: number,
    style: {
      color: string
    }
  }
}
