import {LayerFeature} from "../layer-feature.type";
import {LayerFeatureType} from "../layer-feature-type.enum";

export class DistrictFeature implements LayerFeature {
  id: string;
  properties: { [key: string]: any };
  type: LayerFeatureType = LayerFeatureType.TRACT;
  representative: string;
  websiteURL?: string;

  constructor(rawData: { [key: string]: any }) {
    this.id = rawData['unit'];
    this.representative = rawData['districtme'];

    delete rawData['unit'];
    delete rawData['districtme'];

    this.properties = rawData;

    if (Number(this.id) < 9 ) {
      this.websiteURL = `https://www.memphistn.gov/city-council/district-${this.id}/`;
    }
  }
}
