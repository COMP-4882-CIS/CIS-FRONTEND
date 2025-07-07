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
    let totalLEAD0: number = 0;
    let totalLEAD1: number = 0;
    let totalLEAD2: number = 0;
    let totalLEAD3: number = 0;
    let totalLEAD4: number = 0;
    let totalLEAD5: number = 0;
    let totalLEAD6: number = 0;
    let totalCOVIDCASE: number = 0;
    let totalCOVIDVACC: number = 0;


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
    let LEAD0: Landmark[] = [];
    let LEAD1: Landmark[] = [];
    let LEAD2: Landmark[] = [];
    let LEAD3: Landmark[] = [];
    let LEAD4: Landmark[] = [];
    let LEAD5: Landmark[] = [];
    let LEAD6: Landmark[] = [];
    let COVIDCASE: Landmark[] = [];
    let COVIDVACC: Landmark[] = [];

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
      totalLEAD0 = destination.totalLEAD0 + destination.totalLEAD0;
      totalLEAD1 = destination.totalLEAD1 + destination.totalLEAD1;
      totalLEAD2 = destination.totalLEAD2 + destination.totalLEAD2;
      totalLEAD3 = destination.totalLEAD3 + destination.totalLEAD3;
      totalLEAD4 = destination.totalLEAD4 + destination.totalLEAD4;
      totalLEAD5 = destination.totalLEAD5 + destination.totalLEAD5;
      totalLEAD6 = destination.totalLEAD6 + destination.totalLEAD6;
      totalCOVIDCASE = destination.totalCOVIDCASE + destination.totalCOVIDCASE;
      totalCOVIDVACC = destination.totalCOVIDVACC + destination.totalCOVIDVACC;




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
      LEAD0 = [...destination.LEAD0, ...addition.LEAD0];
      LEAD1 = [...destination.LEAD1, ...addition.LEAD1];
      LEAD2 = [...destination.LEAD2, ...addition.LEAD2];
      LEAD3 = [...destination.LEAD3, ...addition.LEAD3];
      LEAD4 = [...destination.LEAD4, ...addition.LEAD4];
      LEAD5= [...destination.LEAD5, ...addition.LEAD5];
      LEAD6= [...destination.LEAD6, ...addition.LEAD6];
      COVIDCASE= [...destination.COVIDCASE, ...addition.COVIDCASE];
      COVIDVACC= [...destination.COVIDVACC, ...addition.COVIDVACC];
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
      totalLEAD0 = destination.totalLEAD0;
      totalLEAD1 = destination.totalLEAD1;
      totalLEAD2 = destination.totalLEAD2;
      totalLEAD3 = destination.totalLEAD3;
      totalLEAD4 = destination.totalLEAD4;
      totalLEAD5 = destination.totalLEAD5;
      totalLEAD6 = destination.totalLEAD6;
      

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
      LEAD0 = destination.LEAD0;
      LEAD1 = destination.LEAD1;
      LEAD2 = destination.LEAD2;
      LEAD3 = destination.LEAD3;
      LEAD4 = destination.LEAD4;
      LEAD5 = destination.LEAD5;
      LEAD6= destination.LEAD6;
      COVIDCASE= destination.COVIDCASE;
      COVIDVACC= destination.COVIDVACC;
      

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
      totalLEAD0 = addition.totalLEAD0;
      totalLEAD1 = addition.totalLEAD1;
      totalLEAD2 = addition.totalLEAD2;
      totalLEAD3 = addition.totalLEAD3;
      totalLEAD4 = addition.totalLEAD4;
      totalLEAD5 = addition.totalLEAD5;
      totalLEAD6 = addition.totalLEAD6;
      totalCOVIDCASE = addition.totalCOVIDCASE;
      totalCOVIDVACC = addition.totalCOVIDVACC;


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
      LEAD0= addition.LEAD0;
      LEAD1 = addition.LEAD1;
      LEAD2 = addition.LEAD2;
      LEAD3 = addition.LEAD3;
      LEAD4 = addition.LEAD4;
      LEAD5= addition.LEAD5;
      LEAD6 = addition.LEAD6;
      COVIDCASE = addition.COVIDCASE;
      COVIDVACC= addition.COVIDVACC;

    }

    return {
      id,
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
      totalLEAD0,
      totalLEAD1,
      totalLEAD2,
      totalLEAD3,
      totalLEAD4,
      totalLEAD5,
      totalLEAD6,
      totalCOVIDCASE,
      totalCOVIDVACC,
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
      CW,
      LEAD0,
      LEAD1,
      LEAD2,
      LEAD3,
      LEAD4,
      LEAD5,
      LEAD6,
      COVIDCASE,
      COVIDVACC,
    }
  }
}
