import {ZipTractBaseRequest} from "./zip-tract.base-request";

export interface TractExportRequest extends ZipTractBaseRequest {
  tract: string;
  district?: string;
}
