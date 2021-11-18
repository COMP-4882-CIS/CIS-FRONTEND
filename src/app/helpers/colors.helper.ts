import {LayerFeatureType} from "../backend/types/geo/features/layer/layer-feature-type.enum";

export class ColorsHelper {
  static chartColors = {
    red: 'rgb(255, 99, 132)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
  };

  static mapColors = {
    tract: '#53B3CB',
    zipCode: '#2FDD92',
    districts: [
      '#0075F2',
      '#f9c80eff',
      '#f86624ff',
      '#ea3546ff',
      '#662e9bff',
      '#43bccdff',
      '#FFD2FC',
      '#E01A4F'
    ]
  };

  static featureMarkerColors = {
    library: '#0075F2',
    park: '#09E85E',
    center: '#7F7EFF'
  }


  static getLayerColor(featureType: LayerFeatureType, district: number = 0): string {
    switch (featureType) {
      case LayerFeatureType.ZIP_CODE:
        return this.mapColors.zipCode;
      case LayerFeatureType.TRACT:
        return this.mapColors.tract;
      case LayerFeatureType.DISTRICT:
        return this.mapColors.districts[district];
    }
  }

}
