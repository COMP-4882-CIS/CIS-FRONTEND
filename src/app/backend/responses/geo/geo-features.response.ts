import {GeoJSONObject} from "../../types/geo/parsing/geo-json.type";

export class GeoFeaturesResponse {
  data!: GeoJSONObject;
  total!: number;
  batchSize!: number;
  pagesRemaining!: number;
  currentPage!: number;
}
