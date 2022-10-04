import {Landmark} from "../../types/landmark/landmark.type";

export interface LandmarkSummaryResponse {
  totalParks: number;
  totalCommunityCenters: number;
  totalLibraries: number;
  totalChildCare: number;
  childCare: Landmark[];
  parks: Landmark[];
  communityCenters: Landmark[];
  libraries: Landmark[];
}
