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
    let totalCCC: number = 0;
    let totalCCF: number = 0;
    let totalCA: number = 0;
    let totalCBR: number = 0;
    let totalCD: number = 0;
    let totalCT: number = 0;
    let totalCO: number = 0;
    let totalCW: number = 0;
    let parks: Landmark[] = [];
    let communityCenters: Landmark[] = [];
    let libraries: Landmark[] = [];
    let CCC: Landmark[] = [];
    let CCF: Landmark[] = [];
    let CA: Landmark[] = [];
    let CBR: Landmark[] = [];
    let CD: Landmark[] = [];
    let CT: Landmark[] = [];
    let CO: Landmark[] = [];
    let CW: Landmark[] = [];

    if (!!destination && !!addition) {
      totalParks = destination.totalParks + addition.totalParks;
      totalCommunityCenters = destination.totalCommunityCenters + addition.totalCommunityCenters;
      totalLibraries = destination.totalLibraries + destination.totalLibraries;
      totalCCC = destination.totalCCC + destination.totalCCC;
      totalCCF = destination.totalCCF + destination.totalCCF;
      totalCA = destination.totalCA + destination.totalCA;
      totalCBR = destination.totalCBR + destination.totalCBR;
      totalCD = destination.totalCD + destination.totalCD;
      totalCT = destination.totalCT+ destination.totalCT;
      totalCO = destination.totalCO+ destination.totalCO;
      totalCW = destination.totalCW + destination.totalCW;


      parks = [...destination.parks, ...addition.parks];
      communityCenters = [...destination.communityCenters, ...addition.communityCenters];
      libraries = [...destination.libraries, ...addition.libraries];
      CCC = [...destination.CCC, ...addition.CCC];
      CCF = [...destination.CCF, ...addition.CCF];
      CA = [...destination.CA, ...addition.CA];
      CBR = [...destination.CBR, ...addition.CBR];
      CD = [...destination.CD, ...addition.CD];
      CT = [...destination.CT, ...addition.CT];
      CO = [...destination.CO, ...addition.CO];
      CW = [...destination.CW, ...addition.CW];
    } else if (!!destination) {
      totalParks = destination.totalParks;
      totalCCC = destination.totalCCC;
      totalCCF = destination.totalCCF;
      totalCommunityCenters = destination.totalCommunityCenters;
      totalLibraries = destination.totalLibraries;
      totalCA = destination.totalCA;
      totalCBR = destination.totalCBR;
      totalCD = destination.totalCD;
      totalCT = destination.totalCT;
      totalCO = destination.totalCO;
      totalCW = destination.totalCW;

      parks = destination.parks;
      communityCenters = destination.communityCenters;
      libraries = destination.libraries;
      CCC = destination.CCC;
      CCF = destination.CCF;
      CA = destination.CA;
      CBR = destination.CBR;
      CD = destination.CD;
      CT = destination.CT;
      CO = destination.CO;
      CW = destination.CW;
    } else if (!!addition) {
      totalParks = addition.totalParks;
      totalCommunityCenters = addition.totalCommunityCenters;
      totalLibraries = addition.totalLibraries;
      totalCCC = addition.totalCCC;
      totalCCF = addition.totalCCF;
      totalCA = addition.totalCA;
      totalCBR = addition.totalCBR;
      totalCD = addition.totalCD;
      totalCT = addition.totalCT;
      totalCO = addition.totalCO;
      totalCW = addition.totalCW;

      parks = addition.parks;
      CCC = addition.CCC;
      CCF = addition.CCF;
      communityCenters = addition.communityCenters;
      libraries = addition.libraries;
      CA = addition.CA;
      CBR = addition.CBR;
      CD = addition.CD;
      CT = addition.CT;
      CO = addition.CO;
      CW = addition.CW;
    }

    return {
      totalParks,
      totalCommunityCenters,
      totalLibraries,
      totalCCC,
      totalCCF,
      totalCA,
      totalCBR,
      totalCD,
      totalCT,
      totalCO,
      totalCW,
      parks,
      communityCenters,
      libraries,
      CCC,
      CCF,
      CA,
      CBR,
      CD,
      CT,
      CO,
      CW 
    }
  }
}
