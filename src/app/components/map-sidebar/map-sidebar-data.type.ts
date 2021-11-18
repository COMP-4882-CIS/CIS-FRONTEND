import {BreakdownStat} from "../../backend/types/stat/breakdown-stat.type";
import {LandmarkSummaryResponse} from "../../backend/responses/landmark/landmark-summary.response";
import {ChartData} from "chart.js";
import {MapSidebarMode} from "./map-sidebar-mode.enum";
import {PointFeature} from "../../backend/types/geo/features/point";
import {LayerFeature} from "../../backend/types/geo/features/layer";

export interface MapSidebarData  {
  mode: MapSidebarMode;
  stat: BreakdownStat;
  landmarks?: LandmarkSummaryResponse;
  povertyChartData?: ChartData;
  genderChartData?: ChartData;
  overallChartData?: ChartData;
  pointFeatureData?: PointFeature;
  layerFeatureData?: LayerFeature;
  title?: string;
}
