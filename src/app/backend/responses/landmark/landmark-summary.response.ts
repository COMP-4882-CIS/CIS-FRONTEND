import {Landmark} from "../../types/landmark/landmark.type";

export interface LandmarkSummaryResponse {
  id: number;
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
  totalLEAD0: number;
  totalLEAD1:number;
  totalLEAD2: number;
  totalLEAD3:number;
  totalLEAD4: number;
  totalLEAD5:number;
  totalLEAD6: number;
  LEAD0: Landmark[];
  LEAD1: Landmark[];
  LEAD2: Landmark[];
  LEAD3: Landmark[];
  LEAD4: Landmark[];
  LEAD5: Landmark[];
  LEAD6: Landmark[];
  totalCOVIDVACC: number;
  totalCOVIDCASE: number;
  COVIDVACC: Landmark[];
  COVIDCASE: Landmark[];
  


}
