import {ZipTractBaseRequest} from "./zip-tract.base-request";

export interface ZipExportRequest extends ZipTractBaseRequest {
  zipCode: number;
}
