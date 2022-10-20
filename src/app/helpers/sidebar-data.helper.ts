import {MapSidebarData} from "../components/map-sidebar/map-sidebar-data.type";
import {MapSidebarMode} from "../components/map-sidebar/map-sidebar-mode.enum";
import {BreakdownStat} from "../backend/types/stat/breakdown-stat.type";
import {LandmarkSummaryResponse} from "../backend/responses/landmark/landmark-summary.response";
import {ChartData} from "chart.js";
import {PointFeature} from "../backend/types/geo/features/point";
import {LayerFeature} from "../backend/types/geo/features/layer";
import {ChartDataHelper} from "./chart-data.helper";
import {Landmark} from "../backend/types/landmark/landmark.type";

export class SidebarDataHelper {
  static mergeMapSidebarData(destination: MapSidebarData, addition: MapSidebarData): MapSidebarData {
    let mode: MapSidebarMode = destination.mode;
    let stat: BreakdownStat = this.mergeStat(destination.stat, addition.stat);
    let landmarks: LandmarkSummaryResponse | undefined = this.mergeLandmarks(destination.landmarks, addition.landmarks);

    let povertyChartData: ChartData | undefined = destination.povertyChartData;
    let genderChartData: ChartData | undefined = destination.genderChartData;
    let overallChartData: ChartData | undefined = destination.overallChartData;
    let pointFeatureData: PointFeature | undefined = destination.pointFeatureData;
    let layerFeatureData: LayerFeature | undefined = destination.layerFeatureData;
    let title: string | undefined = destination.title;

    if (!!addition.povertyChartData && !!destination.povertyChartData) {
      povertyChartData = ChartDataHelper.mergePovertyChartData(destination.povertyChartData, addition.povertyChartData);
    } else if (!!addition.povertyChartData) {
      povertyChartData = addition.povertyChartData;
    }

    if (!!addition.genderChartData && !!destination.genderChartData) {
      genderChartData = ChartDataHelper.mergeGenderChartData(destination.genderChartData, addition.genderChartData);
    } else if (!!addition.genderChartData) {
      genderChartData = addition.genderChartData;
    }

    if (!!addition.overallChartData && !!destination.overallChartData) {
      overallChartData = ChartDataHelper.mergeOverallChartData(destination.overallChartData, addition.overallChartData);
    } else if (!!addition.overallChartData) {
      overallChartData = addition.overallChartData;
    }


    return {
      mode,
      stat,
      landmarks,
      povertyChartData,
      genderChartData,
      overallChartData,
      pointFeatureData,
      layerFeatureData,
      title,
    }
  }

  private static mergeStat(destination: BreakdownStat, addition: BreakdownStat): BreakdownStat {
    const newStat: { [key: string]: number } = {};

    Object.keys(addition).forEach(key => {
      if ((destination as any).hasOwnProperty(key)) {
        newStat[key] = (destination as any)[key] + (addition as any)[key]
      } else {
        newStat[key] = (addition as any)[key];
      }
    });

    return newStat as unknown as BreakdownStat;
  }

  private static mergeLandmarks(destination?: LandmarkSummaryResponse, addition?: LandmarkSummaryResponse): LandmarkSummaryResponse {
    let totalParks: number = 0;
    let totalCommunityCenters: number = 0;
    let totalLibraries: number = 0;
    let totalChildCare: number = 0;
    let totalCRIMES: number = 0;
    let parks: Landmark[] = [];
    let communityCenters: Landmark[] = [];
    let libraries: Landmark[] = [];
    let childCare: Landmark[] = [];
    let crimes: Landmark[] = [];

    if (!!destination && !!addition) {
      totalParks = destination.totalParks + addition.totalParks;
      totalCommunityCenters = destination.totalCommunityCenters + addition.totalCommunityCenters;
      totalLibraries = destination.totalLibraries + destination.totalLibraries;
      totalChildCare = destination.totalChildCare + destination.totalChildCare;
      totalCRIMES = destination.totalCRIMES + destination.totalCRIMES;

      parks = [...destination.parks, ...addition.parks];
      communityCenters = [...destination.communityCenters, ...addition.communityCenters];
      libraries = [...destination.libraries, ...addition.libraries];
      childCare = [...destination.childCare, ...addition.childCare];
      crimes = [...destination.crimes, ...addition.crimes];
    } else if (!!destination) {
      totalParks = destination.totalParks;
      totalChildCare = destination.totalChildCare;
      totalCommunityCenters = destination.totalCommunityCenters;
      totalLibraries = destination.totalLibraries;
      totalCRIMES = destination.totalCRIMES;

      parks = destination.parks;
      communityCenters = destination.communityCenters;
      libraries = destination.libraries;
      childCare = destination.childCare;
      crimes = destination.crimes;
    } else if (!!addition) {
      totalParks = addition.totalParks;
      totalCommunityCenters = addition.totalCommunityCenters;
      totalLibraries = addition.totalLibraries;
      totalChildCare = addition.totalChildCare;
      totalCRIMES = addition.totalCRIMES;

      parks = addition.parks;
      childCare = addition.childCare;
      communityCenters = addition.communityCenters;
      libraries = addition.libraries;
      crimes = addition.crimes;
    }

    return {
      totalParks,
      totalCommunityCenters,
      totalLibraries,
      totalChildCare,
      totalCRIMES,
      parks,
      communityCenters,
      libraries,
      childCare,
      crimes
    }
  }
}
