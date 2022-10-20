import {Landmark} from "../../types/landmark/landmark.type";

export interface LandmarkSummaryResponse {
  totalParks: number;
  totalCommunityCenters: number;
  totalLibraries: number;
  totalCCF: number;
  totalCRIMES: number;
  CCF: Landmark[];
  totalCCC: number;
  CCC: Landmark[];
  crimes: Landmark[];
  parks: Landmark[];
  communityCenters: Landmark[];
  libraries: Landmark[];
}
