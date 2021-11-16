import {BreakdownStat} from "../stat/breakdown-stat.type";

export interface CensusFeatureProperties extends BreakdownStat {
  type: 'zip' | 'tract';
}

export interface ZipFeatureProperties extends CensusFeatureProperties {
  name: string;
}

export interface TractFeatureProperties extends CensusFeatureProperties {
  tract: string;
}
