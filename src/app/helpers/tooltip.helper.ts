import {Layer} from "leaflet";
import {GeoLayer} from "../backend/types/geo";
import {PointFeature} from "../backend/types/geo/features/point";

export class TooltipHelper {

  static bindPointTooltip(rawLayer: Layer): string {
    const layer: GeoLayer = rawLayer as unknown as GeoLayer;
    const feature: PointFeature = layer.feature.properties as PointFeature;

    return feature.displayName;
  }

  static handleTooltipOpen(tooltipElement: HTMLImageElement) {
    if (!tooltipElement.classList.contains('marker-icon')) {
      tooltipElement.classList.add('marker-icon', 'normal');
    }

    tooltipElement.classList.replace('normal', 'focused');
  }

  static handleTooltipClose(tooltipElement: HTMLImageElement) {
    if (tooltipElement.classList.contains('marker-icon')) {
      tooltipElement.classList.replace('focused', 'normal');
    }
  }
}
