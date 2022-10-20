import {Landmark} from "../../types/landmark/landmark.type";

export interface LandmarkSummaryResponse {
  totalParks: number;
  totalCommunityCenters: number;
  totalLibraries: number;
  totalCCF: number;
  totalCA: number;
  totalCBR: number;
  totalCD: number;
  totalCO: number;
  totalCT: number;
  totalCW: number;
  CCF: Landmark[];
  totalCCC: number;
  CCC: Landmark[];
  CA: Landmark[];
  CBR: Landmark[];
  CD: Landmark[];
  CO: Landmark[];
  CT: Landmark[];
  CW: Landmark[];
  parks: Landmark[];
  communityCenters: Landmark[];
  libraries: Landmark[];
}
