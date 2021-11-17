import {LayerFeatureType} from "../backend/types/geo/features/layer/layer-feature-type.enum";
import {Layer} from "leaflet";
import {LayerFeature} from "../backend/types/geo/features/layer";
import {GeoLayer} from "../backend/types/geo";
import {PointFeatureType} from "../backend/types/geo/features/point/point-feature-type.enum";
import {PointFeature} from "../backend/types/geo/features/point";

export class PopupHelper {
  static bindLayerPopup(type: LayerFeatureType, rawLayer: Layer): string {
    const layer: GeoLayer = rawLayer as unknown as GeoLayer;
    const feature: LayerFeature = layer.feature.properties as LayerFeature;

    switch (type) {
      case LayerFeatureType.ZIP_CODE:
        return  `ZIP Code ${feature.id}`;
      case LayerFeatureType.TRACT:
        return `Tract ${feature.id}`;
      case LayerFeatureType.DISTRICT:
        return `District ${feature.id}`;
    }
  }

  static bindPointPopup(type: PointFeatureType, rawLayer: Layer): string {
    const layer: GeoLayer = rawLayer as unknown as GeoLayer;
    const feature: PointFeature = layer.feature.properties as PointFeature;

    return feature.displayName;
  }
}
