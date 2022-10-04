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
  ageUnder5: number = 0;
  age5To9: number = 0;
  age10To14: number = 0;
  age15To19: number= 0;
  totalPopulation: number = 0;
  district?: DistrictFeature;

  constructor(rawData: { [key: string]: any }) {
    this.id = rawData['name'];

    delete rawData['name'];

    this.properties = rawData;
  }

  update(stat: BreakdownStat) {
    this.totalPopulation = stat.totalPopulation;
    this.ageUnder5 = stat.ageUnder5;
    this.age5To9 = stat.age5To9;
    this.age10To14 = stat.age10To14;
    this.age15To19 = stat.age15To19;
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
