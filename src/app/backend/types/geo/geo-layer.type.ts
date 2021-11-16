import {Feature} from "geojson";

export interface GeoLayer {
  _path: {
    id: string;
  };

  feature: Feature;
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
