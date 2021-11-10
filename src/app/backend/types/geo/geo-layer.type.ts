import {Feature} from "geojson";

export interface GeoLayer {
  _path: {
    id: string;
  };

  feature: Feature;
}
