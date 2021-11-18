import {GeoJSON, PathOptions} from "leaflet";
import {DistrictFeature, TractFeature, ZipcodeFeature} from "../backend/types/geo/features/layer";
import {LayerFeatureType} from "../backend/types/geo/features/layer/layer-feature-type.enum";
import {ColorsHelper} from "./colors.helper";

export class LayerHelper {

  static stylizePopulationLayer(layer: GeoJSON, maxStats: { maxZip: number, maxTract: number }) {
    layer.setStyle(feature => {
      const style: PathOptions = {
        opacity: 1.0,
        fillOpacity: 0.2
      };


      if (!!feature && !!feature.properties) {
        const layerFeature: ZipcodeFeature | TractFeature = feature.properties;
        const layerType: LayerFeatureType = (layerFeature instanceof  TractFeature ? LayerFeatureType.TRACT : LayerFeatureType.ZIP_CODE);
        const population = layerFeature.populationUnder18;


        if (layerType === LayerFeatureType.TRACT && population > 0) {
          style.fillOpacity = Math.max(Math.min((population / maxStats.maxTract), 0.6), 0.4);
        } else if (layerType === LayerFeatureType.ZIP_CODE && population > 0) {
          style.fillOpacity = Math.max(Math.min((population / maxStats.maxZip), 0.6), 0.4);
        }

        style.color = ColorsHelper.getLayerColor(layerType);
      }

      return style;
    });
  }

  static stylizeDistrictLayer(layer: GeoJSON) {
    layer.setStyle(feature => {

      const style: PathOptions = {
        opacity: 1.0,
        fillOpacity: 0,
        interactive: false,
        weight: 8.0
      };


      if (!!feature && !!feature.properties) {
        const layerFeature: DistrictFeature = feature.properties;
        const districtNumber = Number(layerFeature.id);

        style.color = ColorsHelper.getLayerColor(LayerFeatureType.DISTRICT, districtNumber);
      }


      return style;
    });
  }
}
