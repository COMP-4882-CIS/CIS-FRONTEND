import {Landmark} from "../../types/landmark/landmark.type";

export interface LandmarkSummaryResponse {
  totalParks: number;
  totalCommunityCenters: number;
  totalLibraries: number;
  totalCCF: number;
  CCF: Landmark[];
  totalCCC: number;
  CCC: Landmark[];
  parks: Landmark[];
  communityCenters: Landmark[];
  libraries: Landmark[];
}
