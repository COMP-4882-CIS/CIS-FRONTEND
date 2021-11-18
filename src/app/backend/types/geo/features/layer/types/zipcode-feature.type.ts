import {LayerFeature} from "../layer-feature.type";
import {LayerFeatureType} from "../layer-feature-type.enum";
import {BreakdownStat} from "../../../../stat/breakdown-stat.type";
import {DistrictFeature} from "./district-feature.type";
import {GeoLayer} from "../../../parsing";

export class ZipcodeFeature implements LayerFeature, BreakdownStat {
  id: string;
  properties: { [key: string]: any };
  type: LayerFeatureType = LayerFeatureType.ZIP_CODE;
  populationInPoverty12To17: number = 0;
  populationInPoverty6To11: number = 0;
  populationInPovertyUnder6: number = 0;
  populationUnder18Female: number = 0;
  populationUnder18Male: number = 0;
  populationUnder18: number = 0;
  totalPopulation: number = 0;
  district?: DistrictFeature;

  constructor(rawData: { [key: string]: any }) {
    this.id = rawData['name'];

    delete rawData['name'];

    this.properties = rawData;
  }

  update(stat: BreakdownStat) {
    this.totalPopulation = stat.totalPopulation;
    this.populationUnder18 = stat.populationUnder18;
    this.populationUnder18Male = stat.populationUnder18Male;
    this.populationUnder18Female = stat.populationUnder18Female;
    this.populationInPovertyUnder6 = stat.populationInPovertyUnder6;
    this.populationInPoverty6To11 = stat.populationInPoverty6To11;
    this.populationInPoverty12To17 = stat.populationInPoverty12To17;
  }

  updateDistrict(districtLayer?: GeoLayer) {
    if (!!districtLayer && !!districtLayer.feature && !!districtLayer.feature.properties) {
      this.district = districtLayer.feature.properties as DistrictFeature;
    }
  }
}
