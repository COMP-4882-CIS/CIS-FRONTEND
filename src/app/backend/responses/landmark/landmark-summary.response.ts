import {Landmark} from "../../types/landmark/landmark.type";

export interface LandmarkSummaryResponse {
  totalParks: number;
  totalCommunityCenters: number;
  totalLibraries: number;
  parks: Landmark[];
  communityCenters: Landmark[];
  libraries: Landmark[];
}
