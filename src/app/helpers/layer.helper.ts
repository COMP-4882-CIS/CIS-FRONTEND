import {GeoJSON} from "leaflet";
import {DistrictFeature, TractFeature, ZipcodeFeature} from "../backend/types/geo/features/layer";
import {ChartDataHelper} from "./chart-data.helper";

export class LayerHelper {

  static stylizePopulationLayer(layer: GeoJSON, maxStats: { maxZip: number, maxTract: number }) {
    layer.setStyle(feature => {
      const style = {
        opacity: 1.0,
        fillOpacity: 1.0
      };


      if (!!feature && !!feature.properties) {
        let opacity = 0.1;

        const layerFeature: ZipcodeFeature | TractFeature = feature.properties;
        const population = layerFeature.populationUnder18;

        if (feature.properties instanceof TractFeature && population > 0) {
          opacity = Math.max(Math.min((population / maxStats.maxTract), 0.6), 0.2);
        } else if (feature.properties instanceof ZipcodeFeature && population > 0) {
          opacity = Math.max(Math.min((population / maxStats.maxZip), 0.6), 0.2);
        }

        style.fillOpacity = opacity;
      }

      return style;
    });
  }

  static stylizeDistrictLayer(layer: GeoJSON) {
    layer.setStyle(feature => {
      let color = 'rgb(255, 159, 64)';


      const colors = Object.values(ChartDataHelper.CHART_COLORS);

      if (!!feature && !!feature.properties) {
        const layerFeature: DistrictFeature = feature.properties;
        const districtNumber = Number(layerFeature.id);

        if (districtNumber < colors.length) {
          color = colors[districtNumber - 1];
        }

      }


      return {
        opacity: 1.0,
        fillOpacity: 0,
        color
      };
    });
  }
}
