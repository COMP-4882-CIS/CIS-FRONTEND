import {GeoJSONObject} from "../../types/geo/geo-json.type";

export class GeoFeaturesResponse {
  data!: GeoJSONObject;
  total!: number;
  batchSize!: number;
  pagesRemaining!: number;
  currentPage!: number;
}
