import {LayerFeatureType} from "../backend/types/geo/features/layer/layer-feature-type.enum";
import {Layer} from "leaflet";
import {LayerFeature} from "../backend/types/geo/features/layer";
import {GeoLayer} from "../backend/types/geo";

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
}
